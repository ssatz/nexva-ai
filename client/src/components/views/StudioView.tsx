/*
  StudioView — "Chat 2" page.
  A Lovart / Manus-style launcher: a large composer on top, nine B&W outline
  category tiles below with an underline on the selected one.
  - Composer text + structure is replicated exactly per spec.
  - Tiles are monochrome (no brand colors), 48px icon wells in hairline borders.
  - Submitting the composer appends a history entry tagged with the selected
    category and toasts "Routing to {category}…".
*/

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  Plus,
  SlidersHorizontal,
  Zap,
  ArrowUp,
  ChevronDown,
  Wand2,
  ImageIcon,
  FileText,
  Presentation,
  MessageSquare,
  Sheet,
  Globe,
  Video,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useHistory } from "@/contexts/HistoryContext";

type CategoryKey =
  | "general"
  | "images"
  | "documents"
  | "slides"
  | "chat"
  | "sheets"
  | "websites"
  | "videos"
  | "tools";

const CATEGORIES: { key: CategoryKey; label: string; icon: typeof Wand2 }[] = [
  { key: "general",   label: "General",   icon: Wand2 },
  { key: "images",    label: "Images",    icon: ImageIcon },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "slides",    label: "Slides",    icon: Presentation },
  { key: "chat",      label: "Chat",      icon: MessageSquare },
  { key: "sheets",    label: "Sheets",    icon: Sheet },
  { key: "websites",  label: "Websites",  icon: Globe },
  { key: "videos",    label: "Videos",    icon: Video },
  { key: "tools",     label: "Tools",     icon: Layers },
];

const PLACEHOLDER =
  "Try tasks, workflows, or rescheduling tasks — type @ to add files or skills";

export function StudioView() {
  const [selected, setSelected] = useState<CategoryKey>("general");
  const [value, setValue] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);
  const { addEntry } = useHistory();

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 220) + "px";
  }, [value]);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    const category = CATEGORIES.find((c) => c.key === selected)!.label;
    addEntry(`${category}: ${trimmed}`);
    toast(`Routing to ${category}…`, {
      description: "Studio is a preview layout. Connect a backend to actually route.",
    });
    setValue("");
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  const canSend = !!value.trim();

  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto px-4 pb-10 sm:px-6 sm:pb-16">
      <div className="w-full max-w-[860px] -mt-4">
        {/* Composer */}
        <div
          className="input-shelf w-full rounded-[22px] anim-fade-up"
          style={{ animationDelay: "60ms" }}
        >
          <div className="flex flex-col gap-1 px-3 pt-3 pb-2 sm:px-5 sm:pt-4 sm:pb-3">
            <textarea
              ref={taRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
              placeholder={PLACEHOLDER}
              className={cn(
                "min-h-[60px] w-full resize-none border-0 bg-transparent px-0 py-1.5",
                "text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-0",
              )}
            />

            <div className="flex items-center justify-between gap-2 pt-1">
              {/* Left cluster */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Add"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Plus className="h-[15px] w-[15px]" strokeWidth={1.75} />
                </button>

                <button
                  type="button"
                  onClick={() => toast("Tools", { description: "Connect your tools — coming soon." })}
                  className="flex h-8 items-center gap-1.5 rounded-full px-2 text-[13px] text-foreground/75 transition-colors hover:bg-accent hover:text-foreground sm:px-3"
                >
                  <SlidersHorizontal className="h-[15px] w-[15px]" strokeWidth={1.75} />
                  <span className="hidden sm:inline">Tools</span>
                </button>

                <button
                  type="button"
                  onClick={() => toast("Skills", { description: "Browse skills — coming soon." })}
                  className="flex h-8 items-center gap-1.5 rounded-full px-2 text-[13px] text-foreground/75 transition-colors hover:bg-accent hover:text-foreground sm:px-3"
                >
                  <Zap className="h-[15px] w-[15px]" strokeWidth={1.75} />
                  <span className="hidden sm:inline">Skill</span>
                </button>
              </div>

              {/* Right cluster */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="flex h-8 items-center gap-1.5 rounded-full px-2 text-[13px] text-foreground/75 transition-colors hover:bg-accent hover:text-foreground sm:px-3"
                >
                  <Wand2 className="h-[15px] w-[15px]" strokeWidth={1.75} />
                  <span className="hidden sm:inline">Auto Model</span>
                  <ChevronDown className="h-[13px] w-[13px]" strokeWidth={1.75} />
                </button>

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

        {/* Category tiles */}
        <div
          className="mt-8 grid grid-cols-3 gap-x-3 gap-y-5 sm:mt-10 sm:grid-cols-5 sm:gap-x-4 md:grid-cols-9 anim-fade-up"
          style={{ animationDelay: "140ms" }}
        >
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            const isSelected = c.key === selected;
            return (
              <button
                key={c.key}
                onClick={() => setSelected(c.key)}
                className="group flex flex-col items-center gap-2"
              >
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-[14px] border transition-all duration-150",
                    isSelected
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-foreground/80 group-hover:border-foreground/40 group-hover:text-foreground",
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                </span>
                <span
                  className={cn(
                    "text-[12.5px] leading-none transition-colors",
                    isSelected
                      ? "font-medium text-foreground underline underline-offset-[6px] decoration-foreground/60"
                      : "text-foreground/70 group-hover:text-foreground",
                  )}
                >
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footnote */}
        <div className="mt-10 text-center text-[12px] text-muted-foreground">
          Studio routes your request to the best workspace based on the selected category.
        </div>
      </div>
    </div>
  );
}
