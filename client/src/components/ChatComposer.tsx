/*
  ChatComposer — B&W minimal, Runable-inspired.

  Update (2026-05-04):
   - Removed the lightbulb (Tips) and book (Library) icon buttons.
   - Replaced the static "nexva-1.0" label with a searchable Model picker
     (popover) listing modern frontier models with NEW / Pro tags and the
     emoji glyphs from the reference screenshot.
   - All controls remain monochrome and on-brand.

  Layout:
   - Top row: textarea (auto-grow).
   - Bottom row: leading "+" attach button on the left,
     model picker + circular send button on the right.
*/

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Plus, ArrowUp, ChevronDown, Search as SearchIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/* -------------------------- Model registry -------------------------- */

interface ModelOption {
  id: string;
  name: string;
  description: string;
  /** Emoji used as the row glyph */
  glyph: string;
  isNew?: boolean;
  isPro?: boolean;
}

const MODELS: ModelOption[] = [
  {
    id: "gemini-3.1-flash-lite",
    name: "Gemini 3.1 Flash Lite",
    description: "Ultra-fast, light, efficient utility.",
    glyph: "✦",
    isNew: true,
  },
  {
    id: "grok-4.1-fast",
    name: "Grok 4.1 Fast",
    description: "Instant replies, no thinking delay.",
    glyph: "⊘",
  },
  {
    id: "claude-4.5-haiku",
    name: "Claude 4.5 Haiku",
    description: "Our fastest, most concise model.",
    glyph: "✺",
  },
  {
    id: "gemini-3.1-pro",
    name: "Gemini 3.1 Pro",
    description: "Deep research & multi-step logic.",
    glyph: "✦",
    isNew: true,
    isPro: true,
  },
  {
    id: "claude-4.6-sonnet",
    name: "Claude 4.6 Sonnet",
    description: "Best for coding & deep analysis.",
    glyph: "✺",
    isNew: true,
    isPro: true,
  },
];

const DEFAULT_MODEL_ID = "gemini-3.1-flash-lite";

/* -------------------------- Component -------------------------- */

interface ChatComposerProps {
  placeholder?: string;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  /** Optional: notify parent when the user picks a different model. */
  onModelChange?: (modelId: string) => void;
  /** Optional: control the selected model from outside. */
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
          <div className="flex items-center gap-1">
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
          </div>

          <div className="flex items-center gap-1.5">
            <ModelPicker
              activeId={activeModel.id}
              onPick={pickModel}
            />

            <button
              type="button"
              onClick={submit}
              disabled={!canSend}
              aria-label="Send"
              className={cn(
                "ml-1 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-150",
                canSend
                  ? "bg-foreground text-background hover:opacity-90"
                  : "border border-border text-muted-foreground cursor-not-allowed",
              )}
            >
              <ArrowUp className="h-[15px] w-[15px]" strokeWidth={2} />
            </button>
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
        {/* Search row */}
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

        {/* Model rows */}
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
                      <span className="truncate text-[13.5px] font-semibold text-foreground">
                        {m.name}
                      </span>
                      {m.isNew && <BadgeNew />}
                      {m.isPro && <BadgePro />}
                    </div>
                    <div className="mt-0.5 truncate text-[12px] text-muted-foreground">
                      {m.description}
                    </div>
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
