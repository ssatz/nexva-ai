/*
  PricingLanding — public marketing page at /pricing.
  Strict B&W theme matching /chatpdf and /imagegen.
*/

import { useState } from "react";
import { MarketingNav, MarketingFooter, SectionHeading } from "@/components/MarketingShell";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, HelpCircle, Sparkles, Building2, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Billing = "monthly" | "yearly";

export default function PricingLanding() {
  const [billing, setBilling] = useState<Billing>("monthly");
  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <MarketingNav active="pricing" />
      <Hero billing={billing} setBilling={setBilling} />
      <Tiers billing={billing} />
      <Compare />
      <Faq />
      <MarketingFooter />
    </div>
  );
}

/* ─────────────── Hero ─────────────── */

function Hero({ billing, setBilling }: { billing: Billing; setBilling: (b: Billing) => void }) {
  return (
    <section
      className="relative overflow-hidden border-b border-neutral-200 bg-white py-20"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h1 className="text-[44px] font-bold leading-[1.08] tracking-tight md:text-[58px]">
          <span className="block text-neutral-900">One Subscription.</span>
          <span className="block italic text-neutral-400">Every Model.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[15.5px] leading-relaxed text-neutral-600">
          Stop paying for ChatGPT, Claude, Gemini, Midjourney, and Veo separately. Get all the world's best
          AI models under one Nexva subscription.
        </p>

        {/* Billing toggle */}
        <div className="mx-auto mt-10 inline-flex rounded-full border border-neutral-300 bg-white p-1 text-[13px]">
          <BillingButton active={billing === "monthly"} onClick={() => setBilling("monthly")}>
            Monthly
          </BillingButton>
          <BillingButton active={billing === "yearly"} onClick={() => setBilling("yearly")}>
            Yearly
            <span className="ml-2 rounded-full bg-neutral-900 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              −20%
            </span>
          </BillingButton>
        </div>
      </div>
    </section>
  );
}

function BillingButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full px-4 py-1.5 font-medium transition-all",
        active ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-900",
      )}
    >
      {children}
    </button>
  );
}

/* ─────────────── Tiers ─────────────── */

const TIERS = [
  {
    id: "free",
    icon: Sparkles,
    name: "Free",
    tagline: "For trying things out.",
    monthly: 0,
    yearly: 0,
    cta: "Get Started",
    highlight: false,
    features: [
      "5 chats per day",
      "5 PDF uploads / month",
      "10 image generations / month",
      "Standard models (Gemini Flash Lite, Grok Fast)",
      "Community support",
    ],
  },
  {
    id: "pro",
    icon: Sparkles,
    name: "Pro",
    tagline: "For creators & power users.",
    monthly: 18,
    yearly: 14,
    cta: "Upgrade to Pro",
    highlight: true,
    features: [
      "Unlimited chats",
      "Unlimited PDF uploads (100MB+)",
      "500 image / video generations / month",
      "All Pro models (Claude Sonnet, Gemini Pro, Imagen 4, Veo 3)",
      "4K image exports + 1080p video",
      "Priority queue + faster latency",
      "Email + chat support",
    ],
  },
  {
    id: "business",
    icon: Building2,
    name: "Business",
    tagline: "For teams & companies.",
    monthly: 49,
    yearly: 39,
    cta: "Talk to Sales",
    highlight: false,
    features: [
      "Everything in Pro",
      "Shared team workspaces",
      "SSO + role-based access",
      "Admin analytics & audit logs",
      "Custom retention policies",
      "Dedicated account manager",
      "99.9% uptime SLA",
    ],
  },
] as const;

function Tiers({ billing }: { billing: Billing }) {
  return (
    <section className="border-b border-neutral-200 bg-neutral-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {TIERS.map((t) => (
            <article
              key={t.id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-white p-7 transition-all",
                t.highlight
                  ? "border-neutral-900 shadow-[0_24px_60px_-25px_rgba(0,0,0,0.45)] md:-translate-y-3"
                  : "border-neutral-200 hover:border-neutral-400",
              )}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-neutral-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  Most Popular
                </div>
              )}
              <div className="flex items-center gap-2">
                <t.icon className="h-4 w-4 text-neutral-700" strokeWidth={1.75} />
                <span className="text-[13.5px] font-semibold uppercase tracking-wide text-neutral-700">
                  {t.name}
                </span>
              </div>
              <p className="mt-1.5 text-[13.5px] text-neutral-500">{t.tagline}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-[44px] font-bold leading-none tracking-tight">
                  ${billing === "monthly" ? t.monthly : t.yearly}
                </span>
                <span className="text-[13.5px] text-neutral-500">/ month</span>
              </div>
              {billing === "yearly" && t.monthly > 0 && (
                <div className="mt-1 text-[12px] text-neutral-500">
                  Billed annually at ${t.yearly * 12}
                </div>
              )}

              <Button
                onClick={() => toast(`Selected: ${t.name}`)}
                className={cn(
                  "mt-6 h-11 w-full rounded-md text-[13.5px] font-semibold",
                  t.highlight
                    ? "bg-neutral-900 text-white hover:bg-neutral-800"
                    : "bg-white text-neutral-900 border border-neutral-300 hover:bg-neutral-50",
                )}
              >
                {t.cta}
              </Button>

              <div className="my-6 h-px w-full bg-neutral-200" />

              <ul className="flex-1 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-neutral-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-neutral-900" strokeWidth={2.25} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Comparison Matrix ─────────────── */

const ROWS: { group: string; rows: { label: string; free: string | boolean; pro: string | boolean; biz: string | boolean }[] }[] = [
  {
    group: "Chat",
    rows: [
      { label: "Daily message limit", free: "5 / day", pro: "Unlimited", biz: "Unlimited" },
      { label: "Pro models (Claude Sonnet, Gemini Pro)", free: false, pro: true, biz: true },
      { label: "Conversation history search", free: true, pro: true, biz: true },
    ],
  },
  {
    group: "PDF & Documents",
    rows: [
      { label: "Monthly PDF uploads", free: "5", pro: "Unlimited", biz: "Unlimited" },
      { label: "Max file size", free: "20MB", pro: "100MB+", biz: "100MB+" },
      { label: "Citations with page numbers", free: true, pro: true, biz: true },
    ],
  },
  {
    group: "Image & Video",
    rows: [
      { label: "Image generations / month", free: "10", pro: "500", biz: "Custom" },
      { label: "Video generations / month", free: "0", pro: "30", biz: "Custom" },
      { label: "4K export + 1080p video", free: false, pro: true, biz: true },
      { label: "Commercial license", free: false, pro: true, biz: true },
    ],
  },
  {
    group: "Team & Security",
    rows: [
      { label: "Shared workspaces", free: false, pro: false, biz: true },
      { label: "SSO & role-based access", free: false, pro: false, biz: true },
      { label: "Audit logs", free: false, pro: false, biz: true },
      { label: "Dedicated account manager", free: false, pro: false, biz: true },
      { label: "99.9% uptime SLA", free: false, pro: false, biz: true },
    ],
  },
];

function Compare() {
  return (
    <section className="border-b border-neutral-200 bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading title="Compare Plans" subtitle="Every detail, side by side." />

        <div className="mt-14 overflow-hidden rounded-2xl border border-neutral-200">
          {/* Header */}
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] border-b border-neutral-200 bg-neutral-50">
            <div className="px-5 py-4 text-[12px] font-semibold uppercase tracking-wide text-neutral-500">
              Feature
            </div>
            {["Free", "Pro", "Business"].map((n) => (
              <div
                key={n}
                className={cn(
                  "px-5 py-4 text-center text-[13px] font-bold",
                  n === "Pro" ? "bg-neutral-900 text-white" : "text-neutral-900",
                )}
              >
                {n}
              </div>
            ))}
          </div>

          {/* Body */}
          {ROWS.map((g) => (
            <div key={g.group}>
              <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] border-b border-neutral-200 bg-neutral-50">
                <div className="col-span-4 px-5 py-3 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
                  {g.group}
                </div>
              </div>
              {g.rows.map((r, i) => (
                <div
                  key={r.label}
                  className={cn(
                    "grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center",
                    i !== g.rows.length - 1 && "border-b border-neutral-100",
                  )}
                >
                  <div className="px-5 py-3.5 text-[13px] text-neutral-800">{r.label}</div>
                  <Cell value={r.free} />
                  <Cell value={r.pro} highlight />
                  <Cell value={r.biz} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cell({ value, highlight }: { value: string | boolean; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center px-5 py-3.5 text-[13px]",
        highlight && "bg-neutral-50",
      )}
    >
      {typeof value === "boolean" ? (
        value ? (
          <Check className="h-4 w-4 text-neutral-900" strokeWidth={2.25} />
        ) : (
          <Minus className="h-4 w-4 text-neutral-300" strokeWidth={2} />
        )
      ) : (
        <span className="text-neutral-800">{value}</span>
      )}
    </div>
  );
}

/* ─────────────── FAQ ─────────────── */

function Faq() {
  const items = [
    { q: "Can I switch plans at any time?", a: "Yes. Upgrades take effect immediately, and downgrades apply at the end of your current billing cycle." },
    { q: "Do unused credits roll over?", a: "Free-tier credits reset monthly. Pro and Business credits reset monthly but unused image-generation credits roll over for one month." },
    { q: "Is there a refund policy?", a: "We offer a 7-day money-back guarantee on all paid plans. Just email support@nexva.ai." },
    { q: "Do you offer discounts for students or non-profits?", a: "Yes — 50% off Pro for verified students and registered non-profits. Contact us to apply." },
    { q: "Can I bring my own API keys?", a: "Business plan customers can bring their own keys for OpenAI, Anthropic, Google, and xAI to use their own quotas." },
  ];
  return (
    <section className="border-b border-neutral-200 bg-white py-24">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading title="Frequently Asked Questions" subtitle={null} icon={<HelpCircle className="h-4 w-4" strokeWidth={1.75} />} />
        <div className="mt-12 space-y-3">
          {items.map((it, i) => (
            <FaqItem key={i} q={it.q} a={it.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-neutral-200 bg-white">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="text-[14.5px] font-semibold text-neutral-900">{q}</span>
        <ChevronDown className={cn("h-4 w-4 text-neutral-500 transition-transform duration-200", open && "rotate-180")} strokeWidth={2} />
      </button>
      {open && <div className="px-5 pb-4 text-[13.5px] leading-relaxed text-neutral-600">{a}</div>}
    </div>
  );
}

// silence unused import lint for X (kept for future close buttons)
void X;
