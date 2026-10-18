import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Playground from "@/components/playground/Playground";
import DemoWidget from "@/components/playground/DemoWidget";
import { demoBrief } from "@/components/playground/engine/brief";
import { SCENARIOS, scenarioById } from "@/components/playground/scenarios";

export const dynamicParams = false;

export function generateStaticParams() {
  return SCENARIOS.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const scn = scenarioById(id);
  if (!scn) return {};
  return {
    title: `${scn.name} live demo`,
    alternates: { canonical: `/playground/${scn.id}` },
    description: `A live demo of Lisn on ${scn.name}, a website made up for this demo. Ask Lisn anything and it clicks, fills in forms and highlights what it is talking about. ${scn.task}`,
  };
}

export default async function DemoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scn = scenarioById(id);
  if (!scn) notFound();
  return (
    <>
      {/* Read by the Lisn widget on this page only. */}
      <script type="application/json" id="markaible-page" dangerouslySetInnerHTML={{ __html: JSON.stringify(demoBrief(scn)) }} />
      <Playground id={scn.id} />
      <DemoWidget />
    </>
  );
}
