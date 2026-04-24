/*
  ChatComposer — the central input shelf.
  Quiet Studio: warm white surface, hairline border, soft inner ring,
  pill-shaped lilac send button, outline contextual tools.
*/

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  Paperclip,
  ImagePlus,
  Globe,
  Code2,
  Mic,
  ArrowUp,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatComposerProps {
  placeholder?: string;
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

const TOOLS = [
  { key: "attach", label: "Attach file",       icon: Paperclip },
  { key: "image",  label: "Generate image",    icon: ImagePlus },
  { key: "web",    label: "Search the web",    icon: Globe },
  { key: "code",   label: "Code mode",         icon: Code2 },
  { key: "voice",  label: "Voice input",       icon: Mic },
];

export function ChatComposer({
  placeholder = "Ask anything, create anything…",
  onSubmit,
  disabled,
}: ChatComposerProps) {
  const [value, setValue] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
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

  return (
    <div className="input-shelf w-full rounded-[20px] bg-card">
      <div className="flex flex-col gap-2 p-3 pl-4">
        <div className="flex items-start gap-3">
          <Sparkles
            className="mt-2.5 h-4 w-4 shrink-0 text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden
          />
          <textarea
            ref={taRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            placeholder={placeholder}
            className={cn(
              "min-h-[40px] w-full resize-none border-0 bg-transparent px-0 py-2.5",
              "text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/80",
              "focus:outline-none focus:ring-0",
            )}
          />
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1">
            {TOOLS.map(({ key, label, icon: Icon }) => (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground",
                      "hover:bg-accent hover:text-foreground transition-colors duration-150",
                    )}
                    aria-label={label}
                  >
                    <Icon className="h-[15px] w-[15px]" strokeWidth={1.5} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">{label}</TooltipContent>
              </Tooltip>
            ))}

            <div className="ml-2 hidden items-center gap-2 rounded-full border border-border/80 bg-background/60 px-2.5 py-1 text-[11px] text-muted-foreground sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="font-mono">nexva-1.0</span>
            </div>
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={!value.trim() || disabled}
            className={cn(
              "flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium",
              "bg-primary text-primary-foreground",
              "transition-all duration-200",
              "hover:opacity-95 hover:translate-y-[-1px]",
              "disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 disabled:translate-y-0 disabled:cursor-not-allowed",
            )}
          >
            <span>Send</span>
            <ArrowUp className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
