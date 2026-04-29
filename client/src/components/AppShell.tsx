/*
  AppShell — responsive ElevenLabs-style sidebar.

  Breakpoints:
  - <md  (phone/tablet portrait): sidebar is an off-canvas drawer. A hamburger in the
          sticky top bar opens it. Backdrop + body-scroll lock + Esc + route-change closes it.
          When open, the drawer is always "expanded" (240px) — collapse toggle is hidden
          because it doesn't make sense in a drawer.
  - ≥md  (tablet landscape / desktop): static aside with collapse toggle (56px ↔ 240px),
          state persisted to localStorage ("nexva:sidebar:collapsed").
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
  Menu,
  X,
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

  // Desktop collapse state (persists). On <md the drawer always renders expanded.
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

  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);
  // Close on Esc
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);
  // Lock body scroll while drawer open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);
  // Close on nav change
  const go = (key: NavKey) => {
    onNavigate(key);
    setMobileOpen(false);
  };

  const VISIBLE = 7;
  const visible = entries.slice(0, VISIBLE);

  // The drawer content is shared between the static (≥md) aside and the mobile overlay.
  // On mobile it renders *expanded* regardless of `collapsed`.
  const renderSidebarContent = (opts: { forceExpanded?: boolean; showClose?: boolean }) => {
    const isExpanded = opts.forceExpanded ? true : !collapsed;
    return (
      <>
        {/* Brand + (collapse toggle on desktop / close on mobile) */}
        <div
          className={cn(
            "flex items-center pt-4 pb-3",
            isExpanded ? "justify-between px-4" : "flex-col gap-2 px-2",
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
              <span className="text-[12px] font-semibold leading-none">N</span>
            </div>
            {isExpanded && (
              <span className="truncate text-[14px] font-semibold tracking-tight text-foreground">
                Nexva.ai
              </span>
            )}
          </div>

          {opts.showClose ? (
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
              className="flex h-7 w-7 items-center justify-center rounded-md text-foreground/60 transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="h-[15px] w-[15px]" strokeWidth={1.5} />
            </button>
          ) : (
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
          )}
        </div>

        {/* New chat */}
        <div className={cn("pb-2", isExpanded ? "px-3" : "px-2")}>
          {isExpanded ? (
            <button
              onClick={() => {
                onNewSession?.();
                setMobileOpen(false);
              }}
              className="group flex w-full items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Plus className="h-[15px] w-[15px]" strokeWidth={1.5} />
              New chat
            </button>
          ) : (
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
          )}
        </div>

        {/* Primary nav */}
        <nav className="flex flex-col gap-0.5 px-2 pt-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === active;

            if (!isExpanded) {
              return (
                <Tooltip key={item.key}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => go(item.key)}
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
                onClick={() => go(item.key)}
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
        {isExpanded && (
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
                            go("chat");
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

        {/* Spacer when collapsed */}
        {!isExpanded && <div className="flex-1" />}

        {/* Footer rows */}
        <div
          className={cn(
            "flex flex-col gap-0.5 border-t border-border",
            isExpanded ? "p-2" : "items-center p-2",
          )}
        >
          <FooterRow
            expanded={isExpanded}
            icon={<HelpCircle className="h-[15px] w-[15px]" strokeWidth={1.5} />}
            label="Help"
            onClick={() => toast("Help center", { description: "Coming soon" })}
          />
          <FooterRow
            expanded={isExpanded}
            icon={<Settings className="h-[15px] w-[15px]" strokeWidth={1.5} />}
            label="Settings"
            onClick={() => toast("Settings", { description: "Coming soon" })}
          />
        </div>
      </>
    );
  };

  return (
    <div className="relative z-10 flex h-[100dvh] w-full overflow-hidden bg-background">
      {/* Static desktop sidebar (≥md) */}
      <aside
        className={cn(
          "sticky top-0 hidden h-[100dvh] shrink-0 flex-col border-r border-border bg-sidebar md:flex",
          "transition-[width] duration-200 ease-out",
          collapsed ? "w-[56px]" : "w-[240px]",
        )}
      >
        {renderSidebarContent({ forceExpanded: false, showClose: false })}
      </aside>

      {/* Mobile drawer (<md) — off-canvas, overlay with backdrop */}
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-foreground/30 backdrop-blur-[2px] transition-opacity duration-200 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-[100dvh] w-[260px] max-w-[82vw] flex-col border-r border-border bg-sidebar shadow-xl md:hidden",
          "transition-transform duration-250 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {renderSidebarContent({ forceExpanded: true, showClose: true })}
      </aside>

      {/* Canvas */}
      <main className="relative flex h-[100dvh] min-h-0 w-full flex-1 flex-col">
        {topBar && (
          <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-background/85 px-3 py-2 backdrop-blur sm:px-6 supports-[backdrop-filter]:bg-background/70">
            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
              className="flex h-8 w-8 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-accent hover:text-foreground md:hidden"
            >
              <Menu className="h-[17px] w-[17px]" strokeWidth={1.5} />
            </button>
            <div className="min-w-0 flex-1">{topBar}</div>
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
  expanded,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  expanded: boolean;
}) {
  if (!expanded) {
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
