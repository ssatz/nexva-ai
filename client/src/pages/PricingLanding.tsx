/*
  PricingLanding — public marketing page at /pricing.
  Strict B&W theme matching /chatpdf and /imagegen.

  DESIGN: hero with monthly/yearly toggle → 3-tier table (Free / Standard most-popular / Whale)
          → grouped Compare Plans matrix → FAQ → MarketingFooter.
  CONTENT: credit-based tiers from the Nexva.ai pricing reference (Free $0/100c,
           Standard $20/10,000c, Whale $100/55,000c) with per-tier Basic / Advanced / Image-Video
           model lists.
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
          <span className="block text-neutral-900">Plans &amp; Credits.</span>
          <span className="block italic text-neutral-400">One Subscription.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[15.5px] leading-relaxed text-neutral-600">
          Choose the perfect plan for your study needs. Upgrade anytime as you scale.
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

/* ─────────────── Tiers (3-card layout, content from credit-based reference) ─────────────── */

const TIERS = [
  {
    id: "free",
    icon: Sparkles,
    name: "Free",
    tagline: "For trying things out.",
    monthly: 0,
    yearly: 0,
    credits: 100,
    cta: "Current Plan",
    highlight: false,
    features: [
      "100 credits / month",
      "Basic models: GPT-4o mini, Claude 3.5 Haiku, DeepSeek V3 & R1",
      "5 PDF uploads / month (max 20MB)",
      "10 image generations / month",
      "Community support",
    ],
  },
  {
    id: "standard",
    icon: Sparkles,
    name: "Standard",
    tagline: "For creators & power users.",
    monthly: 20,
    yearly: 16,
    credits: 10_000,
    cta: "Subscribe Now",
    highlight: true,
    features: [
      "10,000 credits / month",
      "Basic models: GPT-4o mini, Claude 3.5 Haiku, DeepSeek V3 & R1",
      "Advanced models: o3 & o4-mini, Claude 3.7 Sonnet, Gemini 2.5 Pro",
      "Image / video models: DALL·E 3, Imagen 4, Flux 1.1",
      "Unlimited PDF uploads (100MB+)",
      "Priority queue + faster latency",
      "Email + chat support",
    ],
  },
  {
    id: "whale",
    icon: Building2,
    name: "Whale",
    tagline: "For teams & heavy usage.",
    monthly: 100,
    yearly: 80,
    credits: 55_000,
    cta: "Subscribe Now",
    highlight: false,
    features: [
      "55,000 credits / month",
      "Everything in Standard",
      "Image / video: DALL·E 3, Imagen 4, Flux 1.1, Veo 3, Sora",
      "Shared team workspaces",
      "SSO + role-based access",
      "Admin analytics & audit logs",
      "Dedicated account manager",
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

              <div
                className={cn(
                  "mt-3 inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11.5px] font-medium",
                  t.highlight ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700",
                )}
              >
                {t.credits.toLocaleString()} Credits / Monthly
              </div>

              <Button
                onClick={() => toast(`Selected: ${t.name}`)}
                className={cn(
                  "mt-6 h-11 w-full rounded-md text-[13.5px] font-semibold",
                  t.highlight
                    ? "bg-neutral-900 text-white hover:bg-neutral-800"
                    : t.id === "free"
                      ? "bg-white text-neutral-900 border border-neutral-300 hover:bg-neutral-50"
                      : "bg-neutral-900 text-white hover:bg-neutral-800",
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

const ROWS: { group: string; rows: { label: string; free: string | boolean; standard: string | boolean; whale: string | boolean }[] }[] = [
  {
    group: "Credits & Plan",
    rows: [
      { label: "Monthly credits", free: "100", standard: "10,000", whale: "55,000" },
      { label: "Credits roll over", free: false, standard: false, whale: true },
    ],
  },
  {
    group: "Basic Models",
    rows: [
      { label: "GPT-4o mini", free: true, standard: true, whale: true },
      { label: "Claude 3.5 Haiku", free: true, standard: true, whale: true },
      { label: "DeepSeek V3 & R1", free: true, standard: true, whale: true },
    ],
  },
  {
    group: "Advanced Models",
    rows: [
      { label: "o3 & o4-mini", free: false, standard: true, whale: true },
      { label: "Claude 3.7 Sonnet", free: false, standard: true, whale: true },
      { label: "Gemini 2.5 Pro", free: false, standard: true, whale: true },
    ],
  },
  {
    group: "Image & Video Models",
    rows: [
      { label: "DALL·E 3", free: false, standard: true, whale: true },
      { label: "Imagen 4 / Flux 1.1", free: false, standard: true, whale: true },
      { label: "Veo 3 / Sora (video)", free: false, standard: false, whale: true },
      { label: "4K image exports + 1080p video", free: false, standard: true, whale: true },
      { label: "Commercial license", free: false, standard: true, whale: true },
    ],
  },
  {
    group: "Documents",
    rows: [
      { label: "Monthly PDF uploads", free: "5", standard: "Unlimited", whale: "Unlimited" },
      { label: "Max file size", free: "20MB", standard: "100MB+", whale: "100MB+" },
      { label: "Citations with page numbers", free: true, standard: true, whale: true },
    ],
  },
  {
    group: "Team & Security",
    rows: [
      { label: "Shared workspaces", free: false, standard: false, whale: true },
      { label: "SSO & role-based access", free: false, standard: false, whale: true },
      { label: "Audit logs", free: false, standard: false, whale: true },
      { label: "Dedicated account manager", free: false, standard: false, whale: true },
      { label: "99.9% uptime SLA", free: false, standard: false, whale: true },
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
            {["Free", "Standard", "Whale"].map((n) => (
              <div
                key={n}
                className={cn(
                  "px-5 py-4 text-center text-[13px] font-bold",
                  n === "Standard" ? "bg-neutral-900 text-white" : "text-neutral-900",
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
                  <Cell value={r.standard} highlight />
                  <Cell value={r.whale} />
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
    {
      q: "How do credits work?",
      a: "Each request consumes credits depending on the model used. Basic models cost the least; advanced and image/video models cost more. Your monthly credits reset on your billing date.",
    },
    {
      q: "Can I switch plans at any time?",
      a: "Yes. Upgrades take effect immediately, and downgrades apply at the end of your current billing cycle.",
    },
    {
      q: "Do unused credits roll over?",
      a: "Free and Standard credits reset monthly. Whale-tier credits roll over for one additional month.",
    },
    {
      q: "Is there a refund policy?",
      a: "We offer a 7-day money-back guarantee on all paid plans. Just email support@nexva.ai.",
    },
    {
      q: "Do you offer discounts for students or non-profits?",
      a: "Yes — 50% off Standard for verified students and registered non-profits. Contact us to apply.",
    },
  ];
  return (
    <section className="border-b border-neutral-200 bg-white py-24">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle={null}
          icon={<HelpCircle className="h-4 w-4" strokeWidth={1.75} />}
        />
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
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-[14.5px] font-semibold text-neutral-900">{q}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-neutral-500 transition-transform duration-200",
            open && "rotate-180",
          )}
          strokeWidth={2}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-[13.5px] leading-relaxed text-neutral-600">{a}</div>
      )}
    </div>
  );
}

// silence unused-import lint for X (kept for future close buttons)
void X;
