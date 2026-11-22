/** Before/after audio clips, played with the browser's own player. */
export type Clip = { label: string; src: string; note?: string; img?: string; hi?: boolean };

export default function SampleSet({ title, clips }: { title: string; clips: Clip[] }) {
  return (
    <div className="card p-6 sm:p-8">
      <p className="mono-label">{title}</p>
      <div className="mt-5 space-y-6">
        {clips.map((c) => (
          <div key={c.src}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className={c.hi ? "font-semibold text-[var(--color-fg)]" : "text-[var(--color-fg)]"}>{c.label}</p>
              {c.note && <p className="text-sm text-[var(--color-dim)]">{c.note}</p>}
            </div>
            {c.img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.img} alt={`Spectrogram: ${c.label}`} className="mt-3 h-24 w-full rounded-lg border border-[var(--color-border)] object-cover" loading="lazy" />
            )}
            <audio controls preload="none" src={c.src} className="mt-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
