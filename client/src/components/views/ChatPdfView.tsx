/*
  ChatPdfView — B&W minimal port of the old ChatPDF screens.

  Two screens:
   1) Empty state — "Document Intelligence" hero with dashed upload zone
      and a Recent Documents list below.
   2) Active state — two-pane workspace: PDF list on the left, chat with
      the selected file on the right.

  Frontend layout only (per brief). No PDF parsing wired.
*/

import { useEffect, useRef, useState, type DragEvent } from "react";
import {
  Upload,
  FileText,
  Plus,
  Search as SearchIcon,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Mic,
  ArrowUp,
  Box,
  Clock,
} from "lucide-react";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PdfDoc {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
}

interface PdfMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SEED_DOCS: PdfDoc[] = [
  { id: "p1", name: "Nexva_content_1.pdf",        size: "412 KB", uploadedAt: "2026-04-25" },
  { id: "p2", name: "AI_Character_Engine.pdf",    size: "1.2 MB", uploadedAt: "2026-04-25" },
];

const SEED_REPLY = `The document presents a comprehensive overview of Nexva.ai's Chat PDF tool, highlighting its key features, benefits, and various use cases aimed at enhancing document analysis and interaction through AI technology.

### Overview of the Tool
Nexva.ai's Chat PDF tool is designed to facilitate instant interaction with PDF documents, allowing users to upload, analyze, and extract data from large files quickly.

### Key Features
1. **No file size limits** — handle PDFs larger than 100 pages without typical errors.
2. **Multimodal extraction** — pulls text, tables, and figure captions in one pass.
3. **Cited answers** — every response links back to the source page.
`;

export function ChatPdfView() {
  const [docs, setDocs] = useState<PdfDoc[]>(SEED_DOCS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [messages, setMessages] = useState<Record<string, PdfMessage[]>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  function pickFile() {
    fileInputRef.current?.click();
  }

  function ingestFile(file: File) {
    const doc: PdfDoc = {
      id: crypto.randomUUID(),
      name: file.name,
      size: humanSize(file.size),
      uploadedAt: new Date().toISOString().slice(0, 10),
    };
    setDocs((arr) => [doc, ...arr]);
    setActiveId(doc.id);
    toast("PDF uploaded", { description: `${doc.name} · preview only` });
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) ingestFile(file);
    e.target.value = "";
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) ingestFile(file);
  }

  function deleteDoc(id: string) {
    setDocs((arr) => arr.filter((d) => d.id !== id));
    if (activeId === id) setActiveId(null);
  }

  const active = docs.find((d) => d.id === activeId) ?? null;
  const filtered = docs.filter((d) =>
    d.name.toLowerCase().includes(filter.toLowerCase()),
  );

  // Hidden file input is shared across both screens
  const hiddenInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept=".pdf,.docx,.txt"
      onChange={onFileChange}
      className="hidden"
    />
  );

  if (!active) {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto px-4 pt-6 pb-16 sm:px-6">
        {hiddenInput}
        <UploadHero onSelect={pickFile} onDrop={onDrop} />
        <RecentDocs docs={docs} onOpen={setActiveId} onDelete={deleteDoc} onAdd={pickFile} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {hiddenInput}

      {/* Sub top-bar */}
      <div className="flex items-center justify-between px-4 pt-2 pb-3 sm:px-6">
        <button
          onClick={() => setActiveId(null)}
          className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-[12px] text-foreground/80 transition-colors hover:bg-accent"
        >
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          All documents
        </button>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Box className="h-3 w-3" strokeWidth={1.5} />
          <span className="font-mono">nexva-1.0 · pdf</span>
        </div>
      </div>

      {/* Two panes — stacked on mobile, side-by-side on ≥md */}
      <div className="flex min-h-0 flex-1 flex-col gap-3 px-3 pb-3 md:flex-row">
        <PdfList
          docs={filtered}
          activeId={activeId}
          onPick={setActiveId}
          onDelete={deleteDoc}
          onAdd={pickFile}
          filter={filter}
          setFilter={setFilter}
        />
        <PdfChat
          doc={active}
          messages={messages[active.id] ?? []}
          setMessages={(updater) =>
            setMessages((m) => ({ ...m, [active.id]: updater(m[active.id] ?? []) }))
          }
        />
      </div>
    </div>
  );
}

/* ─────────────────────────── Empty state ─────────────────────────── */

function UploadHero({
  onSelect,
  onDrop,
}: {
  onSelect: () => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div className="mx-auto w-full max-w-[860px] anim-fade-up">
      <div className="text-center">
        <h2 className="text-[36px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[40px]">
          Document Intelligence
        </h2>
        <p className="mx-auto mt-3 max-w-[520px] text-[14px] leading-relaxed text-muted-foreground">
          Upload your PDF and unlock instant insights, summaries, and Q&amp;A with our advanced
          AI models.
        </p>
      </div>

      <div
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setHover(true);
        }}
        onDragLeave={() => setHover(false)}
        onClick={onSelect}
        role="button"
        tabIndex={0}
        className={cn(
          "mt-9 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed",
          "px-6 py-14 text-center transition-colors duration-150",
          hover ? "border-foreground bg-accent/40" : "border-border bg-card/40 hover:bg-accent/30",
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background">
          <Upload className="h-5 w-5 text-foreground/70" strokeWidth={1.5} />
        </div>
        <div className="mt-4 text-[18px] font-semibold text-foreground">
          Click to upload or drag and drop
        </div>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          PDF, DOCX, or TXT · up to 100MB
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 text-[12px] font-medium text-background transition-opacity hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          Select File
        </button>
      </div>
    </div>
  );
}

function RecentDocs({
  docs,
  onOpen,
  onDelete,
  onAdd,
}: {
  docs: PdfDoc[];
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="mx-auto mt-12 w-full max-w-[860px]">
      <div className="mb-3 flex items-baseline justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2 text-[13px] font-medium text-foreground">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
          Recent Documents
        </div>
        <button
          onClick={onAdd}
          className="rounded-full border border-border bg-background px-3 py-1 text-[12px] text-foreground/80 hover:bg-accent transition-colors"
        >
          + New
        </button>
      </div>

      {docs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/40 px-6 py-10 text-center text-[13px] text-muted-foreground">
          No documents yet. Upload your first PDF to get started.
        </div>
      ) : (
        <ul className="flex flex-col">
          {docs.map((d) => (
            <li
              key={d.id}
              className="group flex items-center gap-4 border-b border-border px-1 py-3 transition-colors hover:bg-accent/40 rounded"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                <FileText className="h-4 w-4 text-foreground/70" strokeWidth={1.5} />
              </div>
              <button
                onClick={() => onOpen(d.id)}
                className="flex flex-1 items-center justify-between text-left"
              >
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-medium text-foreground">
                    {d.name}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>Processed</span>
                    <span className="text-border">·</span>
                    <span className="font-mono">{d.size}</span>
                    <span className="text-border">·</span>
                    <span>{d.uploadedAt}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => onDelete(d.id)}
                aria-label="Delete"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─────────────────────────── Active state ─────────────────────────── */

function PdfList({
  docs,
  activeId,
  onPick,
  onDelete,
  onAdd,
  filter,
  setFilter,
}: {
  docs: PdfDoc[];
  activeId: string | null;
  onPick: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  filter: string;
  setFilter: (v: string) => void;
}) {
  return (
    <aside className="flex w-full shrink-0 flex-col rounded-2xl border border-border bg-card md:w-[300px]">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background">
          <FileText className="h-4 w-4 text-foreground/70" strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-foreground">PDF Chats</div>
          <div className="text-[11px] text-muted-foreground">{docs.length} documents</div>
        </div>
      </div>

      <div className="px-3 pt-3">
        <button
          onClick={onAdd}
          className="flex w-full items-center justify-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-[12.5px] font-medium text-background transition-opacity hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          Select File
        </button>
      </div>

      <div className="px-3 pt-3">
        <div className="flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5">
          <SearchIcon className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search PDF chats…"
            className="w-full border-0 bg-transparent p-0 text-[12.5px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      <ul className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3 max-h-[240px] md:max-h-none">
        {docs.length === 0 ? (
          <li className="rounded-md px-2 py-3 text-center text-[12px] text-muted-foreground">
            No matches
          </li>
        ) : (
          docs.map((d) => (
            <li key={d.id}>
              <button
                onClick={() => onPick(d.id)}
                className={cn(
                  "group relative flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors",
                  d.id === activeId
                    ? "border-foreground/15 bg-accent"
                    : "border-transparent hover:bg-accent/60",
                )}
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                  <FileText className="h-3.5 w-3.5 text-foreground/70" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-foreground">
                    {d.name}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {d.uploadedAt}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(d.id);
                  }}
                  aria-label="Delete"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-foreground group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </button>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}

function PdfChat({
  doc,
  messages,
  setMessages,
}: {
  doc: PdfDoc;
  messages: PdfMessage[];
  setMessages: (updater: (prev: PdfMessage[]) => PdfMessage[]) => void;
}) {
  const [value, setValue] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [value]);

  // Seed an initial assistant intro per file (only once)
  useEffect(() => {
    if (messages.length === 0) {
      setMessages(() => [
        { id: crypto.randomUUID(), role: "assistant", content: SEED_REPLY },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc.id]);

  function send() {
    const trimmed = value.trim();
    if (!trimmed) return;
    const u: PdfMessage = { id: crypto.randomUUID(), role: "user", content: trimmed };
    const pendingId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      u,
      { id: pendingId, role: "assistant", content: "" },
    ]);
    setValue("");
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId
            ? {
                ...m,
                content:
                  "Connect a backend to enable real PDF Q&A. For now, here's a stub response to your question:\n\n> " +
                  trimmed,
              }
            : m,
        ),
      );
    }, 700);
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card">
      {/* Sub header: model + file pill */}
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-3 sm:px-5">
        <div className="flex items-center gap-2 text-[12px] text-foreground/70 shrink-0">
          <div className="hidden h-5 w-5 items-center justify-center rounded-full border border-border bg-background sm:flex">
            <Box className="h-3 w-3" strokeWidth={1.5} />
          </div>
          <span className="font-mono">nexva-1.0</span>
        </div>
        <div className="flex min-w-0 items-center gap-2 rounded-full border border-border bg-background py-1 pl-2 pr-3">
          <FileText className="h-3.5 w-3.5 shrink-0 text-foreground/70" strokeWidth={1.5} />
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="truncate text-[12px] font-medium text-foreground">{doc.name}</span>
            <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">{doc.size}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-[680px] flex-col gap-7">
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
                <div className="rounded-2xl border border-border bg-background px-5 py-3.5 text-[14.5px] leading-relaxed text-foreground">
                  {m.content}
                </div>
              ) : (
                <div className="prose prose-sm max-w-none prose-neutral text-[14.5px] leading-[1.7]">
                  <Streamdown>{m.content || "…"}</Streamdown>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-border bg-card px-4 py-3">
        <div className="mx-auto max-w-[680px]">
          <div className="input-shelf rounded-2xl">
            <textarea
              ref={taRef}
              rows={1}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask something about your PDF…"
              className="min-h-[40px] w-full resize-none border-0 bg-transparent px-4 pt-3 text-[14px] leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
            />
            <div className="flex items-center justify-between gap-2 px-3 pb-2 pt-1">
              <button
                type="button"
                aria-label="Voice"
                onClick={() => toast("Voice input", { description: "Coming soon" })}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground/70 hover:bg-accent hover:text-foreground transition-colors"
              >
                <Mic className="h-[15px] w-[15px]" strokeWidth={1.75} />
              </button>
              <div className="flex items-center gap-1.5">
                <div className="flex h-8 items-center gap-1.5 rounded-full px-2.5 text-foreground/60">
                  <Box className="h-[15px] w-[15px]" strokeWidth={1.75} />
                  <span className="font-mono text-[11px]">nexva-1.0</span>
                </div>
                <button
                  onClick={send}
                  disabled={!value.trim()}
                  aria-label="Send"
                  className={cn(
                    "ml-1 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-150",
                    value.trim()
                      ? "bg-foreground text-background hover:opacity-90"
                      : "border border-border text-muted-foreground cursor-not-allowed",
                  )}
                >
                  <ArrowUp className="h-[15px] w-[15px]" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Helpers ─────────────────────────── */

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
