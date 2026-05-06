/*
  ChatThread — B&W minimal conversation rendering.

  Update (2026-05-05 — message actions):
   - User bubble: hover reveals an action bar with Edit (pencil) + Copy.
       * Edit swaps the bubble for an inline textarea with Cancel / Save.
       * Save calls onEditUser(id, newText) so the parent can branch-replace
         (truncate everything after this user msg + regenerate assistant reply).
   - Assistant bubble: hover reveals Copy + Thumbs up + Thumbs down + Regenerate.
       * Regenerate calls onRegenerate(id), which replays the prior user prompt
         and replaces this assistant message.
   - All actions are subtle, monochrome, and only appear on hover/focus.
*/

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Streamdown } from "streamdown";
import { Loader2, Pencil, Copy, ThumbsUp, ThumbsDown, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type ChatRole = "user" | "assistant";
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  pending?: boolean;
}

interface ChatThreadProps {
  messages: ChatMessage[];
  /** Called when the user saves an edit on their own message. */
  onEditUser?: (id: string, newText: string) => void;
  /** Called when the user clicks Regenerate on an assistant message. */
  onRegenerate?: (assistantId: string) => void;
}

export function ChatThread({ messages, onEditUser, onRegenerate }: ChatThreadProps) {
  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-4 py-6 sm:gap-7 sm:py-10">
      {messages.map((m) => (
        <div key={m.id} className="anim-fade-up group">
          <div
            className={cn(
              "mb-2 text-[11px] font-medium uppercase tracking-wider",
              m.role === "user" ? "text-muted-foreground" : "text-foreground/80",
            )}
          >
            {m.role === "user" ? "You" : "Nexva"}
          </div>

          {m.role === "user" ? (
            <UserBubble message={m} onEditUser={onEditUser} />
          ) : (
            <AssistantBubble message={m} onRegenerate={onRegenerate} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  USER BUBBLE — view + edit modes                                  */
/* ---------------------------------------------------------------- */

function UserBubble({
  message,
  onEditUser,
}: {
  message: ChatMessage;
  onEditUser?: (id: string, newText: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  // Reset the draft whenever the source message changes (e.g. parent re-render).
  useEffect(() => {
    if (!editing) setDraft(message.content);
  }, [message.content, editing]);

  // Auto-grow + autofocus
  useEffect(() => {
    if (!editing) return;
    const ta = taRef.current;
    if (!ta) return;
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
    autosize(ta);
  }, [editing]);

  function autosize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = Math.min(320, el.scrollHeight) + "px";
  }

  function commit() {
    const next = draft.trim();
    if (!next || next === message.content.trim()) {
      setEditing(false);
      return;
    }
    onEditUser?.(message.id, next);
    setEditing(false);
  }

  function cancel() {
    setDraft(message.content);
    setEditing(false);
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      commit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  }

  if (editing) {
    return (
      <div className="rounded-2xl border border-border bg-card px-4 pt-3 pb-2 sm:px-5">
        <textarea
          ref={taRef}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            autosize(e.currentTarget);
          }}
          onKeyDown={handleKey}
          rows={1}
          className={cn(
            "block w-full resize-none border-0 bg-transparent p-0",
            "text-[14.5px] leading-relaxed text-foreground sm:text-[15px]",
            "placeholder:text-muted-foreground focus:outline-none",
          )}
        />
        <div className="mt-2 flex items-center justify-end gap-2 border-t border-border/60 pt-2">
          <button
            type="button"
            onClick={cancel}
            className="rounded-full px-3 py-1.5 text-[13px] text-foreground/70 transition-colors hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={commit}
            className={cn(
              "rounded-full bg-foreground px-4 py-1.5 text-[13px] font-medium text-background",
              "transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]",
            )}
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl border border-border bg-card px-4 py-3 text-[14.5px] leading-relaxed text-foreground sm:px-5 sm:py-3.5 sm:text-[15px] whitespace-pre-wrap">
        {message.content}
      </div>
      <ActionBar align="end">
        <ActionIcon
          ariaLabel="Edit message"
          icon={Pencil}
          onClick={() => setEditing(true)}
        />
        <CopyButton text={message.content} />
      </ActionBar>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  ASSISTANT BUBBLE — content + action bar                          */
/* ---------------------------------------------------------------- */

function AssistantBubble({
  message,
  onRegenerate,
}: {
  message: ChatMessage;
  onRegenerate?: (assistantId: string) => void;
}) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  if (message.pending) {
    return (
      <div className="text-[14.5px] leading-[1.7] text-foreground/90 sm:text-[15px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
          <span className="text-[13px]">Thinking…</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-[14.5px] leading-[1.7] text-foreground/90 sm:text-[15px]">
        <div className="prose prose-sm max-w-none prose-neutral">
          <Streamdown>{message.content}</Streamdown>
        </div>
      </div>
      <ActionBar align="start">
        <CopyButton text={message.content} />
        <ActionIcon
          ariaLabel="Good response"
          icon={ThumbsUp}
          active={vote === "up"}
          onClick={() => {
            setVote((v) => (v === "up" ? null : "up"));
            toast("Thanks for the feedback");
          }}
        />
        <ActionIcon
          ariaLabel="Bad response"
          icon={ThumbsDown}
          active={vote === "down"}
          onClick={() => {
            setVote((v) => (v === "down" ? null : "down"));
            toast("Thanks for the feedback");
          }}
        />
        <ActionIcon
          ariaLabel="Regenerate response"
          icon={RotateCcw}
          onClick={() => {
            onRegenerate?.(message.id);
          }}
        />
      </ActionBar>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Shared action UI                                                  */
/* ---------------------------------------------------------------- */

function ActionBar({
  children,
  align,
}: {
  children: React.ReactNode;
  align: "start" | "end";
}) {
  return (
    <div
      className={cn(
        "mt-1.5 flex items-center gap-0.5 text-foreground/60",
        "opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100",
        align === "end" ? "justify-end" : "justify-start",
      )}
    >
      {children}
    </div>
  );
}

function ActionIcon({
  icon: Icon,
  ariaLabel,
  onClick,
  active = false,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  ariaLabel: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={onClick}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-full",
        "transition-colors duration-150",
        active
          ? "bg-foreground/10 text-foreground"
          : "hover:bg-foreground/5 hover:text-foreground",
      )}
    >
      <Icon className="h-[14px] w-[14px]" strokeWidth={1.6} />
    </button>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label="Copy"
      title="Copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          toast("Copied to clipboard");
          setTimeout(() => setCopied(false), 1200);
        } catch {
          toast("Couldn't copy", { description: "Clipboard access was blocked." });
        }
      }}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-full",
        "text-foreground/60 transition-colors duration-150",
        "hover:bg-foreground/5 hover:text-foreground",
      )}
    >
      {copied ? (
        <Check className="h-[14px] w-[14px]" strokeWidth={1.8} />
      ) : (
        <Copy className="h-[14px] w-[14px]" strokeWidth={1.6} />
      )}
    </button>
  );
}
