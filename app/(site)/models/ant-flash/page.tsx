import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui";
import ChainDemo from "@/components/models/ChainDemo";
import { getProduct } from "@/lib/products";

export const metadata: Metadata = {
  title: "Ant Flash",
  alternates: { canonical: "/models/ant-flash" },
  description:
    "Ant Flash changes an Indian English accent to American English while the person talks, in their own voice, on a CPU. Listen to before and after samples.",
};

const B = "/models/ant-flash";
const ROOM = { key: "room", label: "Background", choices: [{ v: "q", label: "Quiet room", tag: ", quiet room" }, { v: "n", label: "Someone talking behind", tag: ", someone talking behind" }] };
const STEPS = [
  { key: "nf", label: "Clean with Nearfield first", choices: [{ v: "0", label: "Off" }, { v: "1", label: "On", tag: ", after Nearfield" }] },
  { key: "up", label: "Upscale the output", choices: [{ v: "0", label: "Off, 24 kHz" }, { v: "1", label: "On, 48 kHz", tag: ", upscaled to 48 kHz" }] },
];

const MEASURED = [
  { k: "Accent", v: "70", w: "63", d: "American callers through the same chain score 98" },
  { k: "Detail", v: "50", w: "27", d: "how crisp and full the sound is" },
  { k: "Voice", v: "24", w: "22", d: "likeness to the talker; American callers through the chain score 65" },
  { k: "Words heard wrongly", v: "22 of 214", w: "24 of 214", d: "studio-quality test sentences" },
];

const LIMITS = [
  "The accent change is partial: clear on most callers, lighter on some. The talker's own timing is kept, and timing is part of an accent.",
  "It loses words. About 1 in 10 on studio recordings and 1 in 8 on home recordings are heard wrongly afterwards. Names and unusual words go first.",
  "The voice is recognisably the talker's, but not a close copy.",
  "It was trained on Indian-accented English only. One talker per stream.",
  "On a busy machine it falls behind. Nothing is dropped, but the delay grows.",
];

export default function AntFlashPage() {
  const p = getProduct("ant-flash")!;
  return (
    <>
      <header className="border-b border-[var(--color-border)] py-16">
        <Container>
          <div className="flex flex-wrap items-center gap-3">
            <p className="mono-label">model · audio essentials</p>
            <span className="tag">{p.status}</span>
          </div>
          <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-5xl">
            Ant Flash changes an accent while the person is still talking.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-muted)]">{p.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#demo" className="btn btn-primary">Listen below ↓</a>
            <Link href="/contact" className="btn btn-ghost">Request access →</Link>
          </div>
        </Container>
      </header>

      <section id="demo" className="scroll-mt-20">
        <Container className="py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl">Hear it</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-muted)]">
            Two Indian English speakers from public speech corpora (CMU ARCTIC and L2-ARCTIC), run
            through Ant Flash 3.2 the way a live call would be: fed 20 ms at a time, on a CPU. Same
            words, same voice, a different accent. Add someone talking in the background, clean it
            with Nearfield before the accent change, and upscale the result to 48 kHz. The converted
            clip starts about 0.6 s late, as it would live.
          </p>
          <div className="mt-8">
            <ChainDemo
              base={B}
              samples={[{ id: "s1", label: "Speaker 1" }, { id: "s2", label: "Speaker 2" }]}
              room={ROOM}
              options={STEPS}
              inputLabel="Original"
              resultLabel="Ant Flash 3.2"
            />
          </div>
        </Container>
      </section>

      <Container className="py-12">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl">Measured</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-muted)]">
          Nineteen test callers, sixteen of them Indian speakers across eight Indian languages, on
          sentences kept out of training. Scored 0 to 100 by our own automatic judges, higher is
          better.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--color-border-bright)]">
                {["", "Ant Flash 3.2", "Ant Flash 3.0", ""].map((h, i) => (
                  <th key={i} className="mono-label py-3 pr-4 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {MEASURED.map((r) => (
                <tr key={r.k} className="text-[var(--color-fg)]">
                  <td className="py-3 pr-4 font-semibold">{r.k}</td>
                  <td className="py-3 pr-4 font-mono tabular-nums">{r.v}</td>
                  <td className="py-3 pr-4 font-mono tabular-nums text-[var(--color-muted)]">{r.w}</td>
                  <td className="py-3 pr-4 text-sm text-[var(--color-dim)]">{r.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-[var(--color-dim)]">
          113 million weights, one 251 MB file. About 94 ms of computing per 200 ms of speech on an
          Apple M4 with four threads, about 0.6 s behind the talker. Nearfield cleans the output.
        </p>
      </Container>

      <Container className="py-12">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl">Limits</h2>
        <ul className="mt-6 max-w-2xl space-y-3">
          {LIMITS.map((l) => (
            <li key={l} className="flex items-start gap-2.5 leading-relaxed text-[var(--color-muted)]">
              <span className="mt-[10px] h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--color-muted)]" />
              {l}
            </li>
          ))}
        </ul>
      </Container>

      <Container className="py-12">
        <div className="card p-10 text-center sm:p-14">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--color-fg)]">Want to try it on your calls?</h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--color-muted)]">
            Ant Flash runs as a WebSocket server or a Pipecat filter. It is not public yet. Tell us
            which accents you need.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn btn-primary">Request access →</Link>
            <Link href="/models" className="btn btn-ghost">Other models</Link>
          </div>
        </div>
      </Container>
    </>
  );
}
