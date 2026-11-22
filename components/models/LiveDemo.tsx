"use client";

import { useEffect, useRef, useState } from "react";
import { VOICE_DEMO_API } from "@/lib/products";
import type { Option } from "./ChainDemo";

/** Record your own voice, send it to the demo Lambda, play back what came out.
 *  The Lambda sleeps when nobody uses it, so Record also wakes it up: it loads while you talk. */
const MAX_S = 15;
type Out = { sr: number; pcm: string };
type Phase = "idle" | "recording" | "waking" | "working" | "done" | "error";

function toWav(o: Out): string {
  const pcm = Uint8Array.from(atob(o.pcm), (c) => c.charCodeAt(0));
  const buf = new ArrayBuffer(44 + pcm.length), v = new DataView(buf);
  const w = (p: number, s: string) => [...s].forEach((c, i) => v.setUint8(p + i, c.charCodeAt(0)));
  w(0, "RIFF"); v.setUint32(4, 36 + pcm.length, true); w(8, "WAVE"); w(12, "fmt ");
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, o.sr, true);
  v.setUint32(28, o.sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, pcm.length, true);
  new Uint8Array(buf, 44).set(pcm);
  return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
}

async function to16k(blob: Blob): Promise<string> {
  const ctx = new AudioContext();
  const src = await ctx.decodeAudioData(await blob.arrayBuffer());
  ctx.close();
  const n = Math.min(Math.ceil(src.duration * 16000), MAX_S * 16000);
  const off = new OfflineAudioContext(1, n, 16000);
  const b = off.createBufferSource(); b.buffer = src; b.connect(off.destination); b.start();
  const x = (await off.startRendering()).getChannelData(0);
  const i16 = new Int16Array(x.length);
  for (let i = 0; i < x.length; i++) i16[i] = Math.max(-1, Math.min(1, x[i])) * 32767;
  const bytes = new Uint8Array(i16.buffer); let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

function Radio({ o, value, onChange }: { o: Option; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mono-label mb-2">{o.label}</legend>
      <div className="flex flex-wrap gap-2">
        {o.choices.map((c) => (
          <label key={c.v} className={`flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${value === c.v ? "border-[var(--color-neon)] text-[var(--color-fg)]" : "border-[var(--color-border-bright)] text-[var(--color-muted)] hover:text-[var(--color-fg)]"}`}>
            <input type="radio" className="accent-[var(--color-neon)]" checked={value === c.v} onChange={() => onChange(c.v)} />
            {c.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function LiveDemo({ model, options, prompt, inputLabel, resultLabel }: {
  model: "antflash" | "upscaler"; options: Option[]; prompt: string; inputLabel: string; resultLabel: string;
}) {
  const [sel, setSel] = useState<Record<string, string>>(() => Object.fromEntries(options.map((o) => [o.key, o.choices[0].v])));
  const [phase, setPhase] = useState<Phase>("idle");
  const [secs, setSecs] = useState(0);
  const [msg, setMsg] = useState("");
  const [urls, setUrls] = useState<{ a: string; b: string; tag: string } | null>(null);
  const [ran, setRan] = useState<string>("");
  const rec = useRef<MediaRecorder | null>(null);
  const pcm = useRef<string>("");
  const warm = useRef<Promise<unknown> | null>(null);
  const timer = useRef<number>(0);

  useEffect(() => () => { window.clearInterval(timer.current); rec.current?.stream.getTracks().forEach((t) => t.stop()); }, []);
  const key = JSON.stringify(sel);

  const wake = () => { warm.current = fetch(VOICE_DEMO_API + "?warm=1").catch(() => null); };

  async function send() {
    setPhase("waking"); setMsg("");
    await warm.current; // the instance that loaded the model takes the clip
    setPhase("working");
    const t0 = Date.now(); setSecs(0);
    timer.current = window.setInterval(() => setSecs(Math.round((Date.now() - t0) / 1000)), 500);
    try {
      const r = await fetch(VOICE_DEMO_API, { method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ model, nf: +sel.nf, up: +sel.up, pcm: pcm.current }) });
      if (r.status === 429 || r.status === 503) throw new Error("The demo is busy right now. Try again in a minute.");
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Something went wrong. Try again.");
      if (urls) { URL.revokeObjectURL(urls.a); URL.revokeObjectURL(urls.b); }
      const tag = options.map((o) => o.choices.find((c) => c.v === sel[o.key])?.tag ?? "").join("");
      setUrls({ a: toWav(d.input), b: toWav(d.output), tag }); setRan(key); setPhase("done");
    } catch (e) {
      setMsg(e instanceof Error && e.message ? e.message : "Something went wrong. Try again."); setPhase("error");
    } finally { window.clearInterval(timer.current); }
  }

  async function start() {
    setMsg("");
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { noiseSuppression: false, echoCancellation: true, autoGainControl: true } });
    } catch { setMsg("The browser did not allow the microphone."); setPhase("error"); return; }
    wake();
    const chunks: Blob[] = [];
    const m = new MediaRecorder(stream); rec.current = m;
    m.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    m.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop()); window.clearInterval(timer.current);
      try { pcm.current = await to16k(new Blob(chunks, { type: m.mimeType })); } catch { setMsg("Could not read the recording."); setPhase("error"); return; }
      send();
    };
    m.start(); setPhase("recording");
    const t0 = Date.now(); setSecs(0);
    timer.current = window.setInterval(() => {
      const s = (Date.now() - t0) / 1000; setSecs(Math.floor(s));
      if (s >= MAX_S && m.state === "recording") m.stop();
    }, 200);
  }

  const busy = phase === "recording" || phase === "waking" || phase === "working";
  return (
    <div className="card p-6 sm:p-8">
      <p className="max-w-2xl leading-relaxed text-[var(--color-muted)]">{prompt}</p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-dim)]">
        The model runs in real time on a live call. To keep this demo light, we start it on demand, so
        the first try can take up to half a minute while the model loads. After that it answers in a
        few seconds.
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {options.map((o) => <Radio key={o.key} o={o} value={sel[o.key]} onChange={(v) => setSel((s) => ({ ...s, [o.key]: v }))} />)}
      </div>
      <div className="mt-7 flex flex-wrap items-center gap-3">
        {phase === "recording" ? (
          <button className="btn btn-primary" onClick={() => rec.current?.stop()}>■ Stop ({MAX_S - secs} s left)</button>
        ) : (
          <button className="btn btn-primary" disabled={busy} onClick={start}>● {urls ? "Record again" : `Record up to ${MAX_S} s`}</button>
        )}
        {urls && !busy && ran !== key && (
          <button className="btn btn-ghost" onClick={() => { wake(); send(); }}>Run the same recording with these settings</button>
        )}
        <p className="text-sm text-[var(--color-muted)]" aria-live="polite">
          {phase === "waking" && "Starting the model. The first run after a quiet spell takes about half a minute."}
          {phase === "working" && `Processing… ${secs} s`}
          {phase === "error" && <span className="text-[var(--color-fg)]">{msg}</span>}
        </p>
      </div>
      {urls && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div><p className="text-[var(--color-fg)]">{inputLabel}</p><audio controls src={urls.a} className="mt-3 w-full" /></div>
          <div><p className="font-semibold text-[var(--color-fg)]">{resultLabel}{urls.tag}</p><audio controls src={urls.b} className="mt-3 w-full" /></div>
        </div>
      )}
      <p className="mt-6 text-sm text-[var(--color-dim)]">Your recording is processed and discarded. Nothing is stored.</p>
    </div>
  );
}
