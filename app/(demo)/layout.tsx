/** Full-page live demos: no site nav or footer, the demo fills the window and Lisn docks beside it. */
export default function DemoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="relative z-10 min-w-0">{children}</div>;
}
