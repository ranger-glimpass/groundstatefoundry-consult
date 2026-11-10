import type { Metadata } from "next";
import { Container } from "@/components/ui";
import ResearchLinks from "@/components/ResearchLinks";
import NearfieldDemo from "@/components/nearfield/NearfieldDemo";
import { getAllResearch } from "@/lib/research";
import { NEARFIELD_REPO, NEARFIELD_RESEARCH, getProduct } from "@/lib/products";

export const metadata: Metadata = {
  title: "Nearfield",
  alternates: { canonical: "/products/nearfield" },
  description:
    "Nearfield is an open-source (Apache-2.0) real-time filter for voice agents and calls. It keeps the voice closest to the microphone and removes noise and background speakers. Try it live in your browser.",
};

const FIGURES = [
  { v: "−41 dB", l: "background while the caller is silent (DFN3 alone: −16 dB)" },
  { v: "30 ms", l: "added delay: 10 ms frames, 20 ms lookahead" },
  { v: "0.5 to 2 ms", l: "CPU per 10 ms frame, one thread" },
  { v: "11 MB", l: "one ONNX model for 8, 16 and 48 kHz" },
];

const STRENGTHS = [
  { s: "DeepFilterNet3 alone, for reference", db: "−16 dB", stoi: "0.878", ref: true },
  { s: "Gentle", db: "−22 dB", stoi: "0.902" },
  { s: "Strong", db: "−37 dB", stoi: "0.893" },
  { s: "Full (default)", db: "−41 dB", stoi: "0.882" },
];

const STEPS = [
  {
    t: "Clean the noise",
    d: "DeepFilterNet3, an open noise-suppression model, removes hum, traffic, clatter and fans. On its own it keeps every voice, because to it every voice is speech worth keeping.",
  },
  {
    t: "Decide who owns each band",
    d: "A small head (562k parameters) reads DeepFilterNet's own internal features, which already encode how far away and how echoey a voice sounds. Every 10 ms, for each of 32 frequency bands, it decides: near voice, or background.",
  },
  {
    t: "Keep the caller, cut the rest",
    d: "A keep/cut rule turns those decisions into gains. Bands that belong to the caller pass through, the rest are pushed down hard, and short gaps between the caller's words are closed so the room does not leak in between them.",
  },
];

const INSTALL = `pip install "nearfield @ git+https://github.com/Ground-State-Foundry/nearfield"`;
const PIPECAT = `from nearfield.pipecat import NearfieldFilter

transport = DailyTransport(
    room_url, token, "bot",
    DailyParams(
        audio_in_enabled=True,
        audio_in_filter=NearfieldFilter(strength="full"),
    ),
)`;

function Code({ children, label }: { children: string; label: string }) {
  return (
    <figure className="min-w-0">
      <figcaption className="mono-label mb-2">{label}</figcaption>
      <pre className="overflow-x-auto rounded-xl border border-[var(--color-border-bright)] bg-[#070807] p-4 font-mono text-[13px] leading-relaxed text-[var(--color-fg)]">
        <code>{children}</code>
      </pre>
    </figure>
  );
}

export default function NearfieldPage() {
  const p = getProduct("nearfield")!;
  const have = new Set(getAllResearch().map((r) => r.slug));
  const research = NEARFIELD_RESEARCH.filter((s) => have.has(s));

  return (
    <>
      <header className="border-b border-[var(--color-border)] py-16">
        <Container>
          <div className="flex flex-wrap items-center gap-3">
            <p className="mono-label">product</p>
            <span className="tag">{p.status}</span>
          </div>
          <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-5xl">
            Nearfield keeps the caller&apos;s voice and removes everything else.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--color-muted)]">
            A real-time filter for voice agents and phone calls. It keeps the voice closest to the
            microphone and removes the noise and the other people talking in the room, in 10 ms
            steps, on one CPU thread. Try it below on your own voice: it runs in this browser tab.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#demo" className="btn btn-primary">Try it below ↓</a>
            <a href={NEARFIELD_REPO} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">View on GitHub ↗</a>
          </div>
        </Container>
      </header>

      <section id="demo" className="scroll-mt-20">
        <Container className="py-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-3xl">Hear it on your own audio</h2>
            <p className="mono-label">Nearfield v1.0.0 · runs in your browser</p>
          </div>
          <p className="mb-6 max-w-2xl leading-relaxed text-[var(--color-muted)]">
            Record from your mic with a TV or a podcast playing behind you, open a recording, or run
            the example call. The original and cleaned waveforms build up together, 10 ms at a time,
            the way a live call would be processed. Then play either one and compare.
          </p>
          <NearfieldDemo />
        </Container>
      </section>

      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">The wrong person keeps getting answered</h2>
          <div className="max-w-2xl space-y-4 text-lg leading-relaxed text-[var(--color-muted)]">
            <p>
              Someone calls a voice agent from a café. Behind them a TV is on, and two people at the
              next table are arguing about a football match.
            </p>
            <p>
              The agent hears all of it. It answers the TV. It treats a stranger&apos;s sentence as the
              caller&apos;s next turn. It waits for a pause that never comes, because somebody in the
              room is always talking. The caller says &ldquo;no, I didn&apos;t say that&rdquo; and the
              call falls apart.
            </p>
            <p>
              Noise suppression doesn&apos;t fix this. It was built to remove things that aren&apos;t
              speech, and the TV and the next table <em>are</em> speech. What the agent needs is
              something that knows which voice is the caller: the one right up against the
              microphone. Nearfield is that filter.
            </p>
          </div>
        </div>
      </Container>

      <Container className="py-12">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius,1rem)] border border-[var(--color-border)] bg-[var(--color-border)] lg:grid-cols-4">
          {FIGURES.map((f) => (
            <div key={f.v} className="bg-[var(--color-panel)] p-5 sm:p-7">
              <dt className="sr-only">{f.l}</dt>
              <dd>
                <span className="block text-2xl font-semibold tabular-nums text-[var(--color-fg)] sm:text-3xl">{f.v}</span>
                <span className="mt-2 block text-sm leading-snug text-[var(--color-muted)]">{f.l}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Container>

      <Container className="py-12">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">How it works</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-muted)]">
          Think of the sound as 32 lanes, from low hum to high hiss. Every 10 ms Nearfield looks at
          each lane and asks one question: is this the person holding the phone, or the room?
        </p>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.t} className="card flex flex-col p-7">
              <span className="font-mono text-sm tabular-nums text-[var(--color-dim)]">0{i + 1}</span>
              <h3 className="mt-3 text-lg font-semibold text-[var(--color-fg)]">{s.t}</h3>
              <p className="mt-3 leading-relaxed text-[var(--color-muted)]">{s.d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-2xl leading-relaxed text-[var(--color-muted)]">
          The whole thing is one 11 MB ONNX model. It processes audio in 10 ms frames with 20 ms of
          lookahead, so the cleaned audio arrives 30 ms after the original, and it takes 0.5 to 2 ms
          of one CPU thread per frame. The same model handles 8 kHz phone lines, 16 kHz and 48 kHz
          audio.
        </p>
      </Container>

      <Container className="py-12">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">How hard it cuts</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-muted)]">
          There are three strengths. The trade is simple: cut the background harder and the caller
          loses a little clarity at the edges of words.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--color-border-bright)]">
                <th className="mono-label py-3 pr-4 font-normal">Setting</th>
                <th className="mono-label py-3 pr-4 text-right font-normal">Background while the caller is silent</th>
                <th className="mono-label py-3 text-right font-normal">Caller intelligibility (STOI)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {STRENGTHS.map((r) => (
                <tr key={r.s} className={r.ref ? "text-[var(--color-muted)]" : "text-[var(--color-fg)]"}>
                  <td className="py-3.5 pr-4">{r.s}</td>
                  <td className="py-3.5 pr-4 text-right font-mono tabular-nums">{r.db}</td>
                  <td className="py-3.5 text-right font-mono tabular-nums">{r.stoi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="card p-7">
            <p className="mono-label">How it was measured</p>
            <p className="mt-3 leading-relaxed text-[var(--color-muted)]">
              48 held-out simulated calls, with speakers and rooms the model never saw in training, at
              8, 16 and 48 kHz. The background number is how much quieter the room gets while the
              caller is silent; every 10 dB down is ten times less sound energy. STOI is a standard
              score from 0 to 1 for how intelligible speech is; higher is clearer.
            </p>
          </div>
          <div className="card p-7">
            <p className="mono-label">Echo-tail remover (demo only)</p>
            <p className="mt-3 leading-relaxed text-[var(--color-muted)]">
              A hand-programmed extra in the demo above, with no training. It targets background voices
              while the caller is talking: voice over background goes from 4.3 to 6.1 dB, and in
              exchange the caller&apos;s word endings soften (STOI 0.892 to 0.874).
            </p>
          </div>
        </div>
      </Container>

      <Container className="py-12">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">Limits</h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          <li className="card p-7 leading-relaxed text-[var(--color-muted)]">
            <span className="block font-semibold text-[var(--color-fg)]">Overlapping voices can stay faintly audible.</span>
            <span className="mt-2 block">
              While the caller is talking, a background voice that sits in the same frequencies as the
              caller can still be heard faintly. When the caller stops, it is cut hard.
            </span>
          </li>
          <li className="card p-7 leading-relaxed text-[var(--color-muted)]">
            <span className="block font-semibold text-[var(--color-fg)]">The Pipecat filter is not yet proven in a live pipeline.</span>
            <span className="mt-2 block">
              It was tested against stand-ins for Pipecat&apos;s classes, not yet inside a running
              Pipecat pipeline. If you try it there, we would like to hear how it goes.
            </span>
          </li>
        </ul>
      </Container>

      <Container className="py-12">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">Use it</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-muted)]">
          Nearfield is a Python package. The model is attached to the v1.0.0 release and downloads
          once on first use. In a Pipecat voice agent it drops in as the transport&apos;s input filter;
          the strength is <code className="font-mono text-sm text-[var(--color-fg)]">&quot;gentle&quot;</code>,{" "}
          <code className="font-mono text-sm text-[var(--color-fg)]">&quot;strong&quot;</code> or{" "}
          <code className="font-mono text-sm text-[var(--color-fg)]">&quot;full&quot;</code>.
        </p>
        <div className="mt-8 grid gap-6">
          <Code label="Install">{INSTALL}</Code>
          <Code label="Pipecat">{PIPECAT}</Code>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={NEARFIELD_REPO} target="_blank" rel="noopener noreferrer" className="btn btn-primary">View on GitHub ↗</a>
          <a href={`${NEARFIELD_REPO}/releases/tag/v1.0.0`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Release v1.0.0 ↗</a>
        </div>
      </Container>

      {research.length > 0 && (
        <Container className="py-12">
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">The research behind it</h2>
          <div className="mt-8">
            <ResearchLinks slugs={research} />
          </div>
        </Container>
      )}

      <Container className="py-12 pb-20">
        <div className="card p-8 sm:p-10">
          <p className="mono-label">Credits and licence</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-[var(--color-muted)]">
            Nearfield is released by Ground State Foundry under the Apache-2.0 licence. It is built on{" "}
            <a href="https://github.com/Rikorose/DeepFilterNet" target="_blank" rel="noopener noreferrer" className="link-u">DeepFilterNet3</a>{" "}
            and includes its weights by Hendrik Schröter, used under the MIT licence. The browser demo
            runs on{" "}
            <a href="https://onnxruntime.ai" target="_blank" rel="noopener noreferrer" className="link-u">ONNX Runtime Web</a>.
          </p>
        </div>
      </Container>
    </>
  );
}
