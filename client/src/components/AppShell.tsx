/*
  AppShell — ElevenLabs-style sidebar with a collapse toggle next to the brand.
  - Expanded (240px): brand wordmark, "New chat" row, icon+label nav, History section, footer rows.
  - Collapsed (56px): monogram only, icon-only buttons with right-side tooltips, History hidden.
  - State persists to localStorage ("nexva:sidebar:collapsed").
*/

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  MessageSquare,
  ImagePlus,
  Search,
  ListChecks,
  Plus,
  Settings,
  HelpCircle,
  ChevronRight,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHistory } from "@/contexts/HistoryContext";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type NavKey = "chat" | "image" | "search" | "tasks" | "studio";

const NAV_ITEMS: { key: NavKey; label: string; icon: typeof MessageSquare }[] = [
  { key: "chat",   label: "Chat",       icon: MessageSquare },
  { key: "studio", label: "Studio",     icon: Sparkles },
  { key: "image",  label: "Image Gen",  icon: ImagePlus },
  { key: "search", label: "Search",     icon: Search },
  { key: "tasks",  label: "Tasks",      icon: ListChecks },
];

const STORAGE_KEY = "nexva:sidebar:collapsed";

interface AppShellProps {
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  onNewSession?: () => void;
  topBar?: ReactNode;
  children: ReactNode;
}

export function AppShell({ active, onNavigate, onNewSession, topBar, children }: AppShellProps) {
  const { entries, activeId, setActiveId } = useHistory();
  const [historyOpen, setHistoryOpen] = useState(true);

  // Collapsed state — initialize from localStorage on mount.
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "1") setCollapsed(true);
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  const VISIBLE = 7;
  const visible = entries.slice(0, VISIBLE);

  return (
    <div className="relative z-10 flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar — fixed to the viewport, scrolls independently */}
      <aside
        className={cn(
          "sticky top-0 flex h-screen shrink-0 flex-col border-r border-border bg-sidebar",
          "transition-[width] duration-200 ease-out",
          collapsed ? "w-[56px]" : "w-[240px]",
        )}
      >
        {/* Brand + collapse toggle */}
        <div
          className={cn(
            "flex items-center pt-4 pb-3",
            collapsed ? "flex-col gap-2 px-2" : "justify-between px-4",
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
              <span className="text-[12px] font-semibold leading-none">N</span>
            </div>
            {!collapsed && (
              <span className="truncate text-[14px] font-semibold tracking-tight text-foreground">
                Nexva.ai
              </span>
            )}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setCollapsed((v) => !v)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="flex h-7 w-7 items-center justify-center rounded-md text-foreground/60 transition-colors hover:bg-accent hover:text-foreground"
              >
                {collapsed ? (
                  <PanelLeft className="h-[15px] w-[15px]" strokeWidth={1.5} />
                ) : (
                  <PanelLeftClose className="h-[15px] w-[15px]" strokeWidth={1.5} />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {collapsed ? "Expand sidebar" : "Collapse sidebar"}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* New chat */}
        <div className={cn("pb-2", collapsed ? "px-2" : "px-3")}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onNewSession}
                  aria-label="New chat"
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent"
                >
                  <Plus className="h-[16px] w-[16px]" strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">New chat</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={onNewSession}
              className="group flex w-full items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Plus className="h-[15px] w-[15px]" strokeWidth={1.5} />
              New chat
            </button>
          )}
        </div>

        {/* Primary nav */}
        <nav className={cn("flex flex-col gap-0.5 pt-1", collapsed ? "px-2" : "px-2")}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === active;

            if (collapsed) {
              return (
                <Tooltip key={item.key}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onNavigate(item.key)}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={item.label}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md transition-colors duration-150",
                        isActive
                          ? "bg-accent text-foreground"
                          : "text-foreground/70 hover:bg-accent/70 hover:text-foreground",
                      )}
                    >
                      <Icon className="h-[16px] w-[16px]" strokeWidth={1.5} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors duration-150",
                  isActive
                    ? "bg-accent font-medium text-foreground"
                    : "text-foreground/70 hover:bg-accent/70 hover:text-foreground",
                )}
              >
                <Icon className="h-[15px] w-[15px]" strokeWidth={1.5} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* History (expanded only) */}
        {!collapsed && (
          <div className="mt-5 flex min-h-0 flex-1 flex-col px-2">
            <button
              onClick={() => setHistoryOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium text-foreground/60 hover:text-foreground transition-colors"
            >
              <span>History</span>
              <ChevronRight
                className={cn(
                  "h-3 w-3 transition-transform duration-200",
                  historyOpen && "rotate-90",
                )}
                strokeWidth={1.75}
              />
            </button>

            {historyOpen && (
              <div className="mt-1 flex min-h-0 flex-1 flex-col overflow-y-auto pr-1">
                {visible.length === 0 ? (
                  <div className="px-2.5 py-2 text-[12px] text-muted-foreground">
                    No history yet.
                  </div>
                ) : (
                  <ul className="flex flex-col gap-0.5">
                    {visible.map((h) => (
                      <li key={h.id}>
                        <button
                          onClick={() => {
                            setActiveId(h.id);
                            onNavigate("chat");
                          }}
                          className={cn(
                            "block w-full truncate rounded-md px-2.5 py-1.5 text-left text-[13px] transition-colors hover:bg-accent hover:text-foreground",
                            h.id === activeId
                              ? "bg-accent font-medium text-foreground"
                              : "text-foreground/80",
                          )}
                          title={h.title}
                        >
                          {h.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {entries.length > VISIBLE && (
                  <button
                    onClick={() => toast("All sessions", { description: "Coming soon" })}
                    className="mt-1 self-start rounded-md px-2.5 py-1.5 text-[12px] font-medium text-foreground/60 hover:text-foreground transition-colors"
                  >
                    See all
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Spacer when collapsed to push footer down */}
        {collapsed && <div className="flex-1" />}

        {/* Footer rows */}
        <div
          className={cn(
            "flex flex-col gap-0.5 border-t border-border",
            collapsed ? "items-center p-2" : "p-2",
          )}
        >
          <FooterRow
            collapsed={collapsed}
            icon={<HelpCircle className="h-[15px] w-[15px]" strokeWidth={1.5} />}
            label="Help"
            onClick={() => toast("Help center", { description: "Coming soon" })}
          />
          <FooterRow
            collapsed={collapsed}
            icon={<Settings className="h-[15px] w-[15px]" strokeWidth={1.5} />}
            label="Settings"
            onClick={() => toast("Settings", { description: "Coming soon" })}
          />
        </div>
      </aside>

      {/* Canvas — fixed height; inner view decides what scrolls */}
      <main className="relative flex h-screen min-h-0 flex-1 flex-col">
        {topBar && (
          <div className="sticky top-0 z-20 border-b border-border bg-background/85 px-6 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/70">
            {topBar}
          </div>
        )}
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </main>
    </div>
  );
}

function FooterRow({
  icon,
  label,
  onClick,
  collapsed,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  collapsed: boolean;
}) {
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            aria-label={label}
            className="flex h-10 w-10 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-accent/70 hover:text-foreground"
          >
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">{label}</TooltipContent>
      </Tooltip>
    );
  }
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-foreground/70 transition-colors hover:bg-accent/70 hover:text-foreground"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
