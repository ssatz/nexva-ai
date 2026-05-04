/*
  SearchView — repurposed as the "My Chats" page.

  Strict B&W minimal layout matching the user's reference:
   - Title "My Chats" with a dark filled "+ Create new" split button (caret divider).
   - Pill-shaped search input with leading magnifier and trailing filter icon.
   - "{N} Chats   Select" subtitle row.
   - Hairline-divided list rows: bold title + small relative time underneath.
   - Hover state: light gray background + right-side kebab (Rename/Export/Delete).
   - Click a row: hydrates the conversation in Chat view via HistoryContext.
   - Empty state when nothing matches the query.

  This view consumes the existing HistoryContext (no schema change required).
  The `onSubmitPrompt` prop is kept for backward-compat with Home, but it's
  unused here because the page no longer takes a prompt input.
*/

import { useMemo, useState } from "react";
import {
  Search as SearchIcon,
  SlidersHorizontal,
  Plus,
  ChevronDown,
  MoreVertical,
  Pencil,
  Download,
  Trash2,
  MessageSquareText,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useHistory } from "@/contexts/HistoryContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchViewProps {
  /** Kept for backward-compat with Home wiring; unused in My Chats page. */
  onSubmitPrompt?: (value: string) => void;
  /** Optional: jump back to Chat view after opening a row. */
  onOpenChat?: () => void;
}

export function SearchView({ onOpenChat }: SearchViewProps = {}) {
  const { entries, setActiveId } = useHistory();
  const [query, setQuery] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.title.toLowerCase().includes(q));
  }, [entries, query]);

  function openChat(id: string) {
    if (selectMode) {
      setSelected((s) => {
        const next = new Set(s);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
      });
      return;
    }
    setActiveId(id);
    onOpenChat?.();
  }

  function toggleSelectMode() {
    setSelectMode((v) => {
      const next = !v;
      if (!next) setSelected(new Set());
      return next;
    });
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-[760px] px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-[28px] font-semibold tracking-tight text-foreground sm:text-[32px]">
            My Chats
          </h1>
          <CreateNewSplitButton />
        </div>

        {/* Search + filter row */}
        <div className="mt-6 flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon
              className="pointer-events-none absolute left-4 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.6}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chats..."
              className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-9 text-[13.5px] text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.6} />
              </button>
            )}
          </div>
          <button
            onClick={() => toast("Filters", { description: "Coming soon" })}
            aria-label="Filter chats"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground/75 transition-colors hover:bg-accent hover:text-foreground"
          >
            <SlidersHorizontal className="h-[15px] w-[15px]" strokeWidth={1.6} />
          </button>
        </div>

        {/* Count + Select */}
        <div className="mt-5 flex items-center gap-2 text-[13px]">
          <span className="text-foreground">
            {filtered.length} {filtered.length === 1 ? "Chat" : "Chats"}
          </span>
          <button
            onClick={toggleSelectMode}
            className={cn(
              "rounded-md px-1.5 py-0.5 text-[13px] font-medium transition-colors",
              selectMode
                ? "text-foreground"
                : "text-foreground/70 hover:text-foreground",
            )}
          >
            {selectMode ? "Done" : "Select"}
          </button>
          {selectMode && selected.size > 0 && (
            <span className="ml-2 text-[12px] text-muted-foreground">
              {selected.size} selected
            </span>
          )}
        </div>

        {/* List */}
        <div className="mt-3">
          {filtered.length === 0 ? (
            <EmptyState query={query} />
          ) : (
            <ul className="flex flex-col">
              {filtered.map((entry, i) => (
                <ChatRow
                  key={entry.id}
                  title={entry.title}
                  ts={entry.createdAt}
                  isFirst={i === 0}
                  selectMode={selectMode}
                  selected={selected.has(entry.id)}
                  onClick={() => openChat(entry.id)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Sub-components --------------------------- */

function CreateNewSplitButton() {
  return (
    <div className="flex items-stretch overflow-hidden rounded-full bg-foreground text-background shadow-sm">
      <button
        onClick={() => toast("Create new chat", { description: "Coming soon" })}
        className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium hover:opacity-90"
      >
        <Plus className="h-[14px] w-[14px]" strokeWidth={2} />
        Create new
      </button>
      <div className="my-1.5 w-px bg-background/25" />
      <button
        onClick={() => toast("More options", { description: "Coming soon" })}
        aria-label="More create options"
        className="inline-flex items-center justify-center px-2.5 hover:opacity-90"
      >
        <ChevronDown className="h-[14px] w-[14px]" strokeWidth={2} />
      </button>
    </div>
  );
}

function ChatRow({
  title,
  ts,
  isFirst,
  selectMode,
  selected,
  onClick,
}: {
  title: string;
  ts: string;
  isFirst: boolean;
  selectMode: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <li className={cn("group", !isFirst && "border-t border-border/70")}>
      <div
        className={cn(
          "relative flex items-center gap-3 rounded-lg px-3 py-3.5 transition-colors",
          "hover:bg-muted/60",
          selected && "bg-muted/80",
        )}
      >
        {selectMode && (
          <span
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
              selected
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background",
            )}
          >
            {selected && <span className="text-[10px] leading-none">✓</span>}
          </span>
        )}

        <button onClick={onClick} className="min-w-0 flex-1 text-left">
          <div className="truncate text-[14.5px] font-semibold text-foreground">
            {title}
          </div>
          <div className="mt-1 text-[12px] text-muted-foreground">
            {formatRelative(ts)}
          </div>
        </button>

        <RowKebab title={title} />
      </div>
    </li>
  );
}

function RowKebab({ title }: { title: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={`Actions for ${title}`}
          onClick={(e) => e.stopPropagation()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-foreground group-hover:opacity-100 data-[state=open]:opacity-100"
        >
          <MoreVertical className="h-[15px] w-[15px]" strokeWidth={1.6} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => toast("Rename", { description: "Coming soon" })}>
          <Pencil className="mr-2 h-3.5 w-3.5" strokeWidth={1.6} />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast("Export", { description: "Coming soon" })}>
          <Download className="mr-2 h-3.5 w-3.5" strokeWidth={1.6} />
          Export
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => toast("Delete", { description: "Coming soon" })}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" strokeWidth={1.6} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="mt-2 flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/40 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background">
        <MessageSquareText className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <div className="mt-4 text-[16px] font-semibold text-foreground">
        {query ? "No chats match" : "No chats yet"}
      </div>
      <div className="mx-auto mt-1.5 max-w-[360px] text-[13px] text-muted-foreground">
        {query
          ? "Try a different query, or clear the search to see every chat."
          : "Start a new conversation and it will show up here."}
      </div>
    </div>
  );
}

/* --------------------------- helpers --------------------------- */

function formatRelative(iso: string): string {
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return "";
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 45) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} ${min === 1 ? "minute" : "minutes"} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} ${hr === 1 ? "hour" : "hours"} ago`;
  const day = Math.floor(hr / 24);
  if (day < 7)  return `${day} ${day === 1 ? "day" : "days"} ago`;
  const wk = Math.floor(day / 7);
  if (wk < 5)   return `${wk} ${wk === 1 ? "week" : "weeks"} ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12)  return `${mo} ${mo === 1 ? "month" : "months"} ago`;
  const yr = Math.floor(day / 365);
  return `${yr} ${yr === 1 ? "year" : "years"} ago`;
}
