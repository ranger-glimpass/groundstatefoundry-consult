/** Single source of truth for brand + contact details. */

export const SITE = {
  name: "Ground State Foundry",
  legalName: "Ground State Foundry L.L.C-FZ",
  licence: "2653600.01",
  formation: "2653600",
  url: "https://groundstatefoundry.com",
  tagline: "Ground state: what an experiment settles into once it is perfected.",
  positioning:
    "A voice AI research lab. We build models that hear and speak on real calls: Nearfield, Audio Upscaler and Ant Flash, all real time on a CPU. We also make Lisn, an AI that talks to your customers, and Bubbles, open source.",
  email: "hello@groundstatefoundry.com",
  linkedin: "https://www.linkedin.com/company/ground-state-foundry",
  founders: [
    { name: "Rishi Raj", fullName: "Rishi Raj", role: "Founder & Chief Scientist", linkedin: "https://www.linkedin.com/in/rishi-raj-jaiswal-4b353913a/" },
    { name: "Devashish", fullName: "Devashish Jaiswal", role: "AI Advisor & Strategist", linkedin: "https://www.linkedin.com/in/devajais/" },
  ],
  address: {
    line1: "Meydan Grandstand, 6th Floor",
    line2: "Meydan Road, Nad Al Sheba",
    city: "Dubai, United Arab Emirates",
    zone: "Meydan Free Zone",
  },
} as const;

export const NAV: { href: string; label: string }[] = [
  { href: "/models", label: "Models" },
  { href: "/products", label: "Products" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
