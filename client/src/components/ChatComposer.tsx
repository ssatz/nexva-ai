/*
  ChatComposer — B&W minimal, Runable-inspired.
  - White rounded card (radius 18-22px), hairline border.
  - Top row: textarea (auto-grow).
  - Bottom row: leading "+" + small contextual icons on the left,
    model pill + circular send button on the right.
  - All ink is black/gray. No color, no gradients, no shadows beyond focus ring.
*/

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  Plus,
  BookOpen,
  Lightbulb,
  Box,
  ArrowUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatComposerProps {
  placeholder?: string;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  modelLabel?: string;
}

export function ChatComposer({
  placeholder = "Type your idea here…",
  onSubmit,
  disabled,
  modelLabel = "nexva-1.0",
}: ChatComposerProps) {
  const [value, setValue] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

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
                  aria-label="Add"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground/70 hover:bg-accent hover:text-foreground transition-colors"
                >
                  <Plus className="h-[15px] w-[15px]" strokeWidth={1.75} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">Attach</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="Library"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/60 hover:bg-accent hover:text-foreground transition-colors"
                >
                  <BookOpen className="h-[15px] w-[15px]" strokeWidth={1.75} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">Library</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="Tips"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/60 hover:bg-accent hover:text-foreground transition-colors"
                >
                  <Lightbulb className="h-[15px] w-[15px]" strokeWidth={1.75} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">Tips</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={modelLabel}
                  className="flex h-8 items-center gap-1.5 rounded-full px-2.5 text-foreground/60 hover:bg-accent hover:text-foreground transition-colors"
                >
                  <Box className="h-[15px] w-[15px]" strokeWidth={1.75} />
                  <span className="font-mono text-[11px]">{modelLabel}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">Model</TooltipContent>
            </Tooltip>

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
