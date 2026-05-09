/*
  ChatPdfLanding — public marketing page at /chatpdf.
  Adapted from the supplied PDF reference. All blue accents converted to
  black/grey to match Nexva's strict B&W theme. Single page, fully
  responsive, no images required.
*/

import { useRef, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  ArrowRight,
  ChevronDown,
  MessageSquare,
  Bot,
  ShieldCheck,
  Scale,
  Briefcase,
  GraduationCap,
  Users,
  HeartHandshake,
  HelpCircle,
  Mail,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV_LINKS = [
  { label: "Chat", href: "/" },
  { label: "Chat With PDF", href: "/chatpdf", active: true },
  { label: "Image Generation", href: "/" },
  { label: "Video Generation", href: "/" },
  { label: "AI Homework", href: "/" },
  { label: "Deep Research", href: "/" },
  { label: "Pricing", href: "/" },
];

export default function ChatPdfLanding() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <TopNav />
      <Hero />
      <HowItWorks />
      <FeatureToBenefit />
      <SafeSecured />
      <WhoLoves />
      <Faq />
      <Footer />
    </div>
  );
}

/* ─────────────────────────  Top Nav  ───────────────────────── */

function TopNav() {
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
                  link.active
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

/* ─────────────────────────  Hero  ───────────────────────── */

function Hero() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    toast("Uploaded", { description: `${files[0].name} ready for chat` });
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
      {/* faint top fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h1 className="text-[44px] font-bold leading-[1.08] tracking-tight md:text-[58px]">
          <span className="block text-neutral-900">Chat with Your PDFs &</span>
          <span className="block text-neutral-400 italic">Get Answers Instantly</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[15.5px] leading-relaxed text-neutral-600">
          Stop wasting hours reading long documents. Our AI-powered chat PDF tool lets you upload any
          document from 10 to 100+ pages and ask natural questions to get instant, accurate answers.
        </p>

        {/* Upload zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "mx-auto mt-12 max-w-2xl rounded-2xl border-2 border-dashed bg-white px-8 py-12 transition-colors",
            dragOver ? "border-neutral-900 bg-neutral-50" : "border-neutral-300",
          )}
        >
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50">
            <Upload className="h-5 w-5 text-neutral-700" strokeWidth={1.75} />
          </div>
          <Button
            onClick={() => inputRef.current?.click()}
            className="mx-auto h-11 rounded-full bg-neutral-900 px-7 text-[14px] font-semibold text-white hover:bg-neutral-800"
          >
            Browse File
          </Button>
          <input
            ref={inputRef}
            type="file"
            hidden
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <p className="mt-5 text-[13px] text-neutral-600">Drag & Drop, or Choose PDF, Doc, PPT to upload</p>
          <p className="mt-1 text-[12px] text-neutral-400">PDF, Doc, PPT Files Supported.</p>
        </div>

        {/* Sample files */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-[13px]">
          <span className="text-neutral-500">Try sample files:</span>
          {[
            "Annual_Report_2024.pdf",
            "Deep_Learning_Research.pdf",
          ].map((name) => (
            <button
              key={name}
              onClick={() => toast("Loaded sample", { description: name })}
              className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-neutral-700 shadow-sm transition-all hover:-translate-y-px hover:border-neutral-900 hover:shadow-md"
            >
              <FileText className="h-3.5 w-3.5 text-neutral-500" strokeWidth={1.75} />
              {name}
              <ArrowRight className="h-3 w-3 text-neutral-400 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  How It Works  ───────────────────────── */

function HowItWorks() {
  const steps = [
    {
      n: 1,
      title: "Upload Your PDF",
      body: "Pick any PDF file from your computer. No file size limits, no waiting. Whether it's a contract, research paper, or quarterly report, upload and go.",
    },
    {
      n: 2,
      title: "Ask Your Questions",
      body: 'Chat naturally with your document. Ask "What are the key findings?" or "Extract all liability clauses." The AI understands context and finds answers fast.',
    },
    {
      n: 3,
      title: "Get Instant Insights",
      body: "Get summaries, extracted data, citations with page numbers, and searchable chat history—all in seconds.",
    },
  ];

  return (
    <section className="border-b border-neutral-200 bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow={null}
          title="How It Works"
          subtitle="Three Simple Steps to Document Intelligence"
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <article
              key={s.n}
              className="group relative rounded-2xl border border-neutral-200 bg-white p-7 transition-all hover:-translate-y-0.5 hover:border-neutral-900 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.18)]"
            >
              <span className="inline-flex items-center rounded-full bg-neutral-900 px-3 py-1 text-[11.5px] font-semibold uppercase tracking-wide text-white">
                Step {s.n}
              </span>
              <h3 className="mt-5 text-[18.5px] font-bold tracking-tight">{s.title}</h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-neutral-600">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  Feature-to-Benefit  ───────────────────────── */

function FeatureToBenefit() {
  return (
    <section className="border-b border-neutral-200 bg-neutral-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading title="Feature-to-Benefit" subtitle="Powerful Features Built for Your Workflow." />

        <div className="mt-14 grid gap-7 md:grid-cols-2">
          <BenefitCard
            tag="No More File Limits"
            title="Upload & Analyze 100+ Page PDFs Instantly"
            body="Unlike ChatGPT and other standard tools that struggle with large files, our AI chat PDF handles massive documents without breaking a sweat. Stop fighting file too large errors. Upload legal contracts, research papers, or thick reports and get answers in seconds. You're in control chat with documents as big as you need."
            visual={<MockSummaryCard />}
          />
          <BenefitCard
            tag="Turn Chat History into Searchable Insights"
            title="Never Lose a Decision or Discussion Again"
            body="Export your team's Microsoft Teams chat, WhatsApp conversations, or email threads as PDF. Upload it here and ask the AI to summarize decisions, list action items, or find what was said about a specific topic. Perfect for project managers who need to track conversations without endless scrolling. Your knowledge stays organized and searchable."
            visual={<MockChatCard />}
          />
          <BenefitCard
            tag="AI-Powered Summaries for Long Documents"
            title="From 50 Pages to 5 Bullet Points"
            body="Dense academic papers, lengthy contracts, or thick business reports don't need to take hours to understand. Ask our AI to summarize any section, extract key arguments, or highlight the most important points. Students, researchers, and professionals save days of reading time every week. Get the insights you need without reading every word."
            visual={<MockTranslateCard />}
          />
          <BenefitCard
            tag="Enterprise-Grade Privacy & Security"
            title="Your Data Stays Private, Always"
            body="We know sensitive documents matter. All your PDFs are encrypted, and your data never trains our public models by default. Legal professionals, HR teams, and businesses handle confidential client files with confidence. Local Privacy Mode keeps everything on your device. Trust matters and we've built it in from day one."
            visual={<MockPrivateCard />}
          />
        </div>
      </div>
    </section>
  );
}

function BenefitCard({
  tag,
  title,
  body,
  visual,
}: {
  tag: string;
  title: string;
  body: string;
  visual: React.ReactNode;
}) {
  return (
    <article className="group rounded-2xl border border-neutral-200 bg-white p-7 transition-all hover:border-neutral-900 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.18)]">
      <div className="mb-6 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
        <div className="aspect-[16/9] flex items-center justify-center p-6">{visual}</div>
      </div>
      <span className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-3 py-1 text-[11.5px] font-medium text-neutral-700">
        {tag}
      </span>
      <h3 className="mt-3 text-[20px] font-bold tracking-tight">{title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">{body}</p>
    </article>
  );
}

/* Decorative mock visuals (no external assets) */

function MockSummaryCard() {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <div className="flex-1 space-y-1.5">
        <div className="h-2 w-3/4 rounded bg-neutral-200" />
        <div className="h-2 w-2/3 rounded bg-neutral-200" />
        <div className="h-2 w-4/5 rounded bg-neutral-200" />
        <div className="h-2 w-1/2 rounded bg-neutral-200" />
        <div className="h-2 w-3/5 rounded bg-neutral-200" />
      </div>
      <div className="w-44 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
        <div className="text-[10.5px] font-semibold uppercase tracking-wide text-neutral-500">Summary:</div>
        <div className="mt-1 text-[12px] text-neutral-800">The document outlines...</div>
      </div>
    </div>
  );
}

function MockChatCard() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex justify-end">
        <div className="rounded-2xl bg-neutral-900 px-3 py-1.5 text-[11.5px] font-medium text-white">
          What are the main findings?
        </div>
      </div>
      <div className="flex justify-start">
        <div className="rounded-2xl bg-neutral-100 px-3 py-1.5 text-[11.5px] text-neutral-700">
          Based on page 3...
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 shadow-sm">
        <span className="flex-1 text-[11.5px] text-neutral-400">Ask anything...</span>
        <ArrowRight className="h-3 w-3 text-neutral-500" strokeWidth={2} />
      </div>
    </div>
  );
}

function MockTranslateCard() {
  return (
    <div className="w-full max-w-sm space-y-2.5">
      <div className="flex gap-2">
        <div className="flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-[11px] text-neutral-700 shadow-sm">
          <Sparkles className="h-3 w-3" strokeWidth={1.75} /> GPT-4o
        </div>
        <div className="flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-[11px] text-neutral-700 shadow-sm">
          <Bot className="h-3 w-3" strokeWidth={1.75} /> Claude 3.5
        </div>
      </div>
      <button className="w-full rounded-md bg-neutral-900 py-2 text-[12px] font-semibold text-white">
        Translate to Spanish
      </button>
    </div>
  );
}

function MockPrivateCard() {
  return (
    <div className="flex h-full w-full max-w-xs items-center justify-center rounded-lg border border-neutral-200 bg-white">
      <div className="relative">
        <FileText className="h-14 w-14 text-neutral-300" strokeWidth={1.25} />
        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-200 bg-white text-[10px] font-bold text-neutral-700 shadow-sm">
          T
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────  Safe & Secured  ───────────────────────── */

function SafeSecured() {
  const items = [
    { icon: MessageSquare, body: "Fluent document interaction with Nexva ChatPDF feature. Replies with high-quality answers." },
    { icon: Bot, body: "Wise AI assistance reads the entire PDF file and summarizes key points in a minute." },
    { icon: ShieldCheck, body: "Secured and updated privacy protection algorithms guard your private information." },
  ];
  return (
    <section className="border-b border-neutral-200 bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading title="Safe, Reliable, and Privacy-Secured" subtitle={null} />
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {items.map((it, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50">
                <it.icon className="h-5 w-5 text-neutral-700" strokeWidth={1.75} />
              </div>
              <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-neutral-600">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  Who Loves  ───────────────────────── */

function WhoLoves() {
  const cards = [
    { icon: Scale, title: "For Legal Professionals", body: "Stop manually scanning hundreds of pages. Upload NDAs, contracts, or case files and instantly get structured answers." },
    { icon: MessageSquare, title: "For Project Managers & Teams", body: "Don't lose critical decisions made in conversations. Export your Microsoft Teams, Slack, or WhatsApp history to PDF and upload it here." },
    { icon: GraduationCap, title: "For Researchers & Students", body: "Turn dense academic papers into clear insights instead of reading 50+ pages." },
    { icon: FileText, title: "For HR & Recruiters", body: "Screening hundreds of resumes takes forever. Upload a batch of CVs and extract key qualifications instantly." },
    { icon: Briefcase, title: "For Business & Finance Teams", body: "Pull critical data from quarterly reports, financial statements, and presentations without manual data entry." },
    { icon: HeartHandshake, title: "For Customer Service & Support Teams", body: "Handle complex customer inquiries by uploading policy documents, FAQs, and service agreements." },
  ];
  return (
    <section className="border-b border-neutral-200 bg-neutral-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          title="Who Loves Nexva AI Assistant?"
          subtitle={null}
          icon={<Users className="h-4 w-4" strokeWidth={1.75} />}
        />
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

/* ─────────────────────────  FAQ  ───────────────────────── */

function Faq() {
  const items = [
    {
      q: "Is Nexva's Chat PDF tool free to use?",
      a: "Yes, the basic plan lets you chat with up to 5 PDFs per month for free. Upgrade to Pro for unlimited usage.",
    },
    {
      q: "What is the maximum PDF size I can upload?",
      a: "Up to 100MB per file on Free, and unlimited on Pro. Documents over 100+ pages are fully supported.",
    },
    {
      q: "Can the AI summarize legal contracts or research papers?",
      a: "Yes. Our model is tuned for long-context reasoning and excels at extracting clauses, citations, and findings.",
    },
    {
      q: "How secure is my data?",
      a: "All uploads are encrypted in transit and at rest. We never train our public models on your documents.",
    },
    {
      q: "Where is my data stored?",
      a: "On encrypted infrastructure in your selected region. Local Privacy Mode keeps everything on your device.",
    },
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
      {open && <div className="px-5 pb-4 text-[13.5px] leading-relaxed text-neutral-600">{a}</div>}
    </div>
  );
}

/* ─────────────────────────  Section Heading  ───────────────────────── */

function SectionHeading({
  title,
  subtitle,
  icon,
  eyebrow,
}: {
  title: string;
  subtitle: string | null;
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

/* ─────────────────────────  Footer  ───────────────────────── */

function Footer() {
  const cols = [
    { title: "Chat Tools", links: ["Chat with PDF", "AI Chat"] },
    { title: "AI Tools", links: ["Image Generation", "Video Generation"] },
    { title: "AI Homework", links: ["AI Homework Helper", "AI Math Solver"] },
    { title: "Company", links: ["Pricing", "Contact Us"] },
    { title: "Legal", links: ["Terms of Service", "Privacy Policy", "Security", "EULA", "Content Policy"] },
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
                  <li key={link}>
                    <a className="text-[12.5px] text-neutral-400 hover:text-white">{link}</a>
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
