/*
  ChatComposer — B&W minimal, Runable-inspired.

  Update (2026-05-04 b):
   - The trailing button now MORPHS based on input state:
       - Empty → Mic icon (taps toggle a "voice input" placeholder).
       - Non-empty → Send arrow.
   - Added a "Chat controls" popover (Sliders icon next to the model picker)
     containing Capabilities (Artifacts, Search, Image w/ sub-picker,
     Data Analysis, Think (R1)) and Personalization (Custom Instructions,
     Response language). Toggles persist in local component state and
     surface a toast on each change.

  Layout (left to right on the bottom row):
   left  : Plus (attach)
   right : Sliders (chat controls) · Model picker · Mic / Send
*/

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  Plus,
  ArrowUp,
  Mic,
  ChevronDown,
  Search as SearchIcon,
  Check,
  SlidersHorizontal,
  LayoutPanelTop,
  Globe,
  ImagePlus as ImagePlusIcon,
  BarChart3,
  Brain,
  StickyNote,
  Languages,
  Pencil,
  Wand2,
  Square,
  Lightbulb,
  Film,
  Music,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

/* -------------------------- Model registry -------------------------- */

interface ModelOption {
  id: string;
  name: string;
  description: string;
  glyph: string;
  isNew?: boolean;
  isPro?: boolean;
}

const MODELS: ModelOption[] = [
  { id: "gemini-3.1-flash-lite", name: "Gemini 3.1 Flash Lite", description: "Ultra-fast, light, efficient utility.",      glyph: "✦", isNew: true },
  { id: "grok-4.1-fast",         name: "Grok 4.1 Fast",         description: "Instant replies, no thinking delay.",         glyph: "⊘" },
  { id: "claude-4.5-haiku",      name: "Claude 4.5 Haiku",      description: "Our fastest, most concise model.",            glyph: "✺" },
  { id: "gemini-3.1-pro",        name: "Gemini 3.1 Pro",        description: "Deep research & multi-step logic.",           glyph: "✦", isNew: true, isPro: true },
  { id: "claude-4.6-sonnet",     name: "Claude 4.6 Sonnet",     description: "Best for coding & deep analysis.",            glyph: "✺", isNew: true, isPro: true },
];

const DEFAULT_MODEL_ID = "gemini-3.1-flash-lite";

const IMAGE_MODELS = ["Nano Banana Pro", "Imagen 4", "Flux 1.1", "DALL·E 3"];
const LANGUAGES   = ["Auto", "English", "Spanish", "French", "German", "Hindi", "Japanese"];

/* -------------------------- Component -------------------------- */

interface ChatComposerProps {
  placeholder?: string;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  onModelChange?: (modelId: string) => void;
  modelId?: string;
}

export function ChatComposer({
  placeholder = "Type your idea here…",
  onSubmit,
  disabled,
  onModelChange,
  modelId,
}: ChatComposerProps) {
  const [value, setValue] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [internalModelId, setInternalModelId] = useState(modelId ?? DEFAULT_MODEL_ID);
  const activeModelId = modelId ?? internalModelId;
  const activeModel = MODELS.find((m) => m.id === activeModelId) ?? MODELS[0];

  function pickModel(id: string) {
    setInternalModelId(id);
    onModelChange?.(id);
  }

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 220) + "px";
  }, [value]);

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
  }

  function startVoice() {
    toast("Voice input", { description: "Speech-to-text coming soon." });
  }

  const canSend = !!value.trim() && !disabled;

  return (
    <div className="input-shelf w-full rounded-[22px]">
      <div className="flex flex-col gap-1 px-5 pt-4 pb-3">
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          placeholder={placeholder}
          className={cn(
            "min-h-[44px] w-full resize-none border-0 bg-transparent px-0 py-1.5",
            "text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-0",
          )}
        />

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="Attach"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground/70 hover:bg-accent hover:text-foreground transition-colors"
                >
                  <Plus className="h-[15px] w-[15px]" strokeWidth={1.75} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">Attach</TooltipContent>
            </Tooltip>
            <ChatControlsPopover />
          </div>

          <div className="flex items-center gap-1.5">
            <ModelPicker activeId={activeModel.id} onPick={pickModel} />

            {/* Mic-when-empty / Send-when-typing */}
            {canSend ? (
              <button
                type="button"
                onClick={submit}
                aria-label="Send"
                className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-90"
              >
                <ArrowUp className="h-[15px] w-[15px]" strokeWidth={2} />
              </button>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={startVoice}
                    aria-label="Voice input"
                    className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <Mic className="h-[15px] w-[15px]" strokeWidth={1.75} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">Voice input</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------- Model picker -------------------------- */

function ModelPicker({
  activeId,
  onPick,
}: {
  activeId: string;
  onPick: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const active = MODELS.find((m) => m.id === activeId) ?? MODELS[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MODELS;
    return MODELS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Pick a model"
          className="flex h-8 max-w-[180px] items-center gap-1.5 rounded-full border border-border bg-background px-2.5 text-foreground/80 hover:bg-accent hover:text-foreground transition-colors"
        >
          <span className="text-[14px] leading-none">{active.glyph}</span>
          <span className="truncate text-[12px] font-medium">{active.name}</span>
          <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" strokeWidth={1.75} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="top"
        sideOffset={8}
        className="w-[340px] rounded-2xl border border-border bg-card p-2 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)]"
      >
        <div className="relative">
          <SearchIcon
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search models"
            autoFocus
            className="h-9 w-full rounded-full border border-border bg-background pl-8 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none"
          />
        </div>

        <div className="mt-2 flex max-h-[320px] flex-col overflow-y-auto pr-0.5">
          {filtered.length === 0 ? (
            <div className="px-2 py-6 text-center text-[12.5px] text-muted-foreground">
              No models match.
            </div>
          ) : (
            filtered.map((m) => {
              const isActive = m.id === activeId;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onPick(m.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex items-start gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors",
                    isActive ? "bg-muted/70" : "hover:bg-muted/50",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[14px]",
                      isActive ? "bg-background text-foreground" : "text-foreground/85",
                    )}
                    aria-hidden
                  >
                    {m.glyph}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="truncate text-[13.5px] font-semibold text-foreground">{m.name}</span>
                      {m.isNew && <BadgeNew />}
                      {m.isPro && <BadgePro />}
                    </div>
                    <div className="mt-0.5 truncate text-[12px] text-muted-foreground">{m.description}</div>
                  </div>
                  {isActive && (
                    <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-foreground" strokeWidth={2} />
                  )}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* -------------------------- Chat controls popover -------------------------- */

interface Capabilities {
  artifacts: boolean;
  search: boolean;
  image: boolean;
  imageModel: string;
  dataAnalysis: boolean;
  think: boolean;
  customInstructions: boolean;
  language: string;
}

const DEFAULT_CAPS: Capabilities = {
  artifacts: false,
  search: false,
  image: false,
  imageModel: "Nano Banana Pro",
  dataAnalysis: false,
  think: false,
  customInstructions: false,
  language: "Auto",
};

function ChatControlsPopover() {
  const [open, setOpen] = useState(false);
  const [caps, setCaps] = useState<Capabilities>(DEFAULT_CAPS);

  const enabledCount =
    Number(caps.artifacts) +
    Number(caps.search) +
    Number(caps.image) +
    Number(caps.dataAnalysis) +
    Number(caps.think);

  function update<K extends keyof Capabilities>(key: K, value: Capabilities[K], label?: string) {
    setCaps((c) => ({ ...c, [key]: value }));
    if (label) {
      const isToggle = typeof value === "boolean";
      toast(label, {
        description: isToggle ? (value ? "Enabled" : "Disabled") : `Set to ${value}`,
      });
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Tools"
              className={cn(
                "relative flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-foreground/80 transition-colors hover:bg-accent hover:text-foreground",
                enabledCount > 0 && "border-foreground/40 text-foreground",
              )}
            >
              <SlidersHorizontal className="h-[14px] w-[14px]" strokeWidth={1.75} />
              <span className="text-[12.5px] font-medium">Tools</span>
              {enabledCount > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-foreground px-1 text-[9px] font-semibold leading-none text-background">
                  {enabledCount}
                </span>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">Tools & controls</TooltipContent>
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        sideOffset={8}
        className="w-[320px] rounded-2xl border border-border bg-card p-3 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)]"
      >
        <div className="px-1 pb-1 text-[14px] font-semibold text-foreground">Chat controls</div>

        {/* Tools */}
        <div className="mt-2.5 px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Tools
        </div>
        <div className="mt-1 flex flex-col">
          <ToolRow
            icon={<ImagePlusIcon className="h-4 w-4 text-orange-500" strokeWidth={1.6} />}
            label="Create image"
            onClick={() => { toast("Create image", { description: "Opening image generator..." }); setOpen(false); }}
          />
          <ToolRow
            icon={<Square className="h-4 w-4 text-emerald-500" strokeWidth={1.6} />}
            label="Canvas"
            onClick={() => { toast("Canvas", { description: "Opening canvas..." }); setOpen(false); }}
          />
          <ToolRow
            icon={<Lightbulb className="h-4 w-4 text-amber-500" strokeWidth={1.6} />}
            label="Deep research"
            onClick={() => { toast("Deep research", { description: "Starting research..." }); setOpen(false); }}
          />
          <ToolRow
            icon={<Film className="h-4 w-4 text-rose-500" strokeWidth={1.6} />}
            label="Create video"
            onClick={() => { toast("Create video", { description: "Opening video generator..." }); setOpen(false); }}
          />
          <ToolRow
            icon={<Music className="h-4 w-4 text-violet-500" strokeWidth={1.6} />}
            label="Create music"
            badge="New"
            onClick={() => { toast("Create music", { description: "Opening music generator..." }); setOpen(false); }}
          />
          <ToolRow
            icon={<BookOpen className="h-4 w-4 text-blue-500" strokeWidth={1.6} />}
            label="Learn"
            onClick={() => { toast("Learn", { description: "Opening learning resources..." }); setOpen(false); }}
          />
        </div>

        {/* Capabilities */}
        <div className="mt-1.5 px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Capabilities
        </div>
        <div className="mt-1 flex flex-col">
          <CapabilityRow
            icon={<LayoutPanelTop className="h-4 w-4 text-emerald-500" strokeWidth={1.6} />}
            label="Artifacts"
            checked={caps.artifacts}
            onChange={(v) => update("artifacts", v, "Artifacts")}
          />
          <CapabilityRow
            icon={<Globe className="h-4 w-4 text-sky-500" strokeWidth={1.6} />}
            label="Search"
            checked={caps.search}
            onChange={(v) => update("search", v, "Search")}
          />
          <CapabilityRow
            icon={<ImagePlusIcon className="h-4 w-4 text-orange-500" strokeWidth={1.6} />}
            label="Image"
            checked={caps.image}
            onChange={(v) => update("image", v, "Image")}
            extra={
              caps.image && (
                <SubPicker
                  value={caps.imageModel}
                  options={IMAGE_MODELS}
                  onChange={(v) => update("imageModel", v, "Image model")}
                />
              )
            }
          />
          <CapabilityRow
            icon={<BarChart3 className="h-4 w-4 text-blue-500" strokeWidth={1.6} />}
            label="Data Analysis"
            checked={caps.dataAnalysis}
            onChange={(v) => update("dataAnalysis", v, "Data Analysis")}
          />
          <CapabilityRow
            icon={<Brain className="h-4 w-4 text-indigo-500" strokeWidth={1.6} />}
            label="Think (R1)"
            checked={caps.think}
            onChange={(v) => update("think", v, "Think (R1)")}
          />
        </div>

        {/* Personalization */}
        <div className="mt-2.5 border-t border-border pt-2.5 px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Personalization
        </div>
        <div className="mt-1 flex flex-col">
          <CapabilityRow
            icon={<StickyNote className="h-4 w-4 text-violet-500" strokeWidth={1.6} />}
            label="Custom Instructions"
            checked={caps.customInstructions}
            onChange={(v) => update("customInstructions", v, "Custom Instructions")}
            extra={
              <button
                type="button"
                onClick={() => toast("Edit instructions", { description: "Coming soon" })}
                aria-label="Edit custom instructions"
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5" strokeWidth={1.6} />
              </button>
            }
          />
          <div className="flex items-center justify-between gap-3 rounded-lg px-2 py-2">
            <div className="flex min-w-0 items-center gap-2.5 text-foreground/85">
              <span className="text-foreground/70">
                <Languages className="h-4 w-4" strokeWidth={1.6} />
              </span>
              <span className="text-[13px]">Response language</span>
            </div>
            <SubPicker
              value={caps.language}
              options={LANGUAGES}
              onChange={(v) => update("language", v, "Response language")}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ToolRow({
  icon, label, badge, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between gap-2 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-muted/50"
    >
      <div className="flex min-w-0 items-center gap-2.5 text-foreground/85">
        <span className="shrink-0">{icon}</span>
        <span className="truncate text-[13px]">{label}</span>
      </div>
      {badge && (
        <span className="rounded-md bg-foreground/8 px-1.5 py-px text-[9px] font-semibold uppercase tracking-wider text-foreground/80 shrink-0">
          {badge}
        </span>
      )}
    </button>
  );
}

function CapabilityRow({
  icon, label, checked, onChange, extra,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50">
      <div className="flex min-w-0 items-center gap-2.5 text-foreground/85">
        <span className="shrink-0">{icon}</span>
        <span className="truncate text-[13px]">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {extra}
        <Switch checked={checked} onCheckedChange={onChange} />
      </div>
    </div>
  );
}

function SubPicker({
  value, options, onChange,
}: { value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex max-w-[140px] items-center gap-1 rounded-md px-1.5 py-0.5 text-[12px] text-foreground/80 hover:bg-accent hover:text-foreground"
        >
          <span className="truncate">{value}</span>
          <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" strokeWidth={1.75} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="top"
        sideOffset={6}
        className="w-[180px] rounded-xl border border-border bg-card p-1 shadow-md"
      >
        {options.map((o) => {
          const isActive = o === value;
          return (
            <button
              key={o}
              type="button"
              onClick={() => { onChange(o); setOpen(false); }}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[13px] transition-colors",
                isActive ? "bg-muted text-foreground" : "text-foreground/80 hover:bg-muted/60",
              )}
            >
              <span className="truncate">{o}</span>
              {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-foreground" strokeWidth={2} />}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

/* -------------------------- Tag primitives -------------------------- */

function BadgeNew() {
  return (
    <span className="rounded-md bg-foreground/8 px-1.5 py-px text-[9.5px] font-semibold uppercase tracking-wider text-foreground/80">
      New
    </span>
  );
}

function BadgePro() {
  return (
    <span className="rounded-md border border-border bg-background px-1.5 py-px text-[9.5px] font-semibold uppercase tracking-wider text-foreground/70">
      Pro
    </span>
  );
}
