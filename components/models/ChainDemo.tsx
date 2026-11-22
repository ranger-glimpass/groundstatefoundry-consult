"use client";

import { useRef, useState } from "react";

/** Mix-and-match listening demo. Every combination is pre-rendered as
 *  `${base}/${sample}_${room?}_${opt1}_${opt2}.mp3` (+ .webp spectrogram);
 *  the input is `${sample}_${room?}_in.mp3`, the optional reference `${sample}_orig.mp3`. */
export type Choice = { v: string; label: string; tag?: string }; // tag: appended to the clip's title when chosen
export type Option = { key: string; label: string; choices: Choice[] };

type Props = {
  base: string;
  samples: { id: string; label: string }[];
  room?: Option; // changes the input as well as the output
  options: Option[]; // processing steps, in file-name order
  inputLabel: string;
  resultLabel: string;
  refLabel?: string;
};

function Radio({ o, value, onChange }: { o: Option; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mono-label mb-2">{o.label}</legend>
      <div className="flex flex-wrap gap-2">
        {o.choices.map((c) => (
          <label
            key={c.v}
            className={`flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              value === c.v
                ? "border-[var(--color-neon)] text-[var(--color-fg)]"
                : "border-[var(--color-border-bright)] text-[var(--color-muted)] hover:text-[var(--color-fg)]"
            }`}
          >
            <input type="radio" className="accent-[var(--color-neon)]" checked={value === c.v} onChange={() => onChange(c.v)} />
            {c.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Player({ label, src, hi }: { label: string; src: string; hi?: boolean }) {
  const a = useRef<HTMLAudioElement>(null);
  const [shown, setShown] = useState(src);
  // keep playing from the same moment when the selection changes, so switching is an A/B
  if (shown !== src) {
    const el = a.current;
    const t = el?.currentTime ?? 0, playing = el ? !el.paused : false;
    setShown(src);
    if (el) {
      requestAnimationFrame(() => {
        el.currentTime = t;
        if (playing) el.play().catch(() => {});
      });
    }
  }
  return (
    <div>
      <p className={hi ? "font-semibold text-[var(--color-fg)]" : "text-[var(--color-fg)]"}>{label}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={shown.replace(/\.mp3$/, ".webp")} alt={`Spectrogram: ${label}`} className="mt-3 h-20 w-full rounded-lg border border-[var(--color-border)] object-cover" />
      <audio ref={a} controls preload="metadata" src={shown} className="mt-3 w-full" />
    </div>
  );
}

export default function ChainDemo({ base, samples, room, options, inputLabel, resultLabel, refLabel }: Props) {
  const all = room ? [room, ...options] : options;
  const [sample, setSample] = useState(samples[0].id);
  const [sel, setSel] = useState<Record<string, string>>(() => Object.fromEntries(all.map((o) => [o.key, o.choices[0].v])));
  const set = (k: string) => (v: string) => setSel((s) => ({ ...s, [k]: v }));
  const head = [sample, ...(room ? [sel[room.key]] : [])].join("_");
  const result = `${base}/${[head, ...options.map((o) => sel[o.key])].join("_")}.mp3`;
  const tag = (o: Option) => o.choices.find((c) => c.v === sel[o.key])?.tag ?? "";
  const inTitle = inputLabel + (room ? tag(room) : "");
  const outTitle = resultLabel + options.map(tag).join("");

  return (
    <div className="card p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {samples.length > 1 && (
          <Radio o={{ key: "sample", label: "Sample", choices: samples.map((s) => ({ v: s.id, label: s.label })) }} value={sample} onChange={setSample} />
        )}
        {all.map((o) => (
          <Radio key={o.key} o={o} value={sel[o.key]} onChange={set(o.key)} />
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Player label={inTitle} src={`${base}/${head}_in.mp3`} />
        <Player label={outTitle} src={result} hi />
      </div>
      {refLabel && (
        <div className="mt-6">
          <Player label={refLabel} src={`${base}/${sample}_orig.mp3`} />
        </div>
      )}
      <p className="mt-6 text-sm text-[var(--color-dim)]">
        Change a setting while a clip plays and it carries on from the same moment, so you can hear the difference.
      </p>
    </div>
  );
}
