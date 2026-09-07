/** Single source of truth for brand + contact details. */

export const SITE = {
  name: "Ground State Foundry",
  url: "https://groundstatefoundry.com",
  tagline: "The only way forward is upward.",
  positioning:
    "An AI consultancy that builds enterprise-grade AI systems and backs startups from zero.",
  email: "hello@groundstatefoundry.com",
  linkedin: "https://www.linkedin.com/company/ground-state-foundry",
  founders: [
    { name: "Rishi", fullName: "Rishi Raj Jaiswal", role: "Director", linkedin: "https://www.linkedin.com/in/rishi-raj-jaiswal-4b353913a/" },
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
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/startups", label: "Startups" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
