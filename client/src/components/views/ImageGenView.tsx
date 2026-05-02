/*
  ImageGenView — "Image & Video (Beta)" workspace.
  Combines the Featured Templates / Discover gallery (ref 1) with the
  Explore / History tabs and floating composer (ref 2). Strict B&W chrome;
  artwork keeps its native colour. Composer floats above the gallery and
  pressing Send pushes a new generation card into History.

  Style cues:
   - Header: title + small Beta tag + underlined Explore/History tabs.
   - Search row with "+ Image" / "+ Video" pill chips.
   - Featured Templates: horizontal-scroll row with bottom-left labels.
   - Discover: 1/2/3/4-col responsive grid with optional video play badge.
   - Floating composer: preset chips, Image/Video toggle, conditional
     reference-uploads row (Video only), placeholder swap, full toolbar.
*/

import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Image as ImageIcon,
  Video as VideoIcon,
  Sliders,
  Monitor,
  Clock,
  VolumeX,
  Layers,
  Wand2,
  Zap,
  ArrowUp,
  Play,
  Sparkles,
  X,
  Film,
  Mic,
  PictureInPicture2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageGenViewProps {
  onSubmitPrompt?: (value: string) => void;
}

interface Template {
  src: string;
  label: string;
}

interface DiscoverItem {
  src: string;
  isVideo?: boolean;
  span?: "tall" | "wide";
}

interface Generation {
  id: string;
  prompt: string;
  mode: "image" | "video";
  aspect: string;
  ts: number;
}

const TEMPLATES: Template[] = [
  { src: "/manus-storage/tpl-scribbli_77eebff0.jpg",   label: "Scribbli" },
  { src: "/manus-storage/tpl-chibi_ea58e0db.jpg",      label: "Chibi" },
  { src: "/manus-storage/tpl-headshot_54469ede.jpg",   label: "Professional Headshot" },
  { src: "/manus-storage/tpl-crayonify_52563421.jpg",  label: "Crayonify" },
  { src: "/manus-storage/tpl-watercolor_81b3db19.jpg", label: "Watercolor Portrait" },
  { src: "/manus-storage/tpl-70s_0b5515f2.jpg",        label: "70s Street Style" },
];

const DISCOVER: DiscoverItem[] = [
  { src: "/manus-storage/disc-1_e16411ee.jpg", span: "tall" },
  { src: "/manus-storage/disc-2_a9e52afb.jpg", isVideo: true },
  { src: "/manus-storage/disc-3_1f2bfacb.jpg", span: "tall" },
  { src: "/manus-storage/disc-4_6cb9ac41.jpg" },
  { src: "/manus-storage/disc-5_abf8f90e.jpg" },
  { src: "/manus-storage/disc-6_1a93e46a.jpg", span: "tall", isVideo: true },
  { src: "/manus-storage/disc-7_b8481df9.jpg" },
  { src: "/manus-storage/disc-8_7e30a188.jpg" },
];

const PRESET_CHIPS = ["Surreal Landscape", "Cozy Interior", "Abstract Geometric"];

export function ImageGenView({ onSubmitPrompt }: ImageGenViewProps = {}) {
  const [tab, setTab] = useState<"explore" | "history">("explore");
  const [mode, setMode] = useState<"image" | "video">("image");
  const [prompt, setPrompt] = useState("");
  const [aspect, setAspect] = useState("16:9");
  const [history, setHistory] = useState<Generation[]>([]);

  const placeholder = mode === "image"
    ? "Type to imagine"
    : "Describe your video or reference by using @…";

  function send() {
    const value = prompt.trim();
    if (!value) {
      toast("Add a prompt", { description: "Tell Nexva what to imagine." });
      return;
    }
    onSubmitPrompt?.(value);
    const id = (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;
    setHistory((h) => [
      { id, prompt: value, mode, aspect, ts: Date.now() },
      ...h,
    ]);
    setPrompt("");
    setTab("history");
    toast(mode === "image" ? "Generating image…" : "Generating video…", {
      description: value,
    });
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto">
      {/* Page header */}
      <div className="border-b border-border/70 bg-background">
        <div className="mx-auto w-full max-w-[1280px] px-4 pt-6 sm:px-6 sm:pt-8">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[26px] font-semibold tracking-tight text-foreground sm:text-[30px]">
              Image &amp; Video
            </h1>
            <span className="rounded-md bg-foreground/8 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-foreground/70">
              Beta
            </span>
          </div>

          {/* Tabs */}
          <div className="mt-5 flex items-center gap-6 text-[14px]">
            {(["explore", "history"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={cn(
                  "relative -mb-px border-b-2 pb-3 capitalize transition-colors",
                  tab === k
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground/80",
                )}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-44 pt-5 sm:px-6 sm:pt-7">
        {tab === "explore" ? (
          <ExplorePanel />
        ) : (
          <HistoryPanel items={history} />
        )}
      </div>

      {/* Floating composer */}
      <FloatingComposer
        prompt={prompt}
        setPrompt={setPrompt}
        mode={mode}
        setMode={setMode}
        aspect={aspect}
        setAspect={setAspect}
        placeholder={placeholder}
        onSend={send}
      />
    </div>
  );
}

/* ---------------- Explore (search + templates + discover) ---------------- */

function ExplorePanel() {
  return (
    <>
      {/* Search row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.5}
          />
          <input
            type="text"
            placeholder="Search images and videos"
            className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-[13.5px] text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <PillChip icon={<Plus className="h-3.5 w-3.5" strokeWidth={1.6} />}>Image</PillChip>
          <PillChip icon={<Plus className="h-3.5 w-3.5" strokeWidth={1.6} />}>Video</PillChip>
        </div>
      </div>

      {/* Featured Templates */}
      <SectionHeader title="Featured Templates" actionLabel="View all" />
      <div className="-mx-4 mt-3 overflow-x-auto scroll-smooth px-4 sm:-mx-6 sm:px-6">
        <div className="flex gap-3 pb-1">
          {TEMPLATES.map((t) => (
            <TemplateCard key={t.label} template={t} />
          ))}
        </div>
      </div>

      {/* Discover */}
      <SectionHeader title="Discover" />
      <div className="mt-3 grid auto-rows-[170px] grid-cols-1 gap-3 sm:grid-cols-2 sm:auto-rows-[200px] md:grid-cols-3 lg:grid-cols-4">
        {DISCOVER.map((d, i) => (
          <DiscoverCard key={i} item={d} />
        ))}
      </div>
    </>
  );
}

function SectionHeader({ title, actionLabel }: { title: string; actionLabel?: string }) {
  return (
    <div className="mt-7 flex items-end justify-between sm:mt-9">
      <h2 className="text-[15px] font-semibold tracking-tight text-foreground">{title}</h2>
      {actionLabel && (
        <button
          onClick={() => toast("Coming soon")}
          className="text-[12px] text-muted-foreground hover:text-foreground"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function TemplateCard({ template }: { template: Template }) {
  return (
    <button
      onClick={() => toast(template.label, { description: "Template selected" })}
      className="group relative h-[200px] w-[160px] flex-shrink-0 overflow-hidden rounded-xl border border-border/80 bg-muted sm:h-[230px] sm:w-[180px]"
    >
      <img
        src={template.src}
        alt={template.label}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-2.5 left-3 text-[12.5px] font-medium text-white">
        {template.label}
      </div>
    </button>
  );
}

function DiscoverCard({ item }: { item: DiscoverItem }) {
  return (
    <button
      onClick={() => toast("Open preview", { description: "Coming soon" })}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/80 bg-muted",
        item.span === "tall" && "row-span-2",
        item.span === "wide" && "col-span-2",
      )}
    >
      <img
        src={item.src}
        alt=""
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      {item.isVideo && (
        <div className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white">
          <Play className="h-3 w-3 fill-current" strokeWidth={0} />
        </div>
      )}
    </button>
  );
}

/* ---------------- History ---------------- */

function HistoryPanel({ items }: { items: Generation[] }) {
  if (items.length === 0) {
    return (
      <div className="mx-auto mt-12 flex max-w-[420px] flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background">
          <Sparkles className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <div className="mt-4 text-[16px] font-semibold text-foreground">
          Your generations will appear here
        </div>
        <div className="mt-1.5 text-[13px] text-muted-foreground">
          Use the composer below to create an image or video. New generations land at the top.
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((g) => (
        <HistoryCard key={g.id} g={g} />
      ))}
    </div>
  );
}

function HistoryCard({ g }: { g: Generation }) {
  const Icon = g.mode === "video" ? VideoIcon : ImageIcon;
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-[4/3] w-full bg-muted">
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/60">
          <Icon className="h-9 w-9" strokeWidth={1.25} />
        </div>
        <div className="absolute left-2 top-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
          {g.mode}
        </div>
        <div className="absolute right-2 top-2 rounded-md bg-white/85 px-1.5 py-0.5 font-mono text-[10px] text-foreground/80">
          {g.aspect}
        </div>
      </div>
      <div className="px-3.5 py-2.5">
        <div className="line-clamp-2 text-[12.5px] text-foreground/85">{g.prompt}</div>
      </div>
    </div>
  );
}

/* ---------------- Floating composer ---------------- */

interface ComposerProps {
  prompt: string;
  setPrompt: (v: string) => void;
  mode: "image" | "video";
  setMode: (m: "image" | "video") => void;
  aspect: string;
  setAspect: (a: string) => void;
  placeholder: string;
  onSend: () => void;
}

function FloatingComposer({
  prompt, setPrompt, mode, setMode, aspect, setAspect, placeholder, onSend,
}: ComposerProps) {
  const [presetsVisible, setPresetsVisible] = useState(true);
  const aspectChoices = useMemo(() => mode === "image"
    ? ["1:1", "3:2", "16:9", "9:16"]
    : ["16:9", "9:16", "1:1"], [mode]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] sm:px-6 sm:pb-5">
      <div className="pointer-events-auto mx-auto w-full max-w-[820px]">
        <div className="rounded-2xl border border-border bg-card/95 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.18)] backdrop-blur-md">
          {/* Preset chips strip */}
          {presetsVisible && (
            <div className="flex items-center justify-between gap-2 border-b border-border/70 px-3 pt-2.5 pb-2 sm:px-4">
              <div className="flex flex-wrap items-center gap-1.5">
                {PRESET_CHIPS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[11.5px] text-foreground/80 hover:bg-accent"
                  >
                    <Sliders className="h-3 w-3 text-muted-foreground" strokeWidth={1.6} />
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPresetsVisible(false)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
                aria-label="Hide preset chips"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.6} />
              </button>
            </div>
          )}

          {/* Image / Video toggle */}
          <div className="flex items-center gap-1 px-3 pt-3 sm:px-4">
            {(["image", "video"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[12px] capitalize transition-colors",
                  mode === m
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Reference uploads — Video only */}
          {mode === "video" && (
            <div className="flex flex-wrap items-center gap-2 px-3 pt-3 sm:px-4">
              <RefBtn icon={<PictureInPicture2 className="h-3.5 w-3.5" strokeWidth={1.6} />}>Start frame</RefBtn>
              <RefBtn icon={<PictureInPicture2 className="h-3.5 w-3.5 rotate-180" strokeWidth={1.6} />}>End frame</RefBtn>
              <RefBtn icon={<ImageIcon className="h-3.5 w-3.5" strokeWidth={1.6} />}>Image refs</RefBtn>
              <RefBtn icon={<Film className="h-3.5 w-3.5" strokeWidth={1.6} />}>Video refs</RefBtn>
              <RefBtn icon={<Mic className="h-3.5 w-3.5" strokeWidth={1.6} />}>Audio refs</RefBtn>
            </div>
          )}

          {/* Prompt textarea */}
          <textarea
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="block w-full resize-none bg-transparent px-3 pt-3 pb-1.5 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none sm:px-4"
          />

          {/* Bottom toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 px-2.5 py-2 sm:px-3">
            <div className="flex flex-wrap items-center gap-1">
              <ToolbarBtn icon={<Wand2 className="h-3.5 w-3.5" strokeWidth={1.6} />}>Nexva 2.0</ToolbarBtn>
              <Divider />
              <AspectMenu value={aspect} onChange={setAspect} options={aspectChoices} />
              <ToolbarBtn icon={<Monitor className="h-3.5 w-3.5" strokeWidth={1.6} />}>720p</ToolbarBtn>
              {mode === "video" && (
                <>
                  <ToolbarBtn icon={<Clock className="h-3.5 w-3.5" strokeWidth={1.6} />}>4s</ToolbarBtn>
                  <ToolbarBtn icon={<VolumeX className="h-3.5 w-3.5" strokeWidth={1.6} />}>Off</ToolbarBtn>
                </>
              )}
              <ToolbarBtn icon={<Layers className="h-3.5 w-3.5" strokeWidth={1.6} />}>1</ToolbarBtn>
              <ToolbarBtn icon={<Zap className="h-3.5 w-3.5" strokeWidth={1.6} />}>On</ToolbarBtn>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden rounded-full border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground sm:inline-flex">
                4 left
              </span>
              <button
                onClick={onSend}
                aria-label="Send"
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                  prompt.trim()
                    ? "bg-foreground text-background hover:opacity-90"
                    : "bg-foreground/15 text-foreground/60",
                )}
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- small primitives ---------------- */

function PillChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={() => toast("Coming soon")}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[12.5px] text-foreground/80 hover:bg-accent"
    >
      {icon}
      {children}
    </button>
  );
}

function RefBtn({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={() => toast(`${children} — coming soon`)}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-[11.5px] text-foreground/80 hover:bg-accent"
    >
      {icon}
      {children}
    </button>
  );
}

function ToolbarBtn({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={() => toast("Coming soon")}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-foreground/80 hover:bg-accent"
    >
      {icon}
      {children}
    </button>
  );
}

function AspectMenu({
  value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-md bg-transparent px-2 py-1 pr-5 text-[12px] text-foreground/80 hover:bg-accent focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Divider() {
  return <span className="mx-0.5 h-4 w-px bg-border/80" aria-hidden />;
}
