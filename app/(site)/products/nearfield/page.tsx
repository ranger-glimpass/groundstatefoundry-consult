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
    "Nearfield is an open-source (Apache-2.0) real-time filter for voice agents and calls. It keeps the voice closest to the microphone and removes noise and background speakers, on one CPU thread. Try it live in your browser.",
};

const FIGURES = [
  { v: "13.9%", l: "of the caller's words lost with an equally loud person talking behind them (no filter: 41.4%)" },
  { v: "128 ms", l: "added delay: the model looks 96 ms ahead" },
  { v: "0.2 s", l: "of one CPU thread per second of audio" },
  { v: "2.5 MB", l: "one ONNX model, about 628,000 weights, 16 kHz" },
];

// Share of the caller's words missing from the transcript (lower is better)
const WORDS_LOST = [
  { s: "No filter", cols: ["2.3%", "3.1%", "17.9%", "41.4%", "38.4%"], ref: true },
  { s: "Version 1, gentle", cols: ["2.6%", "3.3%", "8.8%", "30.9%", "40.3%"] },
  { s: "Version 1, balanced", cols: ["2.4%", "2.8%", "12.5%", "31.3%", "51.2%"] },
  { s: "Version 2", cols: ["2.3%", "4.4%", "5.4%", "13.9%", "32.2%"], hi: true },
];
const WORDS_COLS = ["Clean", "Steady noise", "Quieter talker", "Equal talker", "Babble"];

const STEPS = [
  {
    t: "Turn the sound into frequencies",
    d: "The call is cut into short overlapping slices, one every 8 ms, and each slice is turned into its spectrum. The spectrum is grouped into 64 bands, finer at the low frequencies where voices differ most.",
  },
  {
    t: "Follow each voice",
    d: "A small recurrent network reads the bands. In each of its four blocks it reads across the frequencies of one slice to see what belongs together, then along time, forwards only, to follow each voice from one slice to the next.",
  },
  {
    t: "Keep the caller",
    d: "For every slice it writes a mask: how much of each frequency to keep, and how to shift it. Applying the mask leaves the caller. A light clean-up then steadies the volume and quietens the pauses between words.",
  },
];

const INSTALL = `pip install "nearfield @ git+https://github.com/Ground-State-Foundry/nearfield"`;
const PIPECAT = `from nearfield.pipecat import NearfieldFilter

transport = DailyTransport(
    room_url, token, "bot",
    DailyParams(
        audio_in_enabled=True,
        audio_in_filter=NearfieldFilter(),
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
            microphone and removes the noise and the other people talking in the room, as the call
            happens, on one CPU thread. Try it below on your own voice: it runs in this browser tab.
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
            <p className="mono-label">Nearfield v2.0.0 · runs in your browser</p>
          </div>
          <p className="mb-6 max-w-2xl leading-relaxed text-[var(--color-muted)]">
            Run the example call at one of five background levels, from quiet room noise up to a room
            full of people talking. Or record from your mic with a TV or a podcast playing behind you,
            or open a recording. The original and cleaned waveforms build up together, 8 ms at a time,
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
          The first version asked, for each frequency band, whether it belonged to the caller or the
          room, and turned bands up or down. That fails when another person is talking, because two
          voices share the same bands. Version 2 is a new model, trained from scratch by us, that
          separates the voices instead.
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
          The whole thing is one 2.5 MB ONNX model with about 628,000 weights. It waits 96 ms before
          it commits to a slice, so the cleaned audio arrives 128 ms after the original, and it takes
          about 0.2 seconds of one CPU thread per second of audio. It works at 16 kHz; phone lines
          and wideband calls are resampled in and out. The weights are open. The training code is not.
        </p>
      </Container>

      <Container className="py-12">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">What we measured</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-muted)]">
          The test that matters for a voice agent is whether the caller&apos;s words survive. We mixed
          callers with a background talker, babble or steady noise, cleaned the result, and gave it
          to a speech recogniser.
        </p>
        <p className="mono-label mt-8">Share of the caller&apos;s words missing from the transcript (lower is better)</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[620px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--color-border-bright)]">
                <th className="mono-label py-3 pr-4 font-normal">Setting</th>
                {WORDS_COLS.map((c) => (
                  <th key={c} className="mono-label py-3 pr-4 text-right font-normal">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {WORDS_LOST.map((r) => (
                <tr key={r.s} className={r.ref ? "text-[var(--color-muted)]" : r.hi ? "font-semibold text-[var(--color-fg)]" : "text-[var(--color-fg)]"}>
                  <td className="py-3.5 pr-4">{r.s}</td>
                  {r.cols.map((v, i) => (
                    <td key={i} className="py-3.5 pr-4 text-right font-mono tabular-nums">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="card p-7">
            <p className="mono-label">How it was measured</p>
            <p className="mt-3 leading-relaxed text-[var(--color-muted)]">
              40 callers per condition reading English sentences, mixed with a background talker,
              babble or steady noise, sent through an 8 kHz phone line and transcribed by Whisper
              large-v3-turbo. Gaps under about 5 points are within noise. The no-filter and
              version 1 rows are the ones published with v1.1.0; the version 2 row was scored later
              on the same clips with the same recogniser.
            </p>
          </div>
          <div className="card p-7">
            <p className="mono-label">What else we measured</p>
            <p className="mt-3 leading-relaxed text-[var(--color-muted)]">
              When only the background was talking, the output was 49 dB below the input and none of
              those clips produced a transcript of four or more words. While the caller talks, an
              equally loud background voice comes out about 16 dB quieter and the caller about 3 dB
              quieter, measured on the model output before the clean-up stage.
            </p>
          </div>
        </div>
      </Container>

      <Container className="py-12">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">Limits</h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          <li className="card p-7 leading-relaxed text-[var(--color-muted)]">
            <span className="block font-semibold text-[var(--color-fg)]">Babble is still hard.</span>
            <span className="mt-2 block">
              With a whole room talking at the caller&apos;s level, about 32 in 100 of the
              caller&apos;s words are still lost. That is better than version 1 (40 to 51) and about
              6 better than no filter.
            </span>
          </li>
          <li className="card p-7 leading-relaxed text-[var(--color-muted)]">
            <span className="block font-semibold text-[var(--color-fg)]">The background is reduced under the caller, not removed.</span>
            <span className="mt-2 block">
              While the caller is talking, an equally loud background voice comes out about 16 dB
              quieter. It can still be heard faintly. When the caller stops, it is cut hard.
            </span>
          </li>
          <li className="card p-7 leading-relaxed text-[var(--color-muted)]">
            <span className="block font-semibold text-[var(--color-fg)]">More delay than version 1.</span>
            <span className="mt-2 block">
              128 ms against 30 ms. Telling two voices apart needs a longer look ahead. Version 1
              is still available from the v1.1.0 tag for calls that cannot afford it.
            </span>
          </li>
          <li className="card p-7 leading-relaxed text-[var(--color-muted)]">
            <span className="block font-semibold text-[var(--color-fg)]">Measured on simulated calls.</span>
            <span className="mt-2 block">
              The numbers above come from mixed recordings, not live phone lines. Real rooms and
              real networks will differ, which is why the demo above runs on your own audio.
            </span>
          </li>
        </ul>
      </Container>

      <Container className="py-12">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">Use it</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-muted)]">
          Nearfield is a Python package. The 2.5 MB model ships inside it, so nothing is downloaded
          at run time. In a Pipecat voice agent it drops in as the transport&apos;s input filter.
        </p>
        <div className="mt-8 grid gap-6">
          <Code label="Install">{INSTALL}</Code>
          <Code label="Pipecat">{PIPECAT}</Code>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={NEARFIELD_REPO} target="_blank" rel="noopener noreferrer" className="btn btn-primary">View on GitHub ↗</a>
          <a href={`${NEARFIELD_REPO}/releases/tag/v2.0.0`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Release v2.0.0 ↗</a>
        </div>
      </Container>

      {research.length > 0 && (
        <Container className="py-12">
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">Where it started</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-[var(--color-muted)]">
            This piece covers the first version and the problem it set out to solve.
          </p>
          <div className="mt-8">
            <ResearchLinks slugs={research} />
          </div>
        </Container>
      )}

      <Container className="py-12 pb-20">
        <div className="card p-8 sm:p-10">
          <p className="mono-label">Credits and licence</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-[var(--color-muted)]">
            Nearfield is released by Ground State Foundry under the Apache-2.0 licence, code and
            weights. Version 2 is our own model, trained from scratch. The browser demo runs on{" "}
            <a href="https://onnxruntime.ai" target="_blank" rel="noopener noreferrer" className="link-u">ONNX Runtime Web</a>.
          </p>
        </div>
      </Container>
    </>
  );
}
