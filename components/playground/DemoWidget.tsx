"use client";

import Script from "next/script";
import { LISN_AGENT_ID, LISN_WIDGET_SRC } from "@/lib/products";

/**
 * The one Lisn snippet on a demo page: docked on the side and opened on chat. data-open and the
 * Markaible.open call are harmless on a widget build that does not support them yet.
 */
export default function DemoWidget() {
  if (!LISN_AGENT_ID) return null;
  const onLoad = () => {
    let tries = 0;
    const tick = () => {
      if (window.Markaible?.open) {
        try { window.Markaible.open({ tab: "chat" }); } catch { /* older widget: the launcher still works */ }
        return;
      }
      if (++tries < 40) setTimeout(tick, 150);
    };
    tick();
  };
  return (
    <Script
      src={LISN_WIDGET_SRC}
      data-agent={LISN_AGENT_ID}
      data-layout="dock"
      data-open="chat"
      strategy="afterInteractive"
      onLoad={onLoad}
    />
  );
}
