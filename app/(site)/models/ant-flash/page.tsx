import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui";
import ChainDemo from "@/components/models/ChainDemo";
import LiveDemo from "@/components/models/LiveDemo";
import { getProduct, LIVE_DEMO_ON } from "@/lib/products";

export const metadata: Metadata = {
  title: "Ant Flash",
  alternates: { canonical: "/models/ant-flash" },
  description:
    "Ant Flash changes an Indian English accent to American or Arabic-accented English while the person talks, in their own voice, on a CPU. Listen to before and after samples.",
};

const B = "/models/ant-flash";
const ACCENT = { key: "acc", label: "Change the accent to", choices: [{ v: "a", label: "American English", tag: " 3.2, American English" }, { v: "r", label: "Arabic-accented English", tag: " Arabic 1.0, Arabic-accented English" }] };
const STEPS = [
  { key: "up", label: "Upscale the output", choices: [{ v: "0", label: "Off, 24 kHz" }, { v: "1", label: "On, 48 kHz", tag: ", upscaled to 48 kHz" }] },
];

const SPECS = [
  { v: "Live", l: "converts while the person talks, about 0.6 s behind, in 20 ms frames" },
  { v: "Their voice", l: "a voice print of the speaker, taken from their first seconds. No stock voice" },
  { v: "CPU", l: "no GPU needed. About 94 ms of compute per 200 ms of speech on four threads" },
  { v: "48 kHz", l: "pair it with the Audio Upscaler for full-band output" },
];

const FITS = [
  { t: "Contact centres", d: "Agents in India keep their own voice and personality, and customers in the US or the Gulf hear a familiar accent. Nothing changes in the agent's workflow." },
  { t: "Sales and support calls", d: "Fewer \"sorry, could you repeat that\" moments on calls where every second counts." },
  { t: "Voice agents and telephony", d: "Runs as a WebSocket service or a Pipecat filter, so it drops into an existing call pipeline." },
  { t: "Your own infrastructure", d: "Runs on your servers, on CPUs you already have. Audio never has to leave your network." },
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
            <Link href="/contact" className="btn btn-ghost">Talk to us →</Link>
          </div>
        </Container>
      </header>

      <section id="demo" className="scroll-mt-20">
        <Container className="py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl">Hear it</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-muted)]">
            Two Indian English speakers from public speech corpora (CMU ARCTIC and L2-ARCTIC), run
            through Ant Flash the way a live call would be: fed 20 ms at a time, on a CPU. Same
            words, same voice, a different accent. Pick the accent to hear: American English, or
            Arabic-accented English for callers in the Gulf. Upscale the result to 48 kHz to hear it in full
            quality. The converted clip starts about 0.6 s late, as it would live.
          </p>
          <div className="mt-8">
            <ChainDemo
              base={B}
              samples={[{ id: "s1", label: "Speaker 1" }, { id: "s2", label: "Speaker 2" }]}
              options={[ACCENT, ...STEPS]}
              inputLabel="Original"
              resultLabel="Ant Flash"
            />
          </div>
        </Container>
      
        {LIVE_DEMO_ON && (
        <Container className="pb-12">
          <h3 className="text-xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-2xl">Try your own voice</h3>
          <div className="mt-6">
            <LiveDemo
              model="antflash"
              options={STEPS}
              prompt="Speak in Indian English for a few seconds, then hear it back in an American accent. Read something out, or talk about your day. Ant Flash converts Indian English to American English."
              inputLabel="Your recording"
              resultLabel="Ant Flash 3.2, American English"
            />
          </div>
        </Container>
        )}
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
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--color-fg)]">Try it on your calls</h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--color-muted)]">
            Ant Flash is available to license, deployed on your servers or ours. Indian English to
            American English and to Arabic-accented English are ready today, with more accent pairs
            on the way. Tell us about your calls and the accents you need.
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
