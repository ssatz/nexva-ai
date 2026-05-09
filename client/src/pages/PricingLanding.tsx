/*
  PricingLanding — public marketing page at /pricing.
  5-tier credit-based pricing (Free / Starter / Standard / Pro / Whale).
  Strict B&W theme (no blue), Lucide icons throughout.
*/

import { useState } from "react";
import { MarketingNav, MarketingFooter, SectionHeading } from "@/components/MarketingShell";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  HelpCircle,
  Sparkles,
  Zap,
  Crown,
  Fish,
  Minus,
  Bot,
  Brain,
  Atom,
  Cpu,
  ImageIcon,
  Film,
  Wand2,
  CircleDot,
} from "lucide-react";
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
      <Faq />
      <MarketingFooter />
    </div>
  );
}

/* ─────────────── Hero ─────────────── */

function Hero({ billing, setBilling }: { billing: Billing; setBilling: (b: Billing) => void }) {
  return (
    <section
      className="relative overflow-hidden border-b border-neutral-200 bg-white pt-20 pb-10"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h1 className="text-[44px] font-bold leading-[1.08] tracking-tight md:text-[56px]">
          <span className="block text-neutral-900">Plans &amp; Credits</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-[15.5px] leading-relaxed text-neutral-600">
          Choose the perfect plan for your study needs. Upgrade anytime as you scale.
        </p>

        {/* Billing toggle */}
        <div className="mx-auto mt-8 inline-flex items-center gap-3 rounded-full border border-neutral-300 bg-white px-2 py-1 text-[13px]">
          <BillingButton active={billing === "monthly"} onClick={() => setBilling("monthly")}>
            Monthly
          </BillingButton>
          <BillingButton active={billing === "yearly"} onClick={() => setBilling("yearly")}>
            Yearly
            <span
              className={cn(
                "ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                billing === "yearly" ? "bg-white text-neutral-900" : "bg-neutral-900 text-white",
              )}
            >
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

/* ─────────────── Tier data ─────────────── */

const BASIC_MODELS = [
  { icon: Bot, label: "GPT-4o mini" },
  { icon: Sparkles, label: "Claude 3.5 Haiku" },
  { icon: Atom, label: "DeepSeek V3 & R1" },
];

const ADVANCED_MODELS = [
  { icon: Brain, label: "o3 & o4-mini" },
  { icon: Sparkles, label: "Claude 3.7 Sonnet" },
  { icon: Cpu, label: "Gemini 2.5 Pro" },
];

const IMAGE_VIDEO_MODELS = [
  { icon: ImageIcon, label: "DALL·E 3" },
  { icon: Wand2, label: "Imagen 4 / Flux 1.1" },
  { icon: Film, label: "Veo 3 / Sora" },
];

type Tier = {
  id: string;
  icon: typeof Sparkles;
  name: string;
  monthly: number;
  yearly: number;
  monthlyCredits: number;
  cta: string;
  current?: boolean;
  highlight?: boolean;
  groups: { title: string; items: typeof BASIC_MODELS | { icon: typeof Sparkles; label: string }[] }[];
};

const TIERS: Tier[] = [
  {
    id: "free",
    icon: CircleDot,
    name: "Free",
    monthly: 0,
    yearly: 0,
    monthlyCredits: 100,
    cta: "Current Plan",
    current: true,
    groups: [
      { title: "Basic models", items: BASIC_MODELS },
      { title: "Advanced models", items: [] as { icon: typeof Sparkles; label: string }[] },
      { title: "Image / Video models", items: [] as { icon: typeof Sparkles; label: string }[] },
    ],
  },
  {
    id: "starter",
    icon: Zap,
    name: "Starter",
    monthly: 5,
    yearly: 4,
    monthlyCredits: 2200,
    cta: "Subscribe Now",
    groups: [
      { title: "Basic models", items: BASIC_MODELS },
      { title: "Advanced models", items: ADVANCED_MODELS.slice(0, 2) },
      { title: "Image / Video models", items: IMAGE_VIDEO_MODELS.slice(0, 1) },
    ],
  },
  {
    id: "standard",
    icon: Sparkles,
    name: "Standard",
    monthly: 20,
    yearly: 16,
    monthlyCredits: 10_000,
    cta: "Subscribe Now",
    highlight: true,
    groups: [
      { title: "Basic models", items: BASIC_MODELS },
      { title: "Advanced models", items: ADVANCED_MODELS },
      { title: "Image / Video models", items: IMAGE_VIDEO_MODELS.slice(0, 2) },
    ],
  },
  {
    id: "pro",
    icon: Crown,
    name: "Pro",
    monthly: 50,
    yearly: 40,
    monthlyCredits: 26_000,
    cta: "Subscribe Now",
    groups: [
      { title: "Basic models", items: BASIC_MODELS },
      { title: "Advanced models", items: ADVANCED_MODELS },
      { title: "Image / Video models", items: IMAGE_VIDEO_MODELS },
    ],
  },
  {
    id: "whale",
    icon: Fish,
    name: "Whale",
    monthly: 100,
    yearly: 80,
    monthlyCredits: 55_000,
    cta: "Subscribe Now",
    groups: [
      { title: "Basic models", items: BASIC_MODELS },
      { title: "Advanced models", items: ADVANCED_MODELS },
      { title: "Image / Video models", items: IMAGE_VIDEO_MODELS },
    ],
  },
];

/* ─────────────── Tier cards ─────────────── */

function Tiers({ billing }: { billing: Billing }) {
  return (
    <section className="bg-neutral-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5">
          {TIERS.map((t) => (
            <TierCard key={t.id} tier={t} billing={billing} />
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-[12.5px] text-neutral-500">
          All plans include conversation history, citations with page numbers, and standard support.
          Yearly billing applies a 20% discount on the monthly rate.
        </p>
      </div>
    </section>
  );
}

function TierCard({ tier, billing }: { tier: Tier; billing: Billing }) {
  const price = billing === "monthly" ? tier.monthly : tier.yearly;
  const Icon = tier.icon;
  return (
    <article
      className={cn(
        "relative flex flex-col rounded-2xl border bg-white p-6 transition-all",
        tier.highlight
          ? "border-neutral-900 shadow-[0_24px_60px_-25px_rgba(0,0,0,0.45)] lg:-translate-y-3"
          : "border-neutral-200 hover:border-neutral-400",
      )}
    >
      {tier.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-neutral-900 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-wide text-white">
          Most Popular
        </div>
      )}

      {/* Tier name */}
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-neutral-700" strokeWidth={1.75} />
        <span className="text-[13px] font-semibold uppercase tracking-wide text-neutral-700">
          {tier.name}
        </span>
      </div>

      {/* Price */}
      <div className="mt-5">
        {price === 0 ? (
          <div className="text-[34px] font-bold leading-none tracking-tight">Free</div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-[34px] font-bold leading-none tracking-tight">${price}</span>
            <span className="text-[13.5px] text-neutral-500">/monthly</span>
          </div>
        )}
      </div>

      {/* Credits */}
      <div
        className={cn(
          "mt-3 inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11.5px] font-medium",
          tier.highlight
            ? "bg-neutral-900 text-white"
            : "bg-neutral-100 text-neutral-700",
        )}
      >
        {tier.monthlyCredits.toLocaleString()} Credits / Monthly
      </div>

      {/* CTA */}
      <Button
        onClick={() => !tier.current && toast(`Selected: ${tier.name}`)}
        disabled={tier.current}
        className={cn(
          "mt-5 h-10 w-full rounded-md text-[13px] font-semibold disabled:opacity-100",
          tier.current
            ? "bg-white text-neutral-900 border border-neutral-300 hover:bg-white cursor-default"
            : tier.highlight
              ? "bg-neutral-900 text-white hover:bg-neutral-800"
              : "bg-neutral-900 text-white hover:bg-neutral-800",
        )}
      >
        {tier.cta}
      </Button>

      {/* Groups */}
      <div className="mt-6 space-y-5">
        {tier.groups.map((g) => (
          <div key={g.title}>
            <div className="text-[12.5px] font-semibold text-neutral-900">{g.title}:</div>
            <ul className="mt-2 space-y-2">
              {g.items.length === 0 && (
                <li className="flex items-center gap-2 text-[12.5px] text-neutral-300">
                  <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                  <span>Not included</span>
                </li>
              )}
              {g.items.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2 text-[12.5px] text-neutral-700"
                >
                  <item.icon className="h-3.5 w-3.5 text-neutral-700" strokeWidth={1.75} />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
}

/* ─────────────── FAQ ─────────────── */

function Faq() {
  const items = [
    {
      q: "How do credits work?",
      a: "Each request consumes credits depending on the model used. Basic models are cheap; advanced and image/video models cost more. Your monthly credits reset on your billing date.",
    },
    {
      q: "Can I switch plans at any time?",
      a: "Yes. Upgrades take effect immediately; downgrades apply at the end of your current billing cycle. Unused credits do not transfer between plans.",
    },
    {
      q: "Do unused credits roll over?",
      a: "Free-tier credits reset monthly. On paid plans, unused credits expire at the end of the billing cycle.",
    },
    {
      q: "Is there a refund policy?",
      a: "We offer a 7-day money-back guarantee on all paid plans. Email support@nexva.ai with your account details.",
    },
    {
      q: "Do you offer discounts for students or non-profits?",
      a: "Yes — 50% off on Standard and Pro for verified students and registered non-profits. Reach out to apply.",
    },
  ];
  return (
    <section className="border-t border-neutral-200 bg-white py-20">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle={null}
          icon={<HelpCircle className="h-4 w-4" strokeWidth={1.75} />}
        />
        <div className="mt-10 space-y-3">
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
