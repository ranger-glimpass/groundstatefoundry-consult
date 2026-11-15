/**
 * Nearfield against other voice filters on Krisp's public Voice Isolation benchmark (265 real recordings).
 * We ran the Nearfield, Krisp and no-filter rows; the other three are from "The Voice on the Line"
 * (arXiv 2610.35272), which scores the same way. Used on the Nearfield page and on the landing page.
 */
const PAPER = "https://arxiv.org/abs/2610.35272";
const DATASET = "https://huggingface.co/datasets/Krisp-AI/VoiceIsolation-Benchmark-Dataset";

const ROWS: { n: string; m: string; a: string; wer: string; leak: string; hi?: boolean; ref?: boolean }[] = [
  { n: "1", m: "Nearfield best, 80 ms delay", a: "open", wer: "4.99%", leak: "0.36", hi: true },
  { n: "2", m: "Nearfield fast, 48 ms delay", a: "open", wer: "5.01%", leak: "0.70", hi: true },
  { n: "3", m: "Krisp VI 2.5 Default", a: "paid", wer: "5.30%", leak: "1.52" },
  { n: "4", m: "Krisp VI 2.5 Lite", a: "paid", wer: "6.21%", leak: "4.52" },
  { n: "5", m: "ai-coustics Voice Focus 2.2 L", a: "paid", wer: "6.84%", leak: "0.66" },
  { n: "6", m: "Sanas Voice Isolation", a: "paid", wer: "9.38%", leak: "13.76" },
  { n: "7", m: "DeepFilterNet3", a: "open", wer: "13.30%", leak: "22.77" },
  { n: "", m: "No filter", a: "", wer: "23.21%", leak: "66.47", ref: true },
];

export default function KrispRanking({ compact = false }: { compact?: boolean }) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--color-border-bright)]">
              <th className="mono-label w-8 py-3 pr-3 font-normal">#</th>
              <th className="mono-label py-3 pr-4 font-normal">Model*</th>
              <th className="mono-label py-3 pr-4 font-normal">Access</th>
              <th className="mono-label py-3 pr-4 text-right font-normal">Word error rate</th>
              <th className="mono-label py-3 text-right font-normal">Background words per minute</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {ROWS.map((r) => (
              <tr
                key={r.m}
                className={r.ref ? "text-[var(--color-dim)]" : r.hi ? "font-semibold text-[var(--color-fg)]" : "text-[var(--color-muted)]"}
              >
                <td className="py-3 pr-3 font-mono tabular-nums">{r.n}</td>
                <td className="py-3 pr-4">{r.m}</td>
                <td className="py-3 pr-4">{r.a}</td>
                <td className="py-3 pr-4 text-right font-mono tabular-nums">{r.wer}</td>
                <td className="py-3 text-right font-mono tabular-nums">{r.leak}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-[var(--color-dim)]">
        * Open models under 50 MB and the paid filters (known sizes: Nearfield 2.5 MB, DeepFilterNet3 about 8 MB,
        ai-coustics Voice Focus 2.2 L about 20 MB; Krisp and Sanas do not publish one).
      </p>
      <p className="mt-2 text-xs leading-relaxed text-[var(--color-dim)]">
        <a href={DATASET} target="_blank" rel="noopener noreferrer" className="link-u">Krisp&apos;s Voice Isolation benchmark</a>:
        265 real recordings with other people talking in the room, scored with Krisp&apos;s published method. Lower is
        better in both columns. Background words are words the recogniser writes while only a background voice is
        talking.{" "}
        {compact ? (
          <>Sources and caveats are on the Nearfield page.</>
        ) : (
          <>
            We ran the Nearfield, Krisp and no-filter rows. The ai-coustics, Sanas and DeepFilterNet3 rows are from{" "}
            <a href={PAPER} target="_blank" rel="noopener noreferrer" className="link-u">The Voice on the Line</a>, which
            scores the same way. Gaps of a few tenths of a point are within noise, and this version of Nearfield was
            tuned against this benchmark, though never trained on its recordings.
          </>
        )}
      </p>
    </div>
  );
}
