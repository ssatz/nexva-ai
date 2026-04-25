/*
  AppShell — ElevenLabs-style 240px expanded sidebar.
  - Top: brand + "New chat" button.
  - Primary nav rows (icon + label): Chat, Image Gen, Search, Tasks.
  - Divider, "History" section header with seeded mock entries + "See all".
  - Footer: small Help / Settings rows.
  - All icons are Lucide outline at stroke 1.5 to match ElevenLabs.
*/

import type { ReactNode } from "react";
import { useState } from "react";
import {
  MessageSquare,
  ImagePlus,
  Search,
  ListChecks,
  Plus,
  Settings,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHistory } from "@/contexts/HistoryContext";
import { toast } from "sonner";

export type NavKey = "chat" | "image" | "search" | "tasks";

const NAV_ITEMS: { key: NavKey; label: string; icon: typeof MessageSquare }[] = [
  { key: "chat",   label: "Chat",       icon: MessageSquare },
  { key: "image",  label: "Image Gen",  icon: ImagePlus },
  { key: "search", label: "Search",     icon: Search },
  { key: "tasks",  label: "Tasks",      icon: ListChecks },
];

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
  const VISIBLE = 7;
  const visible = entries.slice(0, VISIBLE);

  return (
    <div className="relative z-10 flex min-h-screen w-full bg-background">
      {/* Expanded sidebar */}
      <aside className="flex w-[240px] shrink-0 flex-col border-r border-border bg-sidebar">
        {/* Brand */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background">
            <span className="text-[12px] font-semibold leading-none">N</span>
          </div>
          <span className="text-[14px] font-semibold tracking-tight text-foreground">Nexva.ai</span>
        </div>

        {/* New chat */}
        <div className="px-3 pb-2">
          <button
            onClick={onNewSession}
            className="group flex w-full items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Plus className="h-[15px] w-[15px]" strokeWidth={1.5} />
            New chat
          </button>
        </div>

        {/* Primary nav */}
        <nav className="flex flex-col gap-0.5 px-2 pt-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === active;
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

        {/* History */}
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

        {/* Footer rows */}
        <div className="mt-auto flex flex-col gap-0.5 border-t border-border p-2">
          <FooterRow
            icon={<HelpCircle className="h-[15px] w-[15px]" strokeWidth={1.5} />}
            label="Help"
            onClick={() => toast("Help center", { description: "Coming soon" })}
          />
          <FooterRow
            icon={<Settings className="h-[15px] w-[15px]" strokeWidth={1.5} />}
            label="Settings"
            onClick={() => toast("Settings", { description: "Coming soon" })}
          />
        </div>
      </aside>

      {/* Canvas */}
      <main className="relative flex flex-1 flex-col">
        {/* Persistent top bar (account + upgrade) */}
        {topBar && (
          <div className="flex items-center justify-between px-6 pt-4">
            <div className="text-[12px] font-medium text-foreground/60" />
            {topBar}
          </div>
        )}
        <div className="flex flex-1 flex-col">{children}</div>
      </main>
    </div>
  );
}

function FooterRow({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}) {
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
