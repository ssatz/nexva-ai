/*
  AppShell — Quiet Studio layout.
  - Fixed left rail: 72px collapsed / 248px expanded.
  - Hairline divider, warm sidebar tone (--sidebar).
  - Active nav item: subtle gray pill + 2px lilac dot to the left.
  - Outline icons only (Lucide), 1.5px stroke implied via size.
*/

import { useState, type ReactNode } from "react";
import {
  MessageSquare,
  ImagePlus,
  Search,
  ListChecks,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type NavKey = "chat" | "image" | "search" | "tasks";

const NAV_ITEMS: { key: NavKey; label: string; icon: typeof MessageSquare; hint: string }[] = [
  { key: "chat",   label: "Chat",      icon: MessageSquare, hint: "LLM conversation" },
  { key: "image",  label: "Image Gen", icon: ImagePlus,     hint: "Generate visuals" },
  { key: "search", label: "Search",    icon: Search,        hint: "Search the web" },
  { key: "tasks",  label: "Tasks",     icon: ListChecks,    hint: "Schedule & track" },
];

interface AppShellProps {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  onNewSession?: () => void;
  children: ReactNode;
}

export function AppShell({ active, onNavigate, onNewSession, children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative z-10 flex min-h-screen w-full">
      {/* Sidebar */}
      <aside
        className={cn(
          "group/aside relative flex flex-col border-r border-sidebar-border bg-sidebar",
          "transition-[width] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          collapsed ? "w-[72px]" : "w-[248px]",
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 pt-6 pb-7">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background"
            aria-label="Nexva.ai logo"
          >
            <span className="font-serif text-[20px] leading-none text-foreground">N</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <div className="font-serif text-[20px] leading-none text-foreground">
                Nexva<span className="text-primary">.ai</span>
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Quiet Studio
              </div>
            </div>
          )}
        </div>

        {/* New session button */}
        <div className="px-3">
          <button
            onClick={onNewSession}
            className={cn(
              "group flex w-full items-center gap-3 rounded-lg border border-border/80 bg-background/60 px-3 py-2.5",
              "text-[13px] font-medium text-foreground/80 hover:text-foreground hover:bg-background",
              "transition-colors duration-200",
              collapsed && "justify-center px-0",
            )}
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            {!collapsed && <span>New session</span>}
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-6 flex-1 px-3">
          {!collapsed && (
            <div className="px-2 pb-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Workspace
            </div>
          )}
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.key === active;
              const Icon = item.icon;
              const button = (
                <button
                  onClick={() => onNavigate(item.key)}
                  className={cn(
                    "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px]",
                    "transition-colors duration-200",
                    isActive
                      ? "bg-sidebar-accent text-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-foreground",
                    collapsed && "justify-center px-0",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Active dot */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r-full bg-primary transition-opacity duration-200",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </button>
              );

              return (
                <li key={item.key}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{button}</TooltipTrigger>
                      <TooltipContent side="right" className="text-xs">
                        {item.label} <span className="opacity-60">— {item.hint}</span>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    button
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="mt-auto flex flex-col gap-1 px-3 pb-4">
          <button
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-sidebar-foreground/80",
              "hover:bg-sidebar-accent/60 hover:text-foreground transition-colors duration-200",
              collapsed && "justify-center px-0",
            )}
          >
            <Settings className="h-4 w-4" strokeWidth={1.5} />
            {!collapsed && <span className="font-medium">Settings</span>}
          </button>

          <button
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              "mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-muted-foreground",
              "hover:bg-sidebar-accent/60 hover:text-foreground transition-colors duration-200",
              collapsed && "justify-center px-0",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <PanelLeftClose className="h-4 w-4" strokeWidth={1.5} />
            )}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Canvas */}
      <main className="relative flex-1">{children}</main>
    </div>
  );
}
