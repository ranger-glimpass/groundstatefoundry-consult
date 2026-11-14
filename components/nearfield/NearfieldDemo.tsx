"use client";

/**
 * Nearfield v2, live in the browser. One small recurrent model runs through onnxruntime-web on 8 ms steps of
 * 16 kHz audio, the way it would on a live call. Nothing leaves the tab.
 *
 * Nothing heavy loads with the page: onnxruntime-web (JS) is fetched when the demo comes near
 * the viewport, and the model + wasm (about 13 MB, cached after) only when the person presses
 * one of the start buttons.
 */

import { useCallback, useEffect, useRef, useState } from "react";

const MODEL_BYTES = 2_554_307; // each model file, uncompressed
const ORT_SRC = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.3/dist/ort.wasm.min.js";
const BASE = "/nearfield/";

/* ---------------- minimal onnxruntime-web typing ---------------- */
type OrtTensor = { data: Float32Array };
type OrtSession = {
  run(feeds: Record<string, OrtTensor>): Promise<Record<string, OrtTensor>>;
  release?: () => Promise<void>;
};
type Ort = {
  env: { wasm: { numThreads: number; simd: boolean; wasmPaths: string | Record<string, string> } };
  Tensor: new (type: "float32", data: Float32Array, dims: number[]) => OrtTensor;
  InferenceSession: { create(model: Uint8Array, opts: { executionProviders: string[] }): Promise<OrtSession> };
};

let ortPromise: Promise<Ort> | null = null;
function loadOrt(): Promise<Ort> {
  const w = window as unknown as { ort?: Ort };
  if (w.ort) return Promise.resolve(w.ort);
  if (ortPromise) return ortPromise;
  ortPromise = new Promise<Ort>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = ORT_SRC;
    s.async = true;
    s.crossOrigin = "anonymous";
    s.onload = () => (w.ort ? resolve(w.ort) : reject(new Error("The ONNX runtime script did not load.")));
    s.onerror = () => {
      ortPromise = null;
      s.remove();
      reject(new Error("The ONNX runtime script did not load. Check your connection and try again."));
    };
    document.head.appendChild(s);
  });
  return ortPromise;
}

/* ---------------- signal processing ---------------- */
const N = 512, H = 128, NB = 257, SR = 16000, MAXT = 5;
/** Two sets of weights, same size and speed. They differ in how many 8 ms steps the model waits before it commits to a frame. */
export type Quality = "fast" | "best";
const MODELS: Record<Quality, { file: string; look: number; ms: number }> = {
  fast: { file: "nearfield-v2.1.onnx", look: 2, ms: 48 },
  best: { file: "nearfield-v2.2-best.onnx", look: 6, ms: 80 },
};
const STEP_MS = (H / SR) * 1000;

const FC = new Float64Array(N / 2), FS = new Float64Array(N / 2), REV = new Uint32Array(N);
for (let i = 0; i < N / 2; i++) { FC[i] = Math.cos((2 * Math.PI * i) / N); FS[i] = Math.sin((2 * Math.PI * i) / N); }
for (let i = 0; i < N; i++) { let r = 0; for (let b = 0; b < 9; b++) r |= ((i >> b) & 1) << (8 - b); REV[i] = r; }
/** In-place radix-2 complex FFT of size 512 (unnormalised). */
function fft(re: Float64Array, im: Float64Array, inv: boolean) {
  for (let i = 0; i < N; i++) { const j = REV[i]; if (j > i) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; } }
  for (let len = 2; len <= N; len <<= 1) {
    const half = len >> 1, step = N / len;
    for (let i = 0; i < N; i += len) for (let k = 0; k < half; k++) {
      const c = FC[k * step], sn = inv ? FS[k * step] : -FS[k * step], a = i + k, b = a + half;
      const tr = re[b] * c - im[b] * sn, ti = re[b] * sn + im[b] * c;
      re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
    }
  }
}
const WIN = new Float64Array(N).map((_, i) => 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / N));
/** The last 512 samples -> Float32Array [257*2] interleaved re,im. */
function analysis(buf: Float32Array) {
  const re = new Float64Array(N), im = new Float64Array(N);
  for (let i = 0; i < N; i++) re[i] = buf[i] * WIN[i];
  fft(re, im, false);
  const out = new Float32Array(NB * 2);
  for (let k = 0; k < NB; k++) { out[2 * k] = re[k]; out[2 * k + 1] = im[k]; }
  return out;
}
/** Spectrum [257*2] -> 128 samples out; updates the overlap buffer in place. */
function synthesis(Y: Float32Array, ola: Float64Array) {
  const re = new Float64Array(N), im = new Float64Array(N);
  for (let k = 0; k < NB; k++) { re[k] = Y[2 * k]; im[k] = Y[2 * k + 1]; }
  for (let k = NB; k < N; k++) { re[k] = re[N - k]; im[k] = -im[N - k]; }
  fft(re, im, true);
  const out = new Float32Array(H);
  for (let i = 0; i < N; i++) ola[i] += (re[i] / N) * WIN[i];
  for (let i = 0; i < H; i++) out[i] = ola[i] / 1.5;
  ola.copyWithin(0, H); ola.fill(0, N - H);
  return out;
}

/* clean-up after the model: runs here so it can be switched after recording. It only ever works on the
   model's own output; nothing from the original is mixed back in. */
type PostKey = "full" | "level" | "none";
type PostCfg = { level: number | null; blips: boolean; pause: number | null; tilt: number };
const POSTS: Record<PostKey, PostCfg | null> = {
  full: { level: -18, blips: true, pause: 18, tilt: -5 },
  level: { level: -18, blips: false, pause: null, tilt: 0 },
  none: null,
};
type Post = { spec: (Y: Float32Array, X: Float32Array) => void; time: (y: Float32Array) => void };

function makePost(p: PostCfg | null): Post | null {
  if (!p) return null;
  const g = new Float64Array(NB), gp = new Float64Array(NB), tilt = new Float64Array(NB).fill(1);
  if (p.tilt) for (let k = 0; k < NB; k++) tilt[k] = 10 ** ((p.tilt * Math.min(1, Math.max(0, (k * (SR / N) - 3000) / 2000))) / 20);
  let lvl = -26, gain = 1, top = -60, gate = 1, hold = 0;
  const UP = 1 - Math.exp(-8 / 150), DN = 1 - Math.exp(-8 / 3000), REL = Math.exp(-8 / 80);
  return {
    spec(Y, X) {
      let e = 0;
      for (let k = 0; k < NB; k++) g[k] = Math.min(2, Math.hypot(Y[2 * k], Y[2 * k + 1]) / (Math.hypot(X[2 * k], X[2 * k + 1]) + 1e-9));
      for (let k = 0; k < NB; k++) {
        let s = tilt[k];
        if (p.blips) {
          // a frequency that is loud while its neighbours and its own last step are quiet is a leftover: turn it down
          const l = Math.max(0, k - 1), r = Math.min(NB - 1, k + 1), ref = Math.max(gp[l], gp[k], gp[r], g[l], g[r]) * 1.5 + 0.03;
          if (g[k] > ref) s *= ref / g[k];
        }
        Y[2 * k] *= s; Y[2 * k + 1] *= s;
        e += Y[2 * k] ** 2 + Y[2 * k + 1] ** 2;
      }
      gp.set(g);
      if (p.pause) {
        // between the caller's words, fade the output down further
        const db = 10 * Math.log10((e / (N * N * 0.375)) * 2 + 1e-12);
        if (db > top) top = db; else top -= 0.004;
        const thr = Math.max(-70, top - 32);
        let want = 1;
        if (db >= thr) hold = 12; else if (hold > 0) hold--; else want = 10 ** (Math.max(-p.pause, db - thr) / 20);
        gate = want >= gate ? want : gate * REL + want * (1 - REL);
        if (gate < 1) for (let k = 0; k < NB * 2; k++) Y[k] *= gate;
      }
    },
    time(y) {
      if (p.level == null) return;
      // volume levelling with a soft limiter
      let e = 0; for (let i = 0; i < y.length; i++) e += y[i] * y[i];
      const db = 10 * Math.log10(e / y.length + 1e-12);
      if (db > Math.max(-55, lvl - 25)) lvl += (db > lvl ? UP : DN) * (db - lvl);
      const want = 10 ** (Math.min(18, Math.max(-12, p.level - lvl)) / 20), g1 = gain + (want - gain) * 0.08;
      for (let i = 0; i < y.length; i++) {
        let v = y[i] * (gain + ((g1 - gain) * i) / y.length);
        const a = Math.abs(v);
        if (a > 0.5) v = Math.sign(v) * (0.5 + 0.45 * Math.tanh((a - 0.5) / 0.45));
        y[i] = v;
      }
      gain = g1;
    },
  };
}

/* ---------------- engine ---------------- */
type Which = "orig" | "head";
type Rec = {
  q: Quality; look: number;
  label: string; state: Float32Array; win: Float32Array; hist: Float32Array[]; ola: Float64Array; post: Post | null;
  inp: Float32Array[]; head: Float32Array[]; pk: [number, number][]; own: Uint8Array[]; n: number;
  ys: Float32Array[]; xds: Float32Array[]; pending: Float32Array[]; buf: Float32Array; busy: boolean; done: boolean; finishing: boolean;
};
export type Status = { label: string; secs: number; ms: number; behind: number; done: boolean };
type Callbacks = {
  onStatus: (s: Status | null) => void;
  onPlaying: (p: boolean) => void;
  onBuffers: (ready: boolean) => void;
};
type Mic = { stream: MediaStream; node: AudioWorkletNode; srcN: MediaStreamAudioSourceNode; mute: GainNode; r: Rec };

const COL = { bg: "#070807", grid: "rgba(243,245,241,.08)", orig: "#6f746c", head: "#f3f5f1", playhead: "#b9f23a" };

function createEngine(cv: HTMLCanvasElement, cb: Callbacks) {
  let ort: Ort | null = null, quality: Quality = "fast";
  const sessions: Partial<Record<Quality, OrtSession>> = {}, loading: Partial<Record<Quality, Promise<void>>> = {};
  let R: Rec | null = null, frameMs: number[] = [];
  let preset: PostKey = "full";
  let actx: AudioContext | null = null, bufs: Record<Which, AudioBuffer> | null = null, which: Which = "head";
  let src: AudioBufferSourceNode | null = null, t0 = 0, off = 0, playing = false, raf = 0, timer = 0;
  let mic: Mic | null = null, workletReady = false, disposed = false;
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const ctx = () => {
    if (!actx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      actx = new AC({ sampleRate: SR });
    }
    return actx;
  };

  async function loadModel(q: Quality, onProgress: (pct: number | null) => void) {
    if (sessions[q]) return;
    if (loading[q]) return loading[q];
    loading[q] = (async () => {
      ort = await loadOrt();
      ort.env.wasm.numThreads = 1;
      ort.env.wasm.simd = true;
      ort.env.wasm.wasmPaths = BASE;
      const fetchBin = async (u: string, track: boolean) => {
        const r = await fetch(u);
        if (!r.ok) throw new Error("The model files did not download.");
        const total = Number(r.headers.get("content-length")) || 0;
        if (!track || !total || !r.body) return new Uint8Array(await r.arrayBuffer());
        // content-length is the compressed size when the host gzips, so it only drives the progress estimate
        const reader = r.body.getReader(), chunks: Uint8Array[] = [];
        let got = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value); got += value.length;
          onProgress(Math.min(99, Math.round((got / Math.max(total, MODEL_BYTES)) * 100)));
        }
        const out = new Uint8Array(got);
        let at = 0;
        for (const c of chunks) { out.set(c, at); at += c.length; }
        return out;
      };
      const m = await fetchBin(BASE + MODELS[q].file, true);
      onProgress(null);
      const created = await ort.InferenceSession.create(m, { executionProviders: ["wasm"] });
      if (disposed) { created.release?.(); return; }
      sessions[q] = created;
    })();
    try { await loading[q]; } catch (e) { delete loading[q]; throw e; }
  }

  function fresh(label: string): Rec {
    return {
      q: quality, look: MODELS[quality].look,
      label, state: new Float32Array(4 * 64 * 128), win: new Float32Array(N), hist: [], ola: new Float64Array(N), post: makePost(POSTS[preset]),
      inp: [], head: [], pk: [], own: [], n: 0, ys: [], xds: [], pending: [], buf: new Float32Array(0),
      busy: false, done: false, finishing: false,
    };
  }

  /** Up to MAXT steps (8 ms each) in one model call. */
  async function step(r: Rec, frs: Float32Array[]) {
    const O = ort!, t = performance.now(), T = frs.length, W = NB * 2;
    const X = new Float32Array(T * W), Xd = new Float32Array(T * W);
    for (let i = 0; i < T; i++) {
      r.win.copyWithin(0, H); r.win.set(frs[i], N - H);
      const sp = analysis(r.win); X.set(sp, i * W);
      r.hist.push(sp); if (r.hist.length > r.look) Xd.set(r.hist.shift()!, i * W); // the model finishes the frame from `look` steps back
    }
    const o = await sessions[r.q]!.run({
      x: new O.Tensor("float32", X, [T, NB, 2]),
      xd: new O.Tensor("float32", Xd, [T, NB, 2]),
      state: new O.Tensor("float32", r.state, [4, 64, 128]),
    });
    r.state = o.new_state.data;
    for (let i = 0; i < T; i++) {
      const y = o.y.data.slice(i * W, (i + 1) * W), xd = Xd.slice(i * W, (i + 1) * W), fr = frs[i];
      r.ys.push(y); r.xds.push(xd);
      const kept = new Uint8Array(32); // share of each frequency band that was kept
      for (let b = 0; b < 32; b++) {
        let a = 0, c = 0;
        for (let k = 8 * b; k < 8 * b + 8; k++) { a += y[2 * k] ** 2 + y[2 * k + 1] ** 2; c += xd[2 * k] ** 2 + xd[2 * k + 1] ** 2; }
        kept[b] = Math.round(255 * Math.min(1, Math.sqrt(a / (c + 1e-9))));
      }
      const yy = Float32Array.from(y); r.post?.spec(yy, xd);
      const yh = synthesis(yy, r.ola); r.post?.time(yh);
      r.inp.push(fr); r.head.push(yh); r.own.push(kept);
      let a = 0, b = 0;
      for (let k = 0; k < H; k++) { a = Math.max(a, Math.abs(fr[k])); b = Math.max(b, Math.abs(yh[k])); }
      r.pk.push([a, b]); r.n++;
    }
    frameMs.push((performance.now() - t) / T); if (frameMs.length > 200) frameMs.shift();
  }
  function push(r: Rec, samples: Float32Array) {
    const b = new Float32Array(r.buf.length + samples.length); b.set(r.buf); b.set(samples, r.buf.length);
    let i = 0; for (; i + H <= b.length; i += H) r.pending.push(b.slice(i, i + H));
    r.buf = b.slice(i); pump(r);
  }
  async function pump(r: Rec) {
    if (r.busy) return; r.busy = true;
    try {
      let calls = 0;
      while (r.pending.length && r === R && !disposed) {
        await step(r, r.pending.splice(0, MAXT));
        if (++calls % 6 === 0) { status(); draw(); await new Promise((res) => setTimeout(res)); }
      }
    } finally { r.busy = false; }
    if (r !== R || disposed) return;
    status(); draw();
    if (r.finishing && !r.pending.length) finish(r);
  }
  function end(r: Rec) { r.finishing = true; for (let k = 0; k < r.look + 4; k++) r.pending.push(new Float32Array(H)); pump(r); }

  // r.look + 4 silent steps are pushed through at the end so the last real audio comes out;
  // the cleaned audio sits r.look + 3 steps behind the input (look-ahead, then 3 steps of overlap-add)
  const delay = (r: Rec) => (r.look + 3) * H;

  /* playback */
  function cat(chunks: Float32Array[], skip: number, len: number) {
    const all = new Float32Array(chunks.length * H); chunks.forEach((c, i) => all.set(c, i * H));
    return all.subarray(skip, skip + len);
  }
  const mk = (x: Float32Array) => { const b = ctx().createBuffer(1, Math.max(1, x.length), SR); b.copyToChannel(Float32Array.from(x), 0); return b; };
  function finish(r: Rec) {
    if (r.done) return; r.done = true;
    const len = Math.max(0, (r.n - r.look - 4) * H);
    bufs = { orig: mk(cat(r.inp, 0, len)), head: mk(cat(r.head, delay(r), len)) };
    off = 0; cb.onBuffers(true); status(); draw(); stamp();
  }
  /** Test hook: energy of the cleaned buffer, so a preset switch can be checked from outside. */
  function stamp() {
    if (!bufs) { delete cv.dataset.headRms; return; }
    const d = bufs.head.getChannelData(0); let s = 0; for (let i = 0; i < d.length; i++) s += d[i] * d[i];
    cv.dataset.headRms = Math.sqrt(s / Math.max(1, d.length)).toExponential(4);
  }
  /** Re-apply the clean-up to stored model outputs: no model rerun. */
  function rerender() {
    if (!R) return; R.post = makePost(POSTS[preset]);
    if (!R.done || !bufs) return;
    const ola = new Float64Array(N), post = makePost(POSTS[preset]);
    for (let f = 0; f < R.n; f++) {
      const yy = Float32Array.from(R.ys[f]); post?.spec(yy, R.xds[f]);
      const yh = synthesis(yy, ola); post?.time(yh);
      R.head[f] = yh;
      let b = 0; for (let i = 0; i < H; i++) b = Math.max(b, Math.abs(yh[i])); R.pk[f][1] = b;
    }
    const was = playing && which === "head", p = pos();
    bufs.head = mk(cat(R.head, delay(R), bufs.orig.length));
    if (was) startAt(p);
    draw(); stamp();
  }
  const pos = () => (playing && actx ? off + actx.currentTime - t0 : off);
  function stopSrc() { if (src) { src.onended = null; try { src.stop(); } catch {} src.disconnect(); src = null; } }
  function startAt(o: number) {
    const b = bufs && bufs[which]; if (!b) return; stopSrc();
    const c = ctx(); src = c.createBufferSource(); src.buffer = b; src.connect(c.destination);
    o = Math.max(0, Math.min(o, b.duration - 0.01)); src.start(0, o); t0 = c.currentTime; off = o; setPlaying(true);
    src.onended = () => { setPlaying(false); off = 0; draw(); };
    loop();
  }
  function halt() { if (!playing) return; off = pos(); stopSrc(); setPlaying(false); draw(); }
  function setPlaying(p: boolean) { playing = p; cb.onPlaying(p); if (!p) { cancelAnimationFrame(raf); clearTimeout(timer); } }
  function loop() {
    cancelAnimationFrame(raf); clearTimeout(timer); draw();
    if (!playing) return;
    // reduced motion: move the playhead in calm 4 fps steps instead of a smooth sweep
    if (reduced) timer = window.setTimeout(loop, 250); else raf = requestAnimationFrame(loop);
  }

  /* drawing: original on top, cleaned below, what was kept in each frequency band as a strip */
  function draw() {
    const g = cv.getContext("2d"); if (!g) return;
    const W = cv.width, Hh = cv.height, h1 = Hh * 0.42, h3 = Hh * 0.16;
    g.fillStyle = COL.bg; g.fillRect(0, 0, W, Hh);
    g.fillStyle = COL.grid; g.fillRect(0, Math.round(h1), W, 1); g.fillRect(0, Math.round(2 * h1), W, 1);
    if (!R || !R.n) return;
    const r = R, live = !r.done, total = r.n, span = live ? Math.max(total, 1250) : total, start = live ? Math.max(0, total - span) : 0;
    let mx = 1e-4; for (let f = start; f < total; f++) mx = Math.max(mx, r.pk[f][0]);
    const lane = (y0: number, hh: number, getPk: (f: number) => number, col: string) => {
      g.fillStyle = col;
      for (let px = 0; px < W; px++) {
        const f0 = Math.floor(start + (px / W) * span), f1 = Math.max(f0 + 1, Math.floor(start + ((px + 1) / W) * span));
        let a = 0; for (let f = f0; f < f1 && f < total; f++) a = Math.max(a, getPk(f));
        if (!a) continue;
        const hgt = Math.max(0.5, Math.min(1, a / mx) * (hh / 2 - 6));
        g.fillRect(px, y0 + hh / 2 - hgt, 1, 2 * hgt);
      }
    };
    lane(0, h1, (f) => r.pk[f][0], COL.orig);
    lane(h1, h1, (f) => { const g2 = f + r.look + 3; return g2 < total ? r.pk[g2][1] : 0; }, COL.head);
    const rows = Math.max(1, Math.round(h3)), img = g.createImageData(W, rows);
    for (let px = 0; px < W; px++) {
      const f = Math.floor(start + (px / W) * span) + r.look; if (f >= total) continue; const o = r.own[f];
      for (let yy = 0; yy < rows; yy++) {
        const band = 31 - Math.floor((yy / rows) * 32), v = o[band] / 255, idx = (yy * W + px) * 4;
        img.data[idx] = 7 + v * 236; img.data[idx + 1] = 8 + v * 237; img.data[idx + 2] = 7 + v * 234; img.data[idx + 3] = 255;
      }
    }
    g.putImageData(img, 0, Math.round(2 * h1));
    if (bufs) { const p = (pos() / bufs.orig.duration) * W, lw = Math.max(2, W / 600); g.fillStyle = COL.playhead; g.fillRect(p - lw / 2, 0, lw, Hh); }
  }
  function status() {
    if (!R) { cb.onStatus(null); return; }
    const ms = frameMs.length ? frameMs.reduce((a, b) => a + b) / frameMs.length : 0;
    cb.onStatus({ label: R.label, secs: (R.n * H) / SR, ms, behind: R.pending.length * STEP_MS, done: R.done });
  }
  function begin(label: string) {
    halt(); bufs = null; off = 0; cb.onBuffers(false); R = fresh(label); frameMs = []; status(); draw(); stamp(); return R;
  }

  async function decodeTo48k(ab: ArrayBuffer) {
    const tmp = await ctx().decodeAudioData(ab);
    const oc = new OfflineAudioContext(1, Math.max(1, Math.ceil(tmp.duration * SR)), SR), s = oc.createBufferSource();
    s.buffer = tmp; s.connect(oc.destination); s.start();
    const out = (await oc.startRendering()).getChannelData(0);
    let pk = 0; for (let i = 0; i < out.length; i++) pk = Math.max(pk, Math.abs(out[i]));
    return pk > 0 ? out.map((v) => (v / pk) * 0.5) : out;
  }
  function runSamples(label: string, x: Float32Array) {
    const r = begin(label);
    for (let i = 0; i < x.length; i += SR) push(r, x.subarray(i, i + SR));
    end(r);
  }

  async function startMic() {
    if (!navigator.mediaDevices?.getUserMedia) {
      const e = new Error("insecure"); e.name = "InsecureContext"; throw e;
    }
    const c = ctx(); // created inside the click, so it is allowed to start
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: true, channelCount: 1 },
    });
    try {
      if (c.state === "suspended") await c.resume();
      if (!workletReady) {
        const code = "class C extends AudioWorkletProcessor{process(i){const c=i[0]&&i[0][0];if(c)this.port.postMessage(c.slice(0));return true}};registerProcessor('nf-cap',C)";
        const url = URL.createObjectURL(new Blob([code], { type: "application/javascript" }));
        try { await c.audioWorklet.addModule(url); } finally { URL.revokeObjectURL(url); }
        workletReady = true;
      }
      if (disposed) { stream.getTracks().forEach((t) => t.stop()); return; }
      const r = begin("Live mic"), srcN = c.createMediaStreamSource(stream);
      const node = new AudioWorkletNode(c, "nf-cap");
      node.port.onmessage = (e: MessageEvent<Float32Array>) => push(r, e.data);
      const mute = c.createGain(); mute.gain.value = 0;
      srcN.connect(node); node.connect(mute); mute.connect(c.destination);
      mic = { stream, node, srcN, mute, r };
    } catch (e) {
      stream.getTracks().forEach((t) => t.stop());
      throw e;
    }
  }
  function stopMic() {
    const m = mic; if (!m) return; mic = null;
    m.node.port.onmessage = null;
    m.srcN.disconnect(); m.node.disconnect(); m.mute.disconnect();
    m.stream.getTracks().forEach((t) => t.stop());
    end(m.r);
  }

  return {
    ctx,
    loadModel,
    isReady(q: Quality) { return !!sessions[q]; },
    /** Switch model. A finished recording is run again through the new one; its weights must be loaded first. */
    setModel(q: Quality) {
      if (q === quality) return; quality = q;
      if (R && R.done && bufs) runSamples(R.label, Float32Array.from(bufs.orig.getChannelData(0)));
    },
    get recording() { return !!mic; },
    draw,
    async runExample(file: string, label: string) {
      const r = await fetch(BASE + "examples/" + file);
      if (!r.ok) throw new Error("example");
      runSamples(label, await decodeTo48k(await r.arrayBuffer()));
    },
    async runFile(f: File) { runSamples(f.name, await decodeTo48k(await f.arrayBuffer())); },
    startMic,
    stopMic,
    async togglePlay() {
      if (!bufs) return;
      const c = ctx(); if (c.state === "suspended") await c.resume();
      if (playing) halt(); else startAt(off);
    },
    setWhich(w: Which) { const was = playing, p = pos(); which = w; if (was) startAt(p); draw(); },
    setPreset(p: PostKey) { preset = p; rerender(); },
    seek(frac: number) {
      if (!bufs) return; const t = frac * bufs.orig.duration;
      if (playing) startAt(t); else { off = t; draw(); }
    },
    dispose() {
      disposed = true;
      if (mic) { const m = mic; mic = null; m.srcN.disconnect(); m.node.disconnect(); m.mute.disconnect(); m.stream.getTracks().forEach((t) => t.stop()); }
      stopSrc(); cancelAnimationFrame(raf); clearTimeout(timer);
      R = null; bufs = null;
      if (actx) { actx.close().catch(() => {}); actx = null; }
      for (const q of Object.keys(sessions) as Quality[]) { sessions[q]!.release?.().catch(() => {}); delete sessions[q]; }
    },
  };
}
type Engine = ReturnType<typeof createEngine>;

/* ---------------- UI ---------------- */
const NOTE_DEFAULT =
  "Switching between original and cleaned while it plays keeps your place. Click the waveform to seek. The delay a live call would have is 48 ms with the fast model and 80 ms with the best one.";

const MODEL_BTNS: { k: Quality; label: string }[] = [
  { k: "fast", label: "Fast · 48 ms delay" },
  { k: "best", label: "Best · 80 ms delay" },
];

const PRESET_BTNS: { k: PostKey; label: string }[] = [
  { k: "full", label: "Full v2" },
  { k: "level", label: "Volume levelling only" },
  { k: "none", label: "Model output only" },
];
/** The same support call over five backgrounds, from easy to hard. */
const EXAMPLES: { k: number; file: string; tab: string; d: string }[] = [
  { k: 1, file: "level1.wav", tab: "1 · Quiet room noise", d: "Office noise, well below the caller. Nobody else is talking." },
  { k: 2, file: "level2.wav", tab: "2 · Loud room noise", d: "The same office noise, close to the caller's level. Nobody else is talking." },
  { k: 3, file: "level3.wav", tab: "3 · Someone talking, quieter", d: "One person talking in the room, quieter than the caller." },
  { k: 4, file: "level4.wav", tab: "4 · Someone talking, as loud", d: "One person talking in the room, as loud as the caller." },
  { k: 5, file: "level5.wav", tab: "5 · A room full of people", d: "Babble: several people talking at once, together as loud as the caller." },
];
const WHICH_BTNS: { k: Which; label: string }[] = [
  { k: "orig", label: "Original" },
  { k: "head", label: "Nearfield" },
];

function Seg({ pressed, onClick, children, disabled }: { pressed: boolean; onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 font-mono text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        pressed
          ? "border-[var(--color-fg)] bg-[var(--color-fg)] text-[var(--color-bg)]"
          : "border-[var(--color-border-bright)] text-[var(--color-muted)] hover:border-[var(--color-muted)] hover:text-[var(--color-fg)]"
      }`}
    >
      {children}
    </button>
  );
}

type Phase = "idle" | "loading" | "ready" | "error";

export default function NearfieldDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const engRef = useRef<Engine | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState<number | null>(null);
  const [modelErr, setModelErr] = useState("");
  const [status, setStatus] = useState<Status | null>(null);
  const [note, setNote] = useState<{ t: string; err: boolean }>({ t: NOTE_DEFAULT, err: false });
  const [playing, setPlaying] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [which, setWhich] = useState<Which>("head");
  const [preset, setPreset] = useState<PostKey>("full");
  const [ex, setEx] = useState<number | null>(null);
  const [quality, setQuality] = useState<Quality>("fast");
  const qRef = useRef<Quality>("fast");

  // engine + canvas sizing
  useEffect(() => {
    const cv = cvRef.current!;
    const eng = createEngine(cv, { onStatus: setStatus, onPlaying: setPlaying, onBuffers: setCanPlay });
    engRef.current = eng;
    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(cv.clientWidth * dpr)), h = Math.max(1, Math.round(cv.clientHeight * dpr));
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
      eng.draw();
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(cv);
    return () => { ro.disconnect(); eng.dispose(); engRef.current = null; };
  }, []);

  // fetch the small runtime script once the demo is near the screen; the model waits for a click
  useEffect(() => {
    const el = rootRef.current; if (!el) return;
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { loadOrt().catch(() => {}); io.disconnect(); }
    }, { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const ensureModel = useCallback(async () => {
    const eng = engRef.current; if (!eng) return false;
    const q = qRef.current;
    if (eng.isReady(q)) return true;
    setPhase("loading"); setModelErr("");
    try {
      await eng.loadModel(q, setProgress);
      if (engRef.current !== eng) return false;
      setPhase("ready");
      return true;
    } catch (e) {
      if (engRef.current !== eng) return false;
      setPhase("error"); setProgress(null);
      setModelErr(String((e as Error)?.message || e).slice(0, 200));
      return false;
    }
  }, []);

  const onExample = async (e: (typeof EXAMPLES)[number]) => {
    const eng = engRef.current; if (!eng || busy) return;
    setEx(e.k);
    eng.ctx(); // create the audio context inside the click
    setNote({ t: NOTE_DEFAULT, err: false });
    if (eng.recording) { eng.stopMic(); setRecording(false); }
    setBusy(true);
    try {
      if (!(await ensureModel())) return;
      await eng.runExample(e.file, `Example call, level ${e.k}`);
    } catch {
      setEx(null);
      setNote({ t: "The example call did not load. Check your connection and try again.", err: true });
    } finally { setBusy(false); }
  };

  const onModel = async (q: Quality) => {
    const eng = engRef.current; if (!eng || busy || q === qRef.current) return;
    const prev = qRef.current;
    qRef.current = q; setQuality(q);
    if (!status) { return; } // nothing processed yet: the weights load with the first audio
    setBusy(true);
    try {
      if (await ensureModel()) eng.setModel(q);
      else { qRef.current = prev; setQuality(prev); }
    } finally { setBusy(false); }
  };

  const onFile = async (f: File | undefined) => {
    const eng = engRef.current; if (!eng || !f) return;
    setEx(null);
    eng.ctx();
    setNote({ t: NOTE_DEFAULT, err: false });
    if (eng.recording) { eng.stopMic(); setRecording(false); }
    setBusy(true);
    try {
      if (!(await ensureModel())) return;
      await eng.runFile(f);
    } catch {
      setNote({ t: "That file could not be decoded as audio. Try a WAV, M4A or MP3 file.", err: true });
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onRecord = async () => {
    const eng = engRef.current; if (!eng) return;
    if (eng.recording) { eng.stopMic(); setRecording(false); return; }
    setEx(null);
    eng.ctx();
    setNote({ t: NOTE_DEFAULT, err: false });
    setBusy(true);
    try {
      if (!(await ensureModel())) return;
      await eng.startMic();
      setRecording(eng.recording);
    } catch (e) {
      const name = (e as Error)?.name;
      setNote({
        t:
          name === "NotAllowedError" || name === "SecurityError"
            ? "The microphone is blocked for this page. Allow microphone access in your browser's site settings and try again, or record on your phone and use “Open a recording”."
            : name === "InsecureContext"
              ? "This browser only allows the microphone on secure (https) pages. Use “Open a recording” instead."
              : "No microphone was found, or it could not be opened. You can still use “Open a recording” or the example call.",
        err: true,
      });
    } finally { setBusy(false); }
  };

  const onSeek = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rc = e.currentTarget.getBoundingClientRect();
    engRef.current?.seek(Math.min(1, Math.max(0, (e.clientX - rc.left) / rc.width)));
  };

  const startDisabled = busy || phase === "loading";

  let statLine: React.ReactNode;
  if (phase === "loading") statLine = <>Loading the model{progress != null ? ` · ${progress}%` : ""} (about 13 MB, once; your browser caches it)…</>;
  else if (phase === "error") statLine = <span className="text-[var(--color-magenta)]">The model could not start in this browser: {modelErr}</span>;
  else if (status) {
    statLine = (
      <>
        {status.label} · <b className="font-medium text-[var(--color-fg)]">{status.secs.toFixed(1)} s</b> processed
        {status.ms > 0 && (
          <>
            {" · "}
            <b className="font-medium text-[var(--color-fg)]" data-testid="frame-ms">{status.ms.toFixed(1)} ms</b> per 8 ms step (
            {status.ms < 8 ? "real time" : <span className="text-[var(--color-magenta)]">slower than real time on this device</span>})
          </>
        )}
        {status.behind > 200 && !status.done && <span className="text-[var(--color-magenta)]"> · {(status.behind / 1000).toFixed(1)} s behind</span>}
        {status.done && " · done, press play"}
      </>
    );
  } else if (phase === "ready") statLine = <>Model ready. It runs in this tab, nothing is uploaded.</>;
  else statLine = <>Press a button to start. The model (about 13 MB) loads then, once, and runs entirely in this tab.</>;

  const placeholder =
    phase === "loading" ? "Loading the model…" : phase === "error" ? "The model did not load." : "Pick an example level, record, or open a file.";

  return (
    <div ref={rootRef} className="card p-4 sm:p-7" data-phase={phase} data-done={status?.done ? "1" : "0"}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <span className="mono-label">Example call · background level</span>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Example call, by how hard the background is">
          {EXAMPLES.map((e) => (
            <Seg key={e.k} pressed={ex === e.k} disabled={startDisabled || recording} onClick={() => onExample(e)}>{e.tab}</Seg>
          ))}
        </div>
      </div>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-muted)]" data-testid="nf-example">
        {ex ? EXAMPLES[ex - 1].d + " " : "Pick a level to run it. "}
        It is the same support call each time: the caller reports a damaged order and gives an order number
        (472916), an email address (maya.fernandes@example.com) and a phone number (555 0142). Listen for whether
        they come through.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="mono-label">Or your own audio</span>
        <button
          type="button"
          onClick={onRecord}
          disabled={startDisabled && !recording}
          aria-pressed={recording}
          className={`btn ${recording ? "border border-[var(--color-magenta)] text-[var(--color-magenta)]" : "btn-ghost"}`}
        >
          <span aria-hidden className={`inline-block h-2.5 w-2.5 ${recording ? "rounded-[2px] bg-[var(--color-magenta)]" : "rounded-full bg-[var(--color-magenta)]"}`} />
          {recording ? "Stop recording" : "Record from mic"}
        </button>
        <label className={`btn btn-ghost relative cursor-pointer overflow-hidden focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--color-muted)] ${startDisabled || recording ? "pointer-events-none opacity-40" : ""}`}>
          Open a recording…
          <input
            ref={fileRef}
            type="file"
            accept="audio/*,video/*"
            disabled={startDisabled || recording}
            onChange={(e) => onFile(e.target.files?.[0])}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
      </div>

      <p className="mt-4 font-mono text-xs leading-relaxed tabular-nums text-[var(--color-muted)]" role="status" aria-live="polite" data-testid="nf-status">
        {statLine}
      </p>

      <div className="relative mt-4 overflow-hidden rounded-xl border border-[var(--color-border-bright)] bg-[#070807]">
        <canvas
          ref={cvRef}
          onClick={onSeek}
          className={`block h-[220px] w-full sm:h-[300px] ${canPlay ? "cursor-pointer" : ""}`}
          aria-label="Original and cleaned waveforms, with how much of each frequency band was kept"
          data-testid="nf-wave"
        />
        <div className="pointer-events-none absolute inset-0 grid grid-rows-[42%_42%_16%] font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)] sm:text-[11px]">
          <span className="self-start justify-self-start m-1.5 rounded bg-[#070807]/85 px-1.5 py-0.5">Original</span>
          <span className="self-start justify-self-start m-1.5 rounded bg-[#070807]/85 px-1.5 py-0.5">Cleaned · Nearfield</span>
          <span className="self-start justify-self-start m-1.5 rounded bg-[#070807]/85 px-1.5 py-0.5 text-[var(--color-fg)]">Kept, by frequency</span>
        </div>
        {!status && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-[var(--color-muted)]">
            {placeholder}
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        <button
          type="button"
          onClick={() => engRef.current?.togglePlay()}
          disabled={!canPlay}
          aria-label={playing ? "Pause" : "Play"}
          className="grid h-11 w-11 flex-none place-items-center rounded-full bg-[var(--color-fg)] text-[var(--color-bg)] transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
            {playing ? <path d="M5 3h4v14H5zM11 3h4v14h-4z" /> : <path d="M6 3l11 7-11 7z" />}
          </svg>
        </button>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Which version to play">
          {WHICH_BTNS.map((b) => (
            <Seg key={b.k} pressed={which === b.k} onClick={() => { setWhich(b.k); engRef.current?.setWhich(b.k); }}>{b.label}</Seg>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
        <span className="mono-label">Model</span>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Which model: the fast one or the best one">
          {MODEL_BTNS.map((b) => (
            <Seg key={b.k} pressed={quality === b.k} disabled={startDisabled || recording || (!!status && !status.done)} onClick={() => onModel(b.k)}>{b.label}</Seg>
          ))}
        </div>
      </div>
      <p className="mt-2 max-w-3xl text-xs leading-relaxed text-[var(--color-dim)]">
        Same size, same speed. The best model waits 32 ms longer before it commits to each moment, and keeps more of
        the caller when other people are talking. Switching runs the same audio again.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
        <span className="mono-label">Clean-up after the model</span>
        <div className="flex flex-wrap gap-2" role="group" aria-label="What is done to the model output">
          {PRESET_BTNS.map((b) => (
            <Seg key={b.k} pressed={preset === b.k} onClick={() => { setPreset(b.k); engRef.current?.setPreset(b.k); }}>{b.label}</Seg>
          ))}
        </div>
      </div>

      <p className={`mt-5 text-sm leading-relaxed ${note.err ? "text-[var(--color-magenta)]" : "text-[var(--color-muted)]"}`} role={note.err ? "alert" : undefined}>
        {note.t}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-[var(--color-dim)]">
        Everything runs in this browser tab. Nothing you record or open is uploaded.
      </p>
    </div>
  );
}
