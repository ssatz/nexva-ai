/*
  ChatView — B&W minimal, Runable-inspired layout.
  Empty state: vertically centered headline ("What needs to be done?")
  with composer right below and a row of feature chips beneath that.
  When messages exist, switch to a scrolling thread with sticky composer.
*/

import { useState } from "react";
import { ChatComposer } from "@/components/ChatComposer";
import { ChatThread, type ChatMessage } from "@/components/ChatThread";
import {
  MessageSquare,
  ImagePlus,
  Search,
  ListChecks,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CHIPS = [
  { key: "chat",   label: "Chat",      icon: MessageSquare },
  { key: "image",  label: "Image Gen", icon: ImagePlus },
  { key: "search", label: "Search",    icon: Search },
  { key: "tasks",  label: "Tasks",     icon: ListChecks },
  { key: "more",   label: "More",      icon: MoreHorizontal },
];

interface ChatViewProps {
  onChip?: (key: string) => void;
}

export function ChatView({ onChip }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  function send(text: string) {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
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

  // ---- Empty state: Runable-style centered hero ----
  if (messages.length === 0) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <TopBar />

        <div className="flex flex-1 items-center justify-center px-6">
          <div className="w-full max-w-[720px] -mt-12">
            <h1 className="text-center text-[40px] font-semibold leading-[1.1] tracking-tight text-foreground anim-fade-up sm:text-[44px]">
              What needs to be done?
            </h1>

            <div
              className="mt-8 anim-fade-up"
              style={{ animationDelay: "80ms" }}
            >
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

            <div className="mt-8 text-center text-[12px] text-muted-foreground">
              Nexva can make mistakes. Verify important information.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- With messages: scrolling thread + sticky composer ----
  return (
    <div className="relative flex min-h-screen flex-col">
      <TopBar
        right={
          <button
            onClick={() => {
              setMessages([]);
              toast("Session cleared");
            }}
            className="rounded-full border border-border bg-background px-3 py-1 text-[12px] text-foreground/70 hover:text-foreground transition-colors"
          >
            Clear
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-[180px]">
        <ChatThread messages={messages} />
      </div>

      <div className="pointer-events-none sticky bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-10 pb-6">
        <div className="pointer-events-auto mx-auto w-full max-w-[720px] px-6">
          <ChatComposer onSubmit={send} />
        </div>
      </div>
    </div>
  );
}

function TopBar({ right }: { right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-6 pt-5">
      <div className="text-[12px] font-medium text-foreground/70">Nexva.ai</div>
      <div className="flex items-center gap-2">
        {right}
        <button className="rounded-full border border-border bg-background px-3 py-1 text-[12px] text-foreground/80 hover:bg-accent transition-colors">
          Upgrade
        </button>
      </div>
    </div>
  );
}
