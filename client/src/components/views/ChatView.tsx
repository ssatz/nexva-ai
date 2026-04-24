/*
  ChatView — Quiet Studio home/landing for the Chat workspace.
  - Greeting on the upper-third (serif), starter prompts in the middle.
  - Composer anchored on the lower-third (golden ratio).
  - When messages exist, the composer becomes a sticky shelf and the
    canvas scrolls the thread above it.
*/

import { useMemo, useState } from "react";
import { ChatComposer } from "@/components/ChatComposer";
import { ChatThread, type ChatMessage } from "@/components/ChatThread";
import { Sparkles, Code2, FileText, Lightbulb } from "lucide-react";
import { toast } from "sonner";

const STARTERS = [
  { icon: Sparkles,  label: "Draft a launch announcement for a minimalist note app" },
  { icon: Lightbulb, label: "Brainstorm five names for a slow-living newsletter" },
  { icon: FileText,  label: "Summarize this week's AI research highlights" },
  { icon: Code2,     label: "Refactor a React component to use TanStack Query" },
];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5)  return "Still up?";
  if (h < 12) return "Good morning.";
  if (h < 17) return "Good afternoon.";
  if (h < 22) return "Good evening.";
  return "Late night again?";
}

export function ChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const hello = useMemo(greeting, []);

  function send(text: string) {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    const pendingId = crypto.randomUUID();
    const pendingMsg: ChatMessage = {
      id: pendingId,
      role: "assistant",
      content: "",
      pending: true,
    };
    setMessages((m) => [...m, userMsg, pendingMsg]);

    // Local mock reply (no backend wired yet)
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

  // ---- Empty state: chat-first hero ----
  if (messages.length === 0) {
    return (
      <div className="relative flex min-h-screen flex-col">
        {/* Top quiet header */}
        <div className="flex items-center justify-between px-8 pt-6">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Workspace · Chat
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="font-mono">nexva-1.0 · ready</span>
          </div>
        </div>

        {/* Greeting block — upper third */}
        <div className="mx-auto mt-[14vh] w-full max-w-[760px] px-6 anim-fade-up">
          <h1 className="font-serif text-[56px] leading-[1.04] text-foreground sm:text-[64px]">
            {hello}
            <br />
            <span className="text-foreground/55">What shall we make?</span>
          </h1>
          <p className="mt-5 max-w-[520px] text-[14px] leading-relaxed text-muted-foreground">
            Nexva is a quiet workspace for thinking with AI — chat, generate, search the web,
            and schedule recurring tasks. Start with a prompt below.
          </p>
        </div>

        {/* Composer — lower third */}
        <div className="mx-auto mt-auto mb-[14vh] w-full max-w-[760px] px-6">
          <div className="anim-fade-up" style={{ animationDelay: "120ms" }}>
            <ChatComposer onSubmit={send} />
          </div>

          {/* Starter prompts */}
          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {STARTERS.map((s, i) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.label}
                  onClick={() => send(s.label)}
                  className="anim-fade-up group flex items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 text-left text-[13px] text-foreground/80 transition-all duration-200 hover:bg-card hover:text-foreground hover:border-border/100"
                  style={{ animationDelay: `${200 + i * 40}ms` }}
                >
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" strokeWidth={1.5} />
                  <span className="pencil-underline">{s.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 text-center text-[11px] text-muted-foreground/80">
            Nexva can make mistakes. Verify important information.
          </div>
        </div>
      </div>
    );
  }

  // ---- With messages: scrolling thread + sticky composer ----
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="flex items-center justify-between px-8 pt-6">
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Workspace · Chat
        </div>
        <button
          onClick={() => {
            setMessages([]);
            toast("Session cleared", { description: "Started a fresh conversation." });
          }}
          className="rounded-full border border-border bg-card px-3 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear session
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-[180px]">
        <ChatThread messages={messages} />
      </div>

      <div className="pointer-events-none sticky bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-10 pb-6">
        <div className="pointer-events-auto mx-auto w-full max-w-[760px] px-6">
          <ChatComposer onSubmit={send} />
        </div>
      </div>
    </div>
  );
}
