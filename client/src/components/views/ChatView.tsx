/*
  ChatView — B&W minimal.
  - Empty state: centered headline + composer + chip row.
  - Brand-new session (user-driven): same as before — sticky composer above the thread.
  - Seeded history session (Gemini-reference layout):
      * TopBar shows the session title (set via onSessionTitleChange prop).
      * Thread is the ONLY scrollable region.
      * Composer is anchored in a non-scrolling footer at the bottom of the canvas.
      * Placeholder switches to "Ask Nexva".
*/

import { useEffect, useState } from "react";
import { ChatComposer } from "@/components/ChatComposer";
import { ChatThread, type ChatMessage } from "@/components/ChatThread";
import { useHistory } from "@/contexts/HistoryContext";
import { MOCK_SESSIONS } from "@/data/mockSessions";
import {
  MessageSquare,
  ImagePlus,
  Search,
  ListChecks,
  MoreHorizontal,
  FileText,
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
  /** Parent (Home) uses this to render the session title in TopBar. */
  onSessionTitleChange?: (title: string | null) => void;
}

export function ChatView({ onChip, onSessionTitleChange }: ChatViewProps) {
  const { addEntry, activeId, setActiveId } = useHistory();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const seeded = activeId ? MOCK_SESSIONS[activeId] : undefined;

  useEffect(() => {
    if (seeded) setMessages(seeded.messages);
    else if (activeId) setMessages([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // Bubble the title up to TopBar while a seeded session is active.
  useEffect(() => {
    if (!onSessionTitleChange) return;
    onSessionTitleChange(seeded ? seeded.title : null);
    return () => onSessionTitleChange(null);
  }, [seeded, onSessionTitleChange]);

  function send(text: string) {
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
      <div className="flex flex-1 items-center justify-center overflow-y-auto px-4 pb-10 sm:px-6 sm:pb-16">
        <div className="w-full max-w-[720px] -mt-4">
          <h1 className="text-center text-[28px] font-semibold leading-[1.1] tracking-tight text-foreground anim-fade-up sm:text-[40px] md:text-[44px]">
            What needs to be done?
          </h1>

          <div className="mt-6 anim-fade-up sm:mt-8" style={{ animationDelay: "80ms" }}>
            <ChatComposer onSubmit={send} />
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

          <div className="mt-6 text-center text-[11px] text-muted-foreground sm:mt-8 sm:text-[12px]">
            Nexva can make mistakes. Verify important information.
          </div>
        </div>
      </div>
    );
  }

  // ---- Seeded (history) session: Gemini-style fixed chrome ----
  if (seeded) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col">
        {/* Thread — the ONLY scrollable region */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ChatThread messages={messages} />
          <div className="h-[160px]" aria-hidden />
        </div>

        {/* Anchored composer (outside the scroll region) */}
        <div className="relative shrink-0">
          <div
            className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-background to-transparent"
            aria-hidden
          />
          <div
            className="bg-background px-3 pb-3 pt-0 sm:px-6 sm:pb-6"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            <div className="mx-auto w-full max-w-[760px]">
              <ChatComposer onSubmit={send} placeholder="Ask Nexva" />
              <div className="mt-2 text-center text-[11px] text-muted-foreground">
                Nexva is AI and can make mistakes.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- User-driven session (sticky composer, page-level scroll inside canvas) ----
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="flex justify-end px-4 pt-2 sm:px-6">
        <button
          onClick={clearSession}
          className="rounded-full border border-border bg-background px-3 py-1 text-[12px] text-foreground/70 hover:text-foreground transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <ChatThread messages={messages} />
        <div className="h-[160px]" aria-hidden />
      </div>

      <div className="relative shrink-0">
        <div
          className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-background to-transparent"
          aria-hidden
        />
        <div
          className="bg-background px-3 pb-3 pt-0 sm:px-6 sm:pb-6"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto w-full max-w-[760px]">
            <ChatComposer onSubmit={send} />
          </div>
        </div>
      </div>
    </div>
  );
}
