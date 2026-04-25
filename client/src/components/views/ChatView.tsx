/*
  ChatView — B&W minimal, Runable-inspired layout.
  - Empty state: centered headline + composer + ToolsStrip + chip row.
  - Active state: scrolling thread with sticky composer + ToolsStrip.
  - Submitting a prompt also appends an entry to the sidebar History.
  - Clicking a History row sets `activeId` in HistoryContext; if that id
    has a canned conversation in MOCK_SESSIONS, hydrate the thread with it
    and show a slim session header above.
*/

import { useEffect, useState } from "react";
import { ChatComposer } from "@/components/ChatComposer";
import { ChatThread, type ChatMessage } from "@/components/ChatThread";
import { ToolsStrip } from "@/components/ToolsStrip";
import { useHistory } from "@/contexts/HistoryContext";
import { MOCK_SESSIONS } from "@/data/mockSessions";
import {
  MessageSquare,
  ImagePlus,
  Search,
  ListChecks,
  MoreHorizontal,
  FileText,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CHIPS = [
  { key: "chat",   label: "Chat",      icon: MessageSquare },
  { key: "image",  label: "Image Gen", icon: ImagePlus },
  { key: "search", label: "Search",    icon: Search },
  { key: "tasks",  label: "Tasks",     icon: ListChecks },
  { key: "pdf",    label: "ChatPDF",   icon: FileText },
  { key: "more",   label: "More",      icon: MoreHorizontal },
];

interface ChatViewProps {
  onChip?: (key: string) => void;
}

export function ChatView({ onChip }: ChatViewProps) {
  const { addEntry, activeId, setActiveId } = useHistory();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Hydrate from a mock session when activeId is set to one of the seeded ids.
  const seeded = activeId ? MOCK_SESSIONS[activeId] : undefined;
  useEffect(() => {
    if (seeded) {
      setMessages(seeded.messages);
    } else if (activeId) {
      // History row without a canned conversation — show empty state with a soft hint.
      setMessages([]);
    }
    // We deliberately depend on activeId, not on `seeded`, to avoid loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  function send(text: string) {
    // First user message in a brand-new session becomes the history title.
    if (messages.length === 0 && !activeId) addEntry(text);
    if (activeId) setActiveId(null); // user is now driving — leave the mock context

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    const pendingId = crypto.randomUUID();
    setMessages((m) => [
      ...m,
      userMsg,
      { id: pendingId, role: "assistant", content: "", pending: true },
    ]);
    setTimeout(() => {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === pendingId
            ? {
                ...msg,
                pending: false,
                content:
                  "This is a preview interface. Connect a model provider to enable live responses — for now, your prompt was:\n\n> " +
                  text,
              }
            : msg,
        ),
      );
    }, 900);
  }

  function clearSession() {
    setMessages([]);
    setActiveId(null);
    toast("Session cleared");
  }

  // ---- Empty state ----
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-[720px] -mt-4">
          <h1 className="text-center text-[40px] font-semibold leading-[1.1] tracking-tight text-foreground anim-fade-up sm:text-[44px]">
            What needs to be done?
          </h1>

          <div className="mt-8 anim-fade-up" style={{ animationDelay: "80ms" }}>
            <ChatComposer onSubmit={send} />
            <ToolsStrip />
          </div>

          <div
            className="mt-5 flex flex-wrap items-center justify-center gap-2 anim-fade-up"
            style={{ animationDelay: "160ms" }}
          >
            {CHIPS.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.key}
                  onClick={() => onChip?.(c.key)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5",
                    "text-[13px] text-foreground/80 transition-colors duration-150",
                    "hover:bg-accent hover:text-foreground",
                  )}
                >
                  <Icon className="h-[14px] w-[14px]" strokeWidth={1.75} />
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 text-center text-[12px] text-muted-foreground">
            Nexva can make mistakes. Verify important information.
          </div>
        </div>
      </div>
    );
  }

  // ---- With messages ----
  return (
    <div className="relative flex flex-1 flex-col">
      {/* Session header */}
      {seeded && (
        <div className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <div className="mx-auto flex w-full max-w-[720px] items-start justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground/70">
                  <Sparkles className="h-3 w-3" strokeWidth={1.5} />
                  Mock preview
                </span>
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                  · 6 messages
                </span>
              </div>
              <h2 className="mt-1 truncate text-[15px] font-semibold tracking-tight text-foreground">
                {seeded.title}
              </h2>
              {seeded.subtitle && (
                <p className="mt-0.5 line-clamp-1 text-[12.5px] text-muted-foreground">
                  {seeded.subtitle}
                </p>
              )}
            </div>
            <button
              onClick={clearSession}
              aria-label="Close session"
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      )}

      {!seeded && (
        <div className="flex justify-end px-6 pt-1">
          <button
            onClick={clearSession}
            className="rounded-full border border-border bg-background px-3 py-1 text-[12px] text-foreground/70 hover:text-foreground transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-[200px]">
        <ChatThread messages={messages} />
      </div>

      <div className="pointer-events-none sticky bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-10 pb-6">
        <div className="pointer-events-auto mx-auto w-full max-w-[720px] px-6">
          <ChatComposer
            onSubmit={send}
            placeholder={seeded ? "Continue this conversation…" : undefined}
          />
          <ToolsStrip />
        </div>
      </div>
    </div>
  );
}
