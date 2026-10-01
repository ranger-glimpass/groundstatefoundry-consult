"use client";

import { useState } from "react";

/** Show-to-scan QR, for handing the card to someone in person from your own screen. */
export default function CardQr() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="btn btn-ghost w-full gap-2"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2" />
        </svg>
        {open ? "Hide QR code" : "Show QR code"}
      </button>
      {open && (
        <div className="mt-4 rounded-2xl bg-white p-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/card/qr.svg" alt="QR code linking to this card" className="mx-auto w-full max-w-[16rem]" />
          <p className="mt-3 text-center text-xs text-neutral-500">Scan to open this card</p>
        </div>
      )}
    </div>
  );
}
