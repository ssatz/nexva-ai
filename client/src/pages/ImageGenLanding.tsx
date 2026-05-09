/*
  ImageGenLanding — public marketing page at /imagegen.
  Strict B&W theme matching /chatpdf.
*/

import { useState } from "react";
import { Link } from "wouter";
import { MarketingNav, MarketingFooter, SectionHeading } from "@/components/MarketingShell";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Layers,
  Palette,
  Camera,
  Brush,
  Megaphone,
  Briefcase,
  GraduationCap,
  ChevronDown,
  ArrowRight,
  HelpCircle,
  Zap,
  Lock,
  Repeat,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ImageGenLanding() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <MarketingNav active="imagegen" />
      <Hero />
      <StyleGallery />
      <HowItWorks />
      <UseCases />
      <Models />
      <Faq />
      <MarketingFooter />
    </div>
  );
}

/* ─────────────── Hero ─────────────── */

function Hero() {
  const [prompt, setPrompt] = useState("");
  const submit = () => {
    if (!prompt.trim()) {
      toast("Add a prompt", { description: "Describe what you'd like to see" });
      return;
    }
    toast("Generating", { description: prompt });
  };

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
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h1 className="text-[44px] font-bold leading-[1.08] tracking-tight md:text-[58px]">
          <span className="block text-neutral-900">Imagine It. Type It.</span>
          <span className="block italic text-neutral-400">See It in Seconds.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[15.5px] leading-relaxed text-neutral-600">
          One prompt, every model. Generate hyper-realistic photos, painterly art, product mockups, and brand
          assets with Nano Banana Pro, Imagen 4, Flux 1.1, and DALL·E 3 — all in one workspace.
        </p>

        {/* Prompt bar */}
        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-neutral-300 bg-white p-2.5 shadow-[0_12px_30px_-15px_rgba(0,0,0,0.18)]">
          <div className="flex items-center gap-2">
            <Wand2 className="ml-2 h-4 w-4 text-neutral-500" strokeWidth={1.75} />
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="A serene mountain at golden hour, cinematic, 35mm film…"
              className="flex-1 bg-transparent py-2 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
            />
            <Button onClick={submit} className="h-9 rounded-full bg-neutral-900 px-5 text-[13px] font-semibold text-white hover:bg-neutral-800">
              Generate
              <ArrowRight className="ml-1 h-3.5 w-3.5" strokeWidth={2} />
            </Button>
          </div>
        </div>

        {/* Quick prompt chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[12.5px]">
          <span className="text-neutral-500">Try:</span>
          {[
            "Minimalist logo for a coffee brand",
            "Cyberpunk Tokyo street, neon rain",
            "Linen tablecloth flat lay, soft shadows",
            "Pixar-style fox in a library",
          ].map((p) => (
            <button
              key={p}
              onClick={() => setPrompt(p)}
              className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-neutral-700 transition-all hover:-translate-y-px hover:border-neutral-900"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Style Gallery ─────────────── */

function StyleGallery() {
  const styles = [
    { name: "Photorealistic", grad: "from-neutral-200 via-neutral-300 to-neutral-100" },
    { name: "Cinematic", grad: "from-neutral-800 via-neutral-700 to-neutral-900" },
    { name: "Watercolor", grad: "from-neutral-100 via-white to-neutral-200" },
    { name: "3D Render", grad: "from-neutral-300 via-neutral-100 to-neutral-200" },
    { name: "Editorial", grad: "from-neutral-900 via-neutral-700 to-neutral-800" },
    { name: "Sketch", grad: "from-white via-neutral-100 to-neutral-200" },
    { name: "Anime", grad: "from-neutral-200 via-neutral-300 to-neutral-100" },
    { name: "Brand Mockup", grad: "from-neutral-100 via-neutral-200 to-white" },
  ];
  return (
    <section className="border-b border-neutral-200 bg-neutral-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          title="Every Style, One Workspace"
          subtitle="Switch between photographic realism, painterly art, and brand-ready mockups in a single click."
        />
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {styles.map((s) => (
            <div
              key={s.name}
              className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white"
            >
              <div className={cn("aspect-[4/5] w-full bg-gradient-to-br", s.grad)} />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-3">
                <div className="text-[12.5px] font-semibold text-white">{s.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── How It Works ─────────────── */

function HowItWorks() {
  const steps = [
    { n: 1, icon: Wand2, title: "Describe Your Vision", body: "Type a prompt — or paste a reference image. Add aspect ratio, style, and lighting hints in plain English." },
    { n: 2, icon: Layers, title: "Pick a Model", body: "Compare Nano Banana Pro, Imagen 4, Flux 1.1, and DALL·E 3 side-by-side. Or auto-route by intent." },
    { n: 3, icon: Sparkles, title: "Refine & Export", body: "Inpaint, upscale 4K, or remix with one click. Export as PNG, JPEG, WebP, or transparent assets." },
  ];
  return (
    <section className="border-b border-neutral-200 bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading title="From Prompt to Pixel in Three Steps" subtitle={null} />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <article
              key={s.n}
              className="group rounded-2xl border border-neutral-200 bg-white p-7 transition-all hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.18)]"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-[12px] font-semibold text-white">
                  {s.n}
                </span>
                <s.icon className="h-4 w-4 text-neutral-700" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-[18.5px] font-bold tracking-tight">{s.title}</h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-neutral-600">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Use Cases ─────────────── */

function UseCases() {
  const cards = [
    { icon: Megaphone, title: "Marketing & Social", body: "Generate ad creatives, social posts, and campaign visuals on-brand in minutes — no agency required." },
    { icon: Briefcase, title: "Product & E-commerce", body: "Spin up product mockups, lifestyle scenes, and packaging concepts before a single render call." },
    { icon: Brush, title: "Designers & Illustrators", body: "Use AI as a moodboard engine. Iterate styles, palettes, and compositions at the speed of thought." },
    { icon: Camera, title: "Photography & Editorial", body: "Storyboard shoots, build location references, or extend backgrounds with photoreal precision." },
    { icon: GraduationCap, title: "Education & Training", body: "Create custom diagrams, scene illustrations, and visual aids for lessons and presentations." },
    { icon: Palette, title: "Brand & Identity", body: "Explore logos, color systems, and brand worlds from one description — then refine with control." },
  ];
  return (
    <section className="border-b border-neutral-200 bg-neutral-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading title="Built for Every Creative Workflow" subtitle={null} />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <article
              key={c.title}
              className="rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.18)]"
            >
              <div className="flex items-center gap-2">
                <c.icon className="h-4 w-4 text-neutral-700" strokeWidth={1.75} />
                <h3 className="text-[14.5px] font-semibold">{c.title}</h3>
              </div>
              <p className="mt-2.5 text-[13px] leading-relaxed text-neutral-600">{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Models ─────────────── */

function Models() {
  const models = [
    { name: "Nano Banana Pro", tag: "NEW", body: "Our default. Razor-sharp text rendering, accurate hands, and brand-safe outputs." },
    { name: "Imagen 4", tag: "Pro", body: "Best for photoreal cinematography and complex scene composition." },
    { name: "Flux 1.1", tag: "", body: "Speed-optimized, ideal for rapid iteration and concept exploration." },
    { name: "DALL·E 3", tag: "", body: "Strong typography handling and reliable adherence to long prompts." },
  ];
  return (
    <section className="border-b border-neutral-200 bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          title="Four Models. One Subscription."
          subtitle="Stop juggling tabs. Switch between flagship models without leaving your workspace."
          icon={<ImageIcon className="h-4 w-4" strokeWidth={1.75} />}
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {models.map((m) => (
            <article
              key={m.name}
              className="rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.18)]"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold">{m.name}</h3>
                {m.tag && (
                  <span className="rounded-full border border-neutral-300 bg-neutral-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-700">
                    {m.tag}
                  </span>
                )}
              </div>
              <p className="mt-2.5 text-[13px] leading-relaxed text-neutral-600">{m.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { icon: Zap, title: "Fast by default", body: "First image in under 4s on standard tier." },
            { icon: Repeat, title: "Unlimited remixes", body: "Iterate without burning credits on every tweak." },
            { icon: Lock, title: "Private by design", body: "Outputs never train public models. Period." },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-5">
              <f.icon className="mt-0.5 h-4 w-4 text-neutral-700" strokeWidth={1.75} />
              <div>
                <div className="text-[13.5px] font-semibold">{f.title}</div>
                <div className="text-[12.5px] text-neutral-600">{f.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── FAQ ─────────────── */

function Faq() {
  const items = [
    { q: "Which model should I choose?", a: "Start with Nano Banana Pro — it's our default for general use. For cinematic photography, switch to Imagen 4. For rapid drafts, use Flux 1.1." },
    { q: "Can I upload a reference image?", a: "Yes. Drop any image into the composer to use it as a style or composition reference. Supported on all four models." },
    { q: "What resolutions can I export?", a: "Up to 4K (4096×4096) on Pro. Free tier exports at 1024×1024 with optional 2× upscale." },
    { q: "Are my generated images private?", a: "Yes. Outputs are stored privately to your workspace and are never used to train public models." },
    { q: "Can I use the images commercially?", a: "Yes — every image generated on a paid plan includes a commercial use license." },
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
        <div className="mt-12 text-center">
          <Link href="/pricing">
            <a className="inline-flex h-11 items-center rounded-full bg-neutral-900 px-6 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90">
              See Pricing
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" strokeWidth={2} />
            </a>
          </Link>
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
