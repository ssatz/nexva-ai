/*
  MarketingShell — shared Top Nav + Footer for all public marketing pages
  (/chatpdf, /imagegen, /pricing). Strict B&W theme.
*/

import { Link } from "wouter";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActiveNav = "chat" | "chatpdf" | "imagegen" | "video" | "homework" | "research" | "pricing" | null;

const NAV_LINKS: { label: string; href: string; key: ActiveNav }[] = [
  { label: "Chat", href: "/", key: "chat" },
  { label: "Chat With PDF", href: "/chatpdf", key: "chatpdf" },
  { label: "Image Generation", href: "/imagegen", key: "imagegen" },
  { label: "Video Generation", href: "/", key: "video" },
  { label: "AI Homework", href: "/", key: "homework" },
  { label: "Deep Research", href: "/", key: "research" },
  { label: "Pricing", href: "/pricing", key: "pricing" },
];

export function MarketingNav({ active }: { active: ActiveNav }) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-neutral-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/">
          <a className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black">
              <span className="text-[11px] font-bold text-white">N</span>
            </div>
            <span className="text-[17px] font-semibold tracking-tight">Nexva</span>
          </a>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href}>
              <a
                className={cn(
                  "text-[13.5px] transition-colors",
                  active === link.key
                    ? "font-semibold text-neutral-900 underline underline-offset-[7px] decoration-2"
                    : "text-neutral-500 hover:text-neutral-900",
                )}
              >
                {link.label}
              </a>
            </Link>
          ))}
        </nav>
        <Link href="/">
          <a className="inline-flex h-9 items-center rounded-md bg-neutral-900 px-4 text-[13px] font-semibold text-white transition-opacity hover:opacity-90">
            Get Started
          </a>
        </Link>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  const cols = [
    { title: "Chat Tools", links: [{ l: "Chat with PDF", h: "/chatpdf" }, { l: "AI Chat", h: "/" }] },
    { title: "AI Tools", links: [{ l: "Image Generation", h: "/imagegen" }, { l: "Video Generation", h: "/" }] },
    { title: "AI Homework", links: [{ l: "AI Homework Helper", h: "/" }, { l: "AI Math Solver", h: "/" }] },
    { title: "Company", links: [{ l: "Pricing", h: "/pricing" }, { l: "Contact Us", h: "/" }] },
    { title: "Legal", links: [{ l: "Terms of Service", h: "/" }, { l: "Privacy Policy", h: "/" }, { l: "Security", h: "/" }, { l: "EULA", h: "/" }, { l: "Content Policy", h: "/" }] },
  ];
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-6">
          <div className="md:col-span-1">
            <Link href="/">
              <a className="flex items-center gap-2 text-white">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
                  <span className="text-[11px] font-bold text-neutral-950">N</span>
                </div>
                <span className="text-[16px] font-semibold tracking-tight">Nexva</span>
              </a>
            </Link>
            <p className="mt-4 text-[12.5px] leading-relaxed text-neutral-400">
              Your All-in-One AI Suite for productivity. Chat, create, and analyze with the world's best models.
            </p>
            <a
              href="mailto:support@nexva.ai"
              className="mt-5 inline-flex items-center gap-2 text-[12.5px] text-neutral-400 hover:text-white"
            >
              <Mail className="h-3.5 w-3.5" strokeWidth={1.75} /> support@nexva.ai
            </a>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-semibold text-white">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.l}>
                    <Link href={link.h}>
                      <a className="text-[12.5px] text-neutral-400 hover:text-white">{link.l}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex items-center justify-between border-t border-neutral-800 pt-6 text-[12px] text-neutral-500">
          <span>© 2026 Nexva.ai. All rights reserved.</span>
          <span className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-neutral-300">
            🇬🇧 English
          </span>
        </div>
      </div>
    </footer>
  );
}

export function SectionHeading({
  title,
  subtitle,
  icon,
  eyebrow,
}: {
  title: string;
  subtitle?: string | null;
  icon?: React.ReactNode;
  eyebrow?: string | null;
}) {
  return (
    <div className="text-center">
      {eyebrow && (
        <div className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
          {eyebrow}
        </div>
      )}
      <h2 className="inline-flex items-center justify-center gap-2 text-[30px] font-bold tracking-tight text-neutral-900 md:text-[36px]">
        {icon}
        {title}
      </h2>
      {subtitle && <p className="mx-auto mt-3 max-w-2xl text-[14.5px] text-neutral-500">{subtitle}</p>}
    </div>
  );
}
