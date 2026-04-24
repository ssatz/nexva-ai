/*
  ToolsStrip — Runable-style "Connect your tools to Nexva" strip.
  Renders directly under the composer, hairline-bordered card with a left
  label and a right cluster of 6 brand monogram icons. Clicking any tool
  toasts "Coming soon".
*/

import { Plug, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Tool {
  key: string;
  name: string;
  /** Single letter/glyph as monogram (B&W friendly fallback). */
  glyph: string;
  /** Background swatch behind the glyph. Uses currentColor + tone vars to stay monochrome-friendly. */
  tone: string;
}

const TOOLS: Tool[] = [
  { key: "gmail",   name: "Gmail",            glyph: "M", tone: "bg-[#f6f6f6] text-[#222]" },
  { key: "gcal",    name: "Google Calendar",  glyph: "31",tone: "bg-[#f6f6f6] text-[#222]" },
  { key: "slack",   name: "Slack",            glyph: "S", tone: "bg-[#f6f6f6] text-[#222]" },
  { key: "notion",  name: "Notion",           glyph: "N", tone: "bg-[#f6f6f6] text-[#222]" },
  { key: "github",  name: "GitHub",           glyph: "G", tone: "bg-[#f6f6f6] text-[#222]" },
  { key: "figma",   name: "Figma",            glyph: "F", tone: "bg-[#f6f6f6] text-[#222]" },
];

export function ToolsStrip() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-2">
      <div className="flex min-w-0 items-center gap-2 text-[12px] text-muted-foreground">
        <Plug className="h-3.5 w-3.5" strokeWidth={1.5} />
        <span className="truncate">Connect your tools to Nexva</span>
      </div>

      <div className="flex items-center gap-1">
        {TOOLS.map((t) => (
          <button
            key={t.key}
            type="button"
            aria-label={t.name}
            title={t.name}
            onClick={() => toast(t.name, { description: "Coming soon" })}
            className={`flex h-6 w-6 items-center justify-center rounded-md ${t.tone} font-mono text-[10px] font-semibold transition-transform hover:-translate-y-0.5`}
          >
            {t.glyph}
          </button>
        ))}
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setDismissed(true)}
          className="ml-1 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <X className="h-3 w-3" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
