/*
  ChatThread — B&W minimal conversation rendering.
*/

import { Streamdown } from "streamdown";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChatRole = "user" | "assistant";
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  pending?: boolean;
}

export function ChatThread({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-4 py-6 sm:gap-7 sm:py-10">
      {messages.map((m) => (
        <div key={m.id} className="anim-fade-up">
          <div
            className={cn(
              "mb-2 text-[11px] font-medium uppercase tracking-wider",
              m.role === "user" ? "text-muted-foreground" : "text-foreground/80",
            )}
          >
            {m.role === "user" ? "You" : "Nexva"}
          </div>

          {m.role === "user" ? (
            <div className="rounded-2xl border border-border bg-card px-4 py-3 text-[14.5px] leading-relaxed text-foreground sm:px-5 sm:py-3.5 sm:text-[15px]">
              {m.content}
            </div>
          ) : (
            <div className="text-[14.5px] leading-[1.7] text-foreground/90 sm:text-[15px]">
              {m.pending ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                  <span className="text-[13px]">Thinking…</span>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none prose-neutral">
                  <Streamdown>{m.content}</Streamdown>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
