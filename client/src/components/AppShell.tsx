/*
  AppShell — B&W Minimal, Runable-style icon rail.
  - Fixed slim rail (56px), no expand/collapse, no text labels.
  - Brand mark at top → small "+" new-session → 4 nav icons.
  - Bottom: settings, user avatar.
  - Active state: filled near-black square behind icon (white glyph).
  - Hover state: light gray square.
  - All other icons live as tooltips on hover.
*/

import type { ReactNode } from "react";
import {
  MessageSquare,
  ImagePlus,
  Search,
  ListChecks,
  Plus,
  Settings,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type NavKey = "chat" | "image" | "search" | "tasks";

const NAV_ITEMS: { key: NavKey; label: string; icon: typeof MessageSquare }[] = [
  { key: "chat",   label: "Chat",      icon: MessageSquare },
  { key: "image",  label: "Image Gen", icon: ImagePlus },
  { key: "search", label: "Search",    icon: Search },
  { key: "tasks",  label: "Tasks",     icon: ListChecks },
];

interface AppShellProps {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  onNewSession?: () => void;
  children: ReactNode;
}

function RailButton({
  label,
  active,
  onClick,
  children,
  ariaLabel,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          aria-label={ariaLabel ?? label}
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-150",
            active
              ? "bg-foreground text-background"
              : "text-foreground/70 hover:bg-accent hover:text-foreground",
          )}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export function AppShell({ active, onNavigate, onNewSession, children }: AppShellProps) {
  return (
    <div className="relative z-10 flex min-h-screen w-full bg-background">
      {/* Slim icon rail */}
      <aside className="flex w-[56px] shrink-0 flex-col items-center border-r border-border bg-sidebar py-3">
        {/* Brand mark */}
        <div
          className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background"
          aria-label="Nexva.ai"
          title="Nexva.ai"
        >
          <span className="text-[13px] font-semibold leading-none">N</span>
        </div>

        {/* New session */}
        <div className="mb-3">
          <RailButton label="New session" onClick={onNewSession}>
            <Plus className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </RailButton>
        </div>

        <div className="my-1 h-px w-6 bg-border" aria-hidden />

        {/* Nav */}
        <nav className="mt-2 flex flex-col items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <RailButton
                key={item.key}
                label={item.label}
                active={item.key === active}
                onClick={() => onNavigate(item.key)}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </RailButton>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto flex flex-col items-center gap-1">
          <RailButton label="Help">
            <HelpCircle className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </RailButton>
          <RailButton label="Settings">
            <Settings className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </RailButton>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                aria-label="Account"
                className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-[12px] font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                D
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">Account</TooltipContent>
          </Tooltip>
        </div>
      </aside>

      {/* Canvas */}
      <main className="relative flex-1">{children}</main>
    </div>
  );
}
