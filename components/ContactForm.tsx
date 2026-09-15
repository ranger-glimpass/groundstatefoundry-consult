"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

const INTERESTS = [
  "Voice AI",
  "Agents & automation",
  "Enterprise AI solution",
  "Simulation",
  "AI strategy & advisory",
  "Something else",
];

export default function ContactForm() {
  const [interest, setInterest] = useState(INTERESTS[0]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "");
    const company = String(data.get("company") || "");
    const message = String(data.get("message") || "");

    const subject = `New enquiry · ${interest}`;
    const body = [
      `Name: ${name}`,
      `Company: ${company}`,
      `Interested in: ${interest}`,
      "",
      message,
    ].join("\n");

    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="card p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mono-label">Name</span>
          <input name="name" required className="field mt-2" placeholder="Your name" />
        </label>
        <label className="block">
          <span className="mono-label">Company</span>
          <input name="company" className="field mt-2" placeholder="Company (optional)" />
        </label>
      </div>

      <div className="mt-5">
        <span className="mono-label">I&apos;m interested in</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {INTERESTS.map((i) => (
            <button
              type="button"
              key={i}
              onClick={() => setInterest(i)}
              className={interest === i ? "tag tag-neon" : "tag"}
              aria-pressed={interest === i}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <label className="mt-5 block">
        <span className="mono-label">What are you trying to move?</span>
        <textarea
          name="message"
          required
          rows={5}
          className="field mt-2 resize-y"
          placeholder="A sentence or two about the problem, the workflow, or the idea."
        />
      </label>

      <button type="submit" className="btn btn-primary mt-6 w-full sm:w-auto">
        Send enquiry →
      </button>
      <p className="mt-3 text-xs text-[var(--color-dim)]">
        This opens your email client. Prefer to write directly? {SITE.email}
      </p>
    </form>
  );
}
