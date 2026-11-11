"use client";

/**
 * Nearfield, live in the browser. Ported from the Nearfield Recorder prototype.
 * DeepFilterNet3 + the caller-ownership head run as one ONNX model through onnxruntime-web,
 * one 10 ms frame at a time, the way it would on a live call. Nothing leaves the tab.
 *
 * Nothing heavy loads with the page: onnxruntime-web (JS) is fetched when the demo comes near
 * the viewport, and the model + wasm (about 22 MB, cached after) only when the person presses
 * one of the start buttons.
 */

import { useCallback, useEffect, useRef, useState } from "react";

const MODEL_BYTES = 11_049_031; // nearfield-v1.onnx, uncompressed
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

/* ---------------- signal processing (unchanged from the prototype) ---------------- */
const N = 960, H = 480, NB = 481, SR = 48000, DELAY = 3 * H; // 2 lookahead frames + 1 window hop

const COS = new Float64Array(N), SIN = new Float64Array(N);
for (let i = 0; i < N; i++) { COS[i] = Math.cos((2 * Math.PI * i) / N); SIN[i] = Math.sin((2 * Math.PI * i) / N); }
const factor = (n: number) => (n % 2 === 0 ? 2 : n % 3 === 0 ? 3 : n % 5 === 0 ? 5 : n);
/** Mixed-radix complex FFT for N = 960 = 2^6 * 3 * 5 (unnormalised). */
function cfft(xr: Float64Array, xi: Float64Array, inv: boolean): [Float64Array, Float64Array] {
  const n = xr.length;
  if (n === 1) return [xr, xi];
  const p = factor(n), m = n / p, sub: [Float64Array, Float64Array][] = [];
  for (let r = 0; r < p; r++) {
    const a = new Float64Array(m), b = new Float64Array(m);
    for (let k = 0; k < m; k++) { a[k] = xr[p * k + r]; b[k] = xi[p * k + r]; }
    sub.push(cfft(a, b, inv));
  }
  const or = new Float64Array(n), oi = new Float64Array(n), step = N / n, sg = inv ? 1 : -1;
  for (let k = 0; k < n; k++) {
    let ar = 0, ai = 0;
    const kk = k % m;
    for (let r = 0; r < p; r++) {
      const t = (r * k * step) % N, c = COS[t], s = sg * SIN[t], [sr, si] = sub[r];
      ar += sr[kk] * c - si[kk] * s;
      ai += sr[kk] * s + si[kk] * c;
    }
    or[k] = ar; oi[k] = ai;
  }
  return [or, oi];
}
const WIN = new Float64Array(N).map((_, i) => Math.sin(0.5 * Math.PI * Math.sin((0.5 * Math.PI * (i + 0.5)) / H) ** 2));
const WNORM = 1 / ((N * N) / (2 * H));
/** One 10 ms frame -> Float32Array [481*2] interleaved re,im. */
function analysis(mem: Float32Array, fr: Float32Array) {
  const xr = new Float64Array(N), xi = new Float64Array(N);
  for (let i = 0; i < H; i++) { xr[i] = mem[i] * WIN[i]; xr[H + i] = fr[i] * WIN[H + i]; }
  const [r, im] = cfft(xr, xi, false), out = new Float32Array(NB * 2);
  for (let k = 0; k < NB; k++) { out[2 * k] = r[k] * WNORM; out[2 * k + 1] = im[k] * WNORM; }
  return out;
}
/** Spectrum [481*2] -> 480 samples out; updates the overlap memory in place. */
function synthesis(Y: Float32Array, mem: Float64Array) {
  const xr = new Float64Array(N), xi = new Float64Array(N);
  for (let k = 0; k < NB; k++) { xr[k] = Y[2 * k]; xi[k] = Y[2 * k + 1]; }
  for (let k = NB; k < N; k++) { xr[k] = Y[2 * (N - k)]; xi[k] = -Y[2 * (N - k) + 1]; }
  const [r] = cfft(xr, xi, true), out = new Float32Array(H);
  for (let i = 0; i < H; i++) { out[i] = r[i] * WIN[i] + mem[i]; mem[i] = r[H + i] * WIN[H + i]; }
  return out;
}

/* keep/cut rule: runs here, not in the model, so the strength can be switched after recording */
const WID = [2,2,2,2,2,2,2,2,2,2,2,2,2,5,5,7,7,8,10,12,13,15,18,20,24,28,31,37,42,50,56,67];
const BAND = new Uint8Array(NB);
{ let b0 = 0; WID.forEach((w, j) => { for (let i = 0; i < w; i++) BAND[b0 + i] = j; b0 += w; }); }

type PresetKey = "gentle" | "balanced" | "strong" | "full";
// talk: the "caller is definitely talking" hold from nearfield 1.1.0 (threshold, frames averaged, frames held, far dB, floor dB)
type Preset = { k: number; far: number; gate: number | null; talk?: { thr: number; avg: number; hold: number; far: number; floor: number } };
const PRESETS: Record<PresetKey, Preset> = {
  gentle: { k: 1, far: -20, gate: null },
  balanced: { k: 1, far: -60, gate: -45, talk: { thr: 0.6, avg: 10, hold: 150, far: -12, floor: -8 } },
  strong: { k: 1, far: -60, gate: -45 },
  full: { k: 2, far: -60, gate: -45 },
};
type Rule = (xn: Float32Array, xd: Float32Array, own: Float32Array) => Float32Array;

function makeRule(p: Preset, echo: boolean): Rule {
  const keep = 10 ** (-6 / 20), far = 10 ** (p.far / 20), fl = p.gate == null ? null : 10 ** (p.gate / 20);
  let prev = 0, hold = 0;
  const T = p.talk, hist = new Float64Array(T ? Math.max(1, T.avg) : 1), tfloor = T ? 10 ** (T.floor / 20) : 0;
  let talkV = 0, talkHold = 0;
  // echo-tail remover: predict each bin's room-echo energy from 50 ms ago and subtract it
  const EA = Math.exp((-13.8 * 5 * 0.01) / 0.5), EFL = 10 ** (-15 / 20), ring: Float64Array[] = [];
  let Ps: Float64Array | null = null;
  return (xn, xd, own) => {
    const o = p.k === 1 ? own : own.map((v) => v ** p.k / (v ** p.k + (1 - v) ** p.k));
    let G = 1, farNow = far, talk = 0, stat = 0;
    if (fl !== null || T) {
      const w = new Float64Array(32);
      for (let b = 0; b < NB; b++) w[BAND[b]] += xd[2 * b] ** 2 + xd[2 * b + 1] ** 2;
      let num = 0, den = 0;
      for (let j = 0; j < 32; j++) { num += own[j] * (w[j] + 1e-12); den += w[j] + 1e-12; }
      stat = num / den; // energy-weighted share of the frame owned by the near voice
    }
    if (T) {
      hist.copyWithin(0, 1); hist[hist.length - 1] = stat;
      let mean = 0; for (const v of hist) mean += v; mean /= hist.length;
      const t0 = Math.min(1, Math.max(0, (mean - T.thr) / 0.3));
      if (t0 >= talkV) { talkV = t0; talkHold = T.hold; } else if (talkHold > 0) talkHold--; else talkV = Math.max(t0, talkV * 0.9);
      talk = talkV;
      farNow = 10 ** ((p.far * (1 - talk) + T.far * talk) / 20);
    }
    if (fl !== null) {
      const g0 = Math.min(1, Math.max(0, (stat - 0.25) / 0.35));
      if (g0 >= prev) { prev = g0; hold = 15; } else if (hold > 0) hold--; else prev = Math.max(g0, prev * 0.85);
      G = fl + (1 - fl) * Math.max(prev, talk);
    }
    const out = new Float32Array(NB * 2);
    for (let b = 0; b < NB; b++) {
      const nr = xn[2 * b], ni = xn[2 * b + 1], dr = xd[2 * b], di = xd[2 * b + 1];
      const dg = Math.min(1, Math.max(0, Math.hypot(dr, di) / (Math.hypot(nr, ni) + 1e-9))), ob = o[BAND[b]];
      let g = (ob * Math.max(dg, keep) + (1 - ob) * Math.min(dg, farNow)) * G;
      if (talk > 0) g = Math.max(g, tfloor * talk);
      if (g >= dg - 1e-6) { out[2 * b] = nr * g; out[2 * b + 1] = ni * g; }
      else { const q = g / (dg + 1e-9); out[2 * b] = dr * q; out[2 * b + 1] = di * q; }
    }
    if (echo) {
      const P = new Float64Array(NB);
      for (let b = 0; b < NB; b++) P[b] = xn[2 * b] ** 2 + xn[2 * b + 1] ** 2;
      if (!Ps) Ps = Float64Array.from(P); else for (let b = 0; b < NB; b++) Ps[b] = 0.6 * Ps[b] + 0.4 * P[b];
      ring.push(Float64Array.from(Ps));
      if (ring.length > 5) {
        const old = ring.shift()!;
        for (let b = 0; b < NB; b++) {
          const e = Math.min(1, Math.max(EFL, 1 - (EA * old[b]) / (P[b] + 1e-12)));
          out[2 * b] *= e; out[2 * b + 1] *= e;
        }
      }
    }
    return out;
  };
}

/* ---------------- engine ---------------- */
type Which = "orig" | "head" | "dfn";
type Rec = {
  label: string; state: Float32Array; amem: Float32Array; s1: Float64Array; s2: Float64Array;
  inp: Float32Array[]; head: Float32Array[]; dfn: Float32Array[]; pk: [number, number][]; dpk: number[];
  own: Uint8Array[]; n: number; hist: Float32Array[]; xn: Float32Array[]; xd: Float32Array[]; ownf: Float32Array[];
  rule: Rule; pending: Float32Array[]; buf: Float32Array; busy: boolean; done: boolean; finishing: boolean;
};
export type Status = { label: string; secs: number; ms: number; behind: number; done: boolean };
type Callbacks = {
  onStatus: (s: Status | null) => void;
  onPlaying: (p: boolean) => void;
  onBuffers: (ready: boolean) => void;
};
type Mic = { stream: MediaStream; node: AudioWorkletNode; srcN: MediaStreamAudioSourceNode; mute: GainNode; r: Rec };

const COL = { bg: "#070807", grid: "rgba(243,245,241,.08)", orig: "#6f746c", head: "#f3f5f1", dfn: "#8fb0c8", playhead: "#b9f23a" };

function createEngine(cv: HTMLCanvasElement, cb: Callbacks) {
  let ort: Ort | null = null, sess: OrtSession | null = null, init: Float32Array | null = null;
  let modelPromise: Promise<void> | null = null;
  let R: Rec | null = null, frameMs: number[] = [];
  let preset: PresetKey = "full", echoOn = false;
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

  async function loadModel(onProgress: (pct: number | null) => void) {
    if (sess) return;
    if (modelPromise) return modelPromise;
    modelPromise = (async () => {
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
      const [m, s] = await Promise.all([fetchBin(BASE + "nearfield-v1.onnx", true), fetchBin(BASE + "init_state.bin", false)]);
      onProgress(null);
      init = new Float32Array(s.buffer, s.byteOffset, s.byteLength / 4).slice();
      const created = await ort.InferenceSession.create(m, { executionProviders: ["wasm"] });
      if (disposed) { created.release?.(); return; }
      sess = created;
    })();
    try { await modelPromise; } catch (e) { modelPromise = null; throw e; }
  }

  function fresh(label: string): Rec {
    return {
      label, state: init!.slice(), amem: new Float32Array(H), s1: new Float64Array(H), s2: new Float64Array(H),
      inp: [], head: [], dfn: [], pk: [], dpk: [], own: [], n: 0, hist: [new Float32Array(NB * 2), new Float32Array(NB * 2)],
      xn: [], xd: [], ownf: [], rule: makeRule(PRESETS[preset], echoOn), pending: [], buf: new Float32Array(0),
      busy: false, done: false, finishing: false,
    };
  }

  async function step(r: Rec, fr: Float32Array) {
    const T = ort!, t = performance.now();
    const spec = analysis(r.amem, fr); r.amem = fr;
    const o = await sess!.run({
      spec: new T.Tensor("float32", spec, [NB, 2]),
      state: new T.Tensor("float32", r.state, [r.state.length]),
    });
    r.state = o.new_state.data;
    const xn = r.hist.shift()!; r.hist.push(spec); // the model's output is for the frame 2 steps back
    const xd = Float32Array.from(o.y_dfn.data), own = Float32Array.from(o.own.data);
    r.xn.push(xn); r.xd.push(xd); r.ownf.push(own);
    const yh = synthesis(r.rule(xn, xd, own), r.s1), yd = synthesis(xd, r.s2);
    r.inp.push(fr); r.head.push(yh); r.dfn.push(yd); r.own.push(Uint8Array.from(own, (v) => Math.round(v * 255)));
    let a = 0, b = 0, d = 0;
    for (let i = 0; i < H; i++) { a = Math.max(a, Math.abs(fr[i])); b = Math.max(b, Math.abs(yh[i])); d = Math.max(d, Math.abs(yd[i])); }
    r.pk.push([a, b]); r.dpk.push(d); r.n++;
    frameMs.push(performance.now() - t); if (frameMs.length > 200) frameMs.shift();
  }
  function push(r: Rec, samples: Float32Array) {
    const b = new Float32Array(r.buf.length + samples.length); b.set(r.buf); b.set(samples, r.buf.length);
    let i = 0; for (; i + H <= b.length; i += H) r.pending.push(b.slice(i, i + H));
    r.buf = b.slice(i); pump(r);
  }
  async function pump(r: Rec) {
    if (r.busy) return; r.busy = true;
    try {
      while (r.pending.length && r === R && !disposed) {
        await step(r, r.pending.shift()!);
        if (r.n % 25 === 0) { status(); draw(); await new Promise((res) => setTimeout(res)); }
      }
    } finally { r.busy = false; }
    if (r !== R || disposed) return;
    status(); draw();
    if (r.finishing && !r.pending.length) finish(r);
  }
  function end(r: Rec) { r.finishing = true; for (let k = 0; k < 4; k++) r.pending.push(new Float32Array(H)); pump(r); }

  /* playback */
  function cat(chunks: Float32Array[], skip: number, len: number) {
    const all = new Float32Array(chunks.length * H); chunks.forEach((c, i) => all.set(c, i * H));
    return all.subarray(skip, skip + len);
  }
  const mk = (x: Float32Array) => { const b = ctx().createBuffer(1, Math.max(1, x.length), SR); b.copyToChannel(Float32Array.from(x), 0); return b; };
  function finish(r: Rec) {
    if (r.done) return; r.done = true;
    const len = Math.max(0, (r.n - 4) * H);
    bufs = { orig: mk(cat(r.inp, 0, len)), head: mk(cat(r.head, DELAY, len)), dfn: mk(cat(r.dfn, DELAY, len)) };
    off = 0; cb.onBuffers(true); status(); draw(); stamp();
  }
  /** Test hook: energy of the cleaned buffer, so a preset switch can be checked from outside. */
  function stamp() {
    if (!bufs) { delete cv.dataset.headRms; return; }
    const d = bufs.head.getChannelData(0); let s = 0; for (let i = 0; i < d.length; i++) s += d[i] * d[i];
    cv.dataset.headRms = Math.sqrt(s / Math.max(1, d.length)).toExponential(4);
  }
  /** Re-apply the cut rule to stored model outputs: no model rerun. */
  function rerender() {
    if (!R) return; R.rule = makeRule(PRESETS[preset], echoOn);
    if (!R.done || !bufs) return;
    const mem = new Float64Array(H), rule = makeRule(PRESETS[preset], echoOn);
    for (let f = 0; f < R.n; f++) {
      const yh = synthesis(rule(R.xn[f], R.xd[f], R.ownf[f]), mem); R.head[f] = yh;
      let b = 0; for (let i = 0; i < H; i++) b = Math.max(b, Math.abs(yh[i])); R.pk[f][1] = b;
    }
    const was = playing && which === "head", p = pos();
    bufs.head = mk(cat(R.head, DELAY, bufs.orig.length));
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

  /* drawing: original on top, cleaned below, caller-owned bands as a strip */
  function draw() {
    const g = cv.getContext("2d"); if (!g) return;
    const W = cv.width, Hh = cv.height, h1 = Hh * 0.42, h3 = Hh * 0.16;
    g.fillStyle = COL.bg; g.fillRect(0, 0, W, Hh);
    g.fillStyle = COL.grid; g.fillRect(0, Math.round(h1), W, 1); g.fillRect(0, Math.round(2 * h1), W, 1);
    if (!R || !R.n) return;
    const r = R, live = !r.done, total = r.n, span = live ? Math.max(total, 1000) : total, start = live ? Math.max(0, total - span) : 0;
    const showDfn = which === "dfn";
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
    lane(h1, h1, (f) => { const g2 = f + 3; return g2 < total ? (showDfn ? r.dpk[g2] : r.pk[g2][1]) : 0; }, showDfn ? COL.dfn : COL.head);
    const rows = Math.max(1, Math.round(h3)), img = g.createImageData(W, rows);
    for (let px = 0; px < W; px++) {
      const f = Math.floor(start + (px / W) * span) + 2; if (f >= total) continue; const o = r.own[f];
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
    cb.onStatus({ label: R.label, secs: (R.n * H) / SR, ms, behind: R.pending.length * 10, done: R.done });
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
    for (let i = 0; i < x.length; i += 48000) push(r, x.subarray(i, i + 48000));
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
    get ready() { return !!sess; },
    get recording() { return !!mic; },
    draw,
    async runExample() {
      const r = await fetch(BASE + "example-call.wav");
      if (!r.ok) throw new Error("example");
      runSamples("Example call (16 kHz, caller far from the mic)", await decodeTo48k(await r.arrayBuffer()));
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
    setPreset(p: PresetKey) { preset = p; rerender(); },
    setEcho(v: boolean) { echoOn = v; rerender(); },
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
      if (sess) { sess.release?.().catch(() => {}); sess = null; }
    },
  };
}
type Engine = ReturnType<typeof createEngine>;

/* ---------------- UI ---------------- */
const NOTE_DEFAULT =
  "Switching version while it plays keeps your place. Click the waveform to seek. Output lags the input by 30 ms (DFN's 20 ms lookahead plus one 10 ms step), which is the latency a live call would have.";

const PRESET_BTNS: { k: PresetKey; label: string }[] = [
  { k: "gentle", label: "Gentle · −22 dB" },
  { k: "balanced", label: "Balanced · keeps more words" },
  { k: "strong", label: "Strong · −37 dB" },
  { k: "full", label: "Full · −41 dB" },
];
const WHICH_BTNS: { k: Which; label: string }[] = [
  { k: "orig", label: "Original" },
  { k: "head", label: "Nearfield" },
  { k: "dfn", label: "DFN3 stock" },
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
  const [preset, setPreset] = useState<PresetKey>("full");
  const [echo, setEcho] = useState(false);

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
    if (eng.ready) return true;
    setPhase("loading"); setModelErr("");
    try {
      await eng.loadModel(setProgress);
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

  const onExample = async () => {
    const eng = engRef.current; if (!eng || busy) return;
    eng.ctx(); // create the audio context inside the click
    setNote({ t: NOTE_DEFAULT, err: false });
    if (eng.recording) { eng.stopMic(); setRecording(false); }
    setBusy(true);
    try {
      if (!(await ensureModel())) return;
      await eng.runExample();
    } catch {
      setNote({ t: "The example call did not load. Check your connection and try again.", err: true });
    } finally { setBusy(false); }
  };

  const onFile = async (f: File | undefined) => {
    const eng = engRef.current; if (!eng || !f) return;
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
  if (phase === "loading") statLine = <>Loading the model{progress != null ? ` · ${progress}%` : ""} (about 22 MB, once; your browser caches it)…</>;
  else if (phase === "error") statLine = <span className="text-[var(--color-magenta)]">The model could not start in this browser: {modelErr}</span>;
  else if (status) {
    statLine = (
      <>
        {status.label} · <b className="font-medium text-[var(--color-fg)]">{status.secs.toFixed(1)} s</b> processed
        {status.ms > 0 && (
          <>
            {" · "}
            <b className="font-medium text-[var(--color-fg)]" data-testid="frame-ms">{status.ms.toFixed(1)} ms</b> per 10 ms frame (
            {status.ms < 10 ? "real time" : <span className="text-[var(--color-magenta)]">slower than real time on this device</span>})
          </>
        )}
        {status.behind > 200 && !status.done && <span className="text-[var(--color-magenta)]"> · {(status.behind / 1000).toFixed(1)} s behind</span>}
        {status.done && " · done, press play"}
      </>
    );
  } else if (phase === "ready") statLine = <>Model ready. It runs in this tab, nothing is uploaded.</>;
  else statLine = <>Press a button to start. The model (about 22 MB) loads then, once, and runs entirely in this tab.</>;

  const placeholder =
    phase === "loading" ? "Loading the model…" : phase === "error" ? "The model did not load." : "Record, open a file, or run the example call.";

  return (
    <div ref={rootRef} className="card p-4 sm:p-7" data-phase={phase} data-done={status?.done ? "1" : "0"}>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={onExample} disabled={startDisabled || recording} className="btn btn-primary">
          Run on the example call
        </button>
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
          aria-label="Original and cleaned waveforms, with which frequency bands belong to the caller"
          data-testid="nf-wave"
        />
        <div className="pointer-events-none absolute inset-0 grid grid-rows-[42%_42%_16%] font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)] sm:text-[11px]">
          <span className="self-start justify-self-start m-1.5 rounded bg-[#070807]/85 px-1.5 py-0.5">Original</span>
          <span className="self-start justify-self-start m-1.5 rounded bg-[#070807]/85 px-1.5 py-0.5">{which === "dfn" ? "Cleaned · DFN3 stock" : "Cleaned · Nearfield"}</span>
          <span className="self-start justify-self-start m-1.5 rounded bg-[#070807]/85 px-1.5 py-0.5 text-[var(--color-fg)]">Caller-owned bands</span>
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
        <span className="mono-label">Background cut</span>
        <div className="flex flex-wrap gap-2" role="group" aria-label="How hard to cut the background">
          {PRESET_BTNS.map((b) => (
            <Seg key={b.k} pressed={preset === b.k} onClick={() => { setPreset(b.k); engRef.current?.setPreset(b.k); }}>{b.label}</Seg>
          ))}
        </div>
        <Seg pressed={echo} onClick={() => { const v = !echo; setEcho(v); engRef.current?.setEcho(v); }}>Echo-tail remover</Seg>
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
