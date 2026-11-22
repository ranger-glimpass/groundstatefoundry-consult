import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui";
import ChainDemo from "@/components/models/ChainDemo";
import { getProduct } from "@/lib/products";

export const metadata: Metadata = {
  title: "Audio Upscaler",
  alternates: { canonical: "/models/audio-upscaler" },
  description:
    "Audio Upscaler turns 8 kHz phone speech or 16 kHz audio into full-band 48 kHz speech in real time on a CPU, with 21 to 43 ms of delay. Listen to before and after samples.",
};

const B = "/models/audio-upscaler";
const ROOM = { key: "room", label: "Background", choices: [{ v: "q", label: "Quiet room", tag: ", quiet room" }, { v: "n", label: "Someone talking behind", tag: ", someone talking behind" }] };
const STEPS = [
  { key: "nf", label: "Clean with Nearfield first", choices: [{ v: "0", label: "Off" }, { v: "1", label: "On", tag: ", cleaned by Nearfield" }] },
  { key: "up", label: "Upscale", choices: [{ v: "1", label: "On, 48 kHz", tag: ", upscaled to 48 kHz" }, { v: "0", label: "Off, 8 kHz phone line" }] },
];

const MODES = [
  { m: "8 → 48 kHz", u: "Phone calls and 8 kHz SIP", d: "43 ms", c: "~100 ms", f: "53%" },
  { m: "16 → 48 kHz", u: "VoIP, ASR-rate audio, after Nearfield", d: "21 ms", c: "~50 ms", f: "55%" },
  { m: "8 → 16 kHz", u: "Systems that need 16 kHz out", d: "22 ms", c: "~48 ms", f: "89%" },
];

const LIMITS = [
  "It is trained on clean speech. Music and heavy noise are out of scope, so clean noisy audio first, with Nearfield for example.",
  "The 8 → 16 kHz mode is easier to tell from a real recording (89%) than the 48 kHz modes.",
  "Audio that is already full-band gains nothing. Feed it audio that really is narrowband.",
];

export default function AudioUpscalerPage() {
  const p = getProduct("audio-upscaler")!;
  return (
    <>
      <header className="border-b border-[var(--color-border)] py-16">
        <Container>
          <div className="flex flex-wrap items-center gap-3">
            <p className="mono-label">model · audio essentials</p>
            <span className="tag">{p.status}</span>
          </div>
          <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-5xl">
            Audio Upscaler gives a phone call back the sound the line threw away.
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
            Each sample starts as a studio recording sent down an 8 kHz phone line, which cuts
            everything above 4 kHz. The upscaler rebuilds the rest, live. Add someone talking in the
            background and let Nearfield clean the call before it goes down the line. The pictures
            show each clip&apos;s frequencies, low at the bottom and 24 kHz at the top. Headphones make
            the difference easiest to hear.
          </p>
          <div className="mt-8">
            <ChainDemo
              base={B}
              samples={[{ id: "s1", label: "Speaker 1" }, { id: "s2", label: "Speaker 2" }]}
              room={ROOM}
              options={STEPS}
              inputLabel="Phone line, 8 kHz"
              resultLabel="Phone line"
            />
          </div>
        </Container>
      </section>

      <Container className="py-12">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl">Measured</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-muted)]">
          To test realism we trained a separate network to tell generated audio from real recordings,
          then asked it to spot the upscaler&apos;s output on recordings neither model had heard. At
          50% it is guessing. On the same test it catches FlashSR 83% of the time and AudioSR, a
          1.3-billion-parameter model that needs a GPU, 54 to 68%.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--color-border-bright)]">
                {["Mode", "For", "Delay", "CPU per 200 ms, 4 threads", "Spotted as generated"].map((h) => (
                  <th key={h} className="mono-label py-3 pr-4 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {MODES.map((r) => (
                <tr key={r.m} className="text-[var(--color-fg)]">
                  <td className="py-3 pr-4 font-semibold">{r.m}</td>
                  <td className="py-3 pr-4 text-[var(--color-muted)]">{r.u}</td>
                  <td className="py-3 pr-4 font-mono tabular-nums">{r.d}</td>
                  <td className="py-3 pr-4 font-mono tabular-nums">{r.c}</td>
                  <td className="py-3 pr-4 font-mono tabular-nums">{r.f}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-[var(--color-dim)]">
          6 to 7 million weights per stage, 55 MB in all. It streams in 10 ms blocks with no look-ahead,
          and the streamed output matches the offline output. The original band passes through
          untouched, and the pauses are never noisier than the input.
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
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--color-fg)]">Want to run it?</h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--color-muted)]">
            Audio Upscaler is a Python package for live pipelines: any chunk size, any sample rate,
            many streams on one machine. It is not public yet. Tell us what you would use it for.
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
