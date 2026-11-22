import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui";
import ChainDemo from "@/components/models/ChainDemo";
import LiveDemo from "@/components/models/LiveDemo";
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

const SPECS = [
  { v: "8 → 48 kHz", l: "phone-line audio in, full-band studio rate out. 16 kHz input works too" },
  { v: "21–43 ms", l: "added delay, streaming in 10 ms blocks with no look-ahead" },
  { v: "CPU", l: "real time on a standard CPU, many streams per machine" },
  { v: "Near chance", l: "a trained detector picks out its 48 kHz output only 53–55% of the time, where 50% is a coin flip" },
];

const FITS = [
  { t: "Contact centres and telephony", d: "Callers on 8 kHz phone lines sound like they are in the room, for agents, supervisors and recordings." },
  { t: "Voice agents", d: "Fuller, clearer audio for anything you record, replay or pass on, from a single filter in the pipeline." },
  { t: "Call recordings and archives", d: "Bring years of narrowband recordings up to modern playback quality." },
  { t: "Conferencing and VoIP", d: "Lift low-bandwidth participants to the same quality as everyone else on the call." },
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
            <Link href="/contact" className="btn btn-ghost">Talk to us →</Link>
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
      
        <Container className="pb-12">
          <h3 className="text-xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-2xl">Try your own voice</h3>
          <div className="mt-6">
            <LiveDemo
              model="upscaler"
              options={STEPS}
              prompt="Say a few sentences. We send your voice down an 8 kHz phone line, then the upscaler rebuilds it at 48 kHz. Headphones make the difference easiest to hear."
              inputLabel="Your voice on a phone line, 8 kHz"
              resultLabel="Phone line"
            />
          </div>
        </Container>
      </section>

      <Container className="py-12">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl">At a glance</h2>
        <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {SPECS.map((x) => (
            <div key={x.l} className="border-t border-[var(--color-border-bright)] pt-4">
              <dt className="text-2xl font-semibold tracking-tight text-[var(--color-fg)]">{x.v}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{x.l}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 max-w-2xl leading-relaxed text-[var(--color-muted)]">
          The original band passes through untouched, so the voice, the words and their timing never
          change, and the pauses stay as quiet as the input. On the same realism test, FlashSR is
          caught 83% of the time.
        </p>
      </Container>

      <Container className="py-12">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl">Where it fits</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {FITS.map((c) => (
            <div key={c.t} className="card p-7">
              <h3 className="text-lg font-semibold text-[var(--color-fg)]">{c.t}</h3>
              <p className="mt-2 leading-relaxed text-[var(--color-muted)]">{c.d}</p>
            </div>
          ))}
        </div>
      </Container>

      <Container className="py-12">
        <div className="card p-10 text-center sm:p-14">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--color-fg)]">Put it in your pipeline</h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--color-muted)]">
            Audio Upscaler is available to license as a Python package for live pipelines: any chunk
            size, any sample rate, many streams on one machine. Tell us what you would use it for.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn btn-primary">Talk to us →</Link>
            <Link href="/models" className="btn btn-ghost">Other models</Link>
          </div>
        </div>
      </Container>
    </>
  );
}
