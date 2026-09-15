/** Research content pipeline. Pieces live as markdown in content/research/*.md. */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ResearchCategory = { slug: string; title: string; blurb: string };

export const RESEARCH_CATEGORIES: ResearchCategory[] = [
  {
    slug: "evolutionary-systems",
    title: "Evolutionary & Self-Improving Systems",
    blurb: "Code that changes itself, and search that finds answers we did not hand it.",
  },
  {
    slug: "multi-agent-systems",
    title: "Multi-Agent Systems & Orchestration",
    blurb: "What happens when many agents work, talk, and hand off to each other.",
  },
  {
    slug: "voice-ai",
    title: "Voice & Conversational AI",
    blurb: "Latency, turn-taking, translation, and the hard parts of talking to a machine.",
  },
  {
    slug: "agent-simulation",
    title: "Agent Simulation & Evaluation",
    blurb: "Using simulated people and traffic to test systems before the real thing.",
  },
  {
    slug: "applied-ai",
    title: "Applied AI in Production",
    blurb: "War stories from putting AI to work inside real businesses, and what held up.",
  },
  {
    slug: "perspectives",
    title: "AI, Philosophy & the Frontier",
    blurb: "Slower thoughts on intelligence, language, and being human while the machines learn.",
  },
];

export function categoryTitle(slug: string) {
  return RESEARCH_CATEGORIES.find((c) => c.slug === slug)?.title ?? slug;
}

export type ResearchMeta = {
  slug: string;
  title: string;
  category: string; // category slug
  date: string; // ISO
  excerpt: string;
  author: string;
  readingTime: string;
};

export type ResearchPiece = ResearchMeta & { content: string };

const DIR = path.join(process.cwd(), "content", "research");

function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

export function getAllResearch(): ResearchMeta[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(DIR, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: String(data.title ?? slug),
        category: String(data.category ?? "perspectives"),
        date: String(data.date ?? "1970-01-01"),
        excerpt: String(data.excerpt ?? ""),
        author: String(data.author ?? "Ground State Foundry"),
        readingTime: readingTime(content),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getResearch(slug: string): ResearchPiece | null {
  const file = path.join(DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    category: String(data.category ?? "perspectives"),
    date: String(data.date ?? "1970-01-01"),
    excerpt: String(data.excerpt ?? ""),
    author: String(data.author ?? "Ground State Foundry"),
    readingTime: readingTime(content),
    content,
  };
}
