/*
  SearchView — B&W minimal, Runable-style centered hero with mock results.
*/

import { useState } from "react";
import { ChatComposer } from "@/components/ChatComposer";
import { Globe, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

const MOCK_RESULTS: SearchResult[] = [
  {
    title: "The case for quiet software",
    url: "https://example.com/quiet-software",
    snippet:
      "Software that fades into the background lets the user's intent take center stage. A look at design movements that prize restraint over spectacle.",
    source: "essays.example.com",
  },
  {
    title: "How LLM workspaces are converging on a single layout",
    url: "https://example.com/llm-workspaces",
    snippet:
      "From ChatGPT to Loveart, every assistant tool is settling on the same UI primitives: collapsible rail, central canvas, anchored composer.",
    source: "design.example.com",
  },
  {
    title: "Editorial typography in product UI",
    url: "https://example.com/editorial-type",
    snippet:
      "Pairing a serif display face with a neutral grotesk gives software an editorial quality without sacrificing readability at small sizes.",
    source: "type.example.com",
  },
];

export function SearchView() {
  const [query, setQuery] = useState<string | null>(null);

  function search(q: string) {
    setQuery(q);
    toast("Searching the web", { description: q });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between px-6 pt-5">
        <div className="text-[12px] font-medium text-foreground/70">Nexva.ai · Search</div>
        <button className="rounded-full border border-border bg-background px-3 py-1 text-[12px] text-foreground/80 hover:bg-accent transition-colors">
          Upgrade
        </button>
      </div>

      <div className="mx-auto mt-20 w-full max-w-[720px] px-6 anim-fade-up">
        <h2 className="text-center text-[36px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[40px]">
          Ask the web a question.
        </h2>

        <div className="mt-7">
          <ChatComposer
            placeholder="Search the web — try 'latest research on quiet UX'"
            onSubmit={search}
          />
        </div>
      </div>

      <div className="mx-auto mt-12 w-full max-w-[760px] flex-1 px-6 pb-16">
        {query === null ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 px-8 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background">
              <Globe className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <div className="mt-4 text-[18px] font-semibold text-foreground">No queries yet</div>
            <div className="mx-auto mt-2 max-w-[420px] text-[13px] text-muted-foreground">
              Results appear as a clean ranked list with the source domain and a short snippet.
            </div>
          </div>
        ) : (
          <div className="anim-fade-up">
            <div className="mb-6 flex items-baseline justify-between border-b border-border pb-3">
              <div className="text-[13px] text-muted-foreground">
                Results for{" "}
                <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span>
              </div>
              <div className="font-mono text-[11px] text-muted-foreground">
                {MOCK_RESULTS.length} sources
              </div>
            </div>

            <ol className="flex flex-col gap-1">
              {MOCK_RESULTS.map((r, i) => (
                <li
                  key={r.url}
                  className="group rounded-xl border border-transparent px-4 py-4 transition-colors hover:border-border hover:bg-card"
                >
                  <div className="flex items-baseline gap-3 text-[11px] text-muted-foreground">
                    <span className="font-mono">{String(i + 1).padStart(2, "0")}</span>
                    <span>{r.source}</span>
                  </div>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 flex items-center gap-2 text-[16px] font-medium text-foreground hover:underline transition-colors"
                  >
                    {r.title}
                    <ExternalLink
                      className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      strokeWidth={1.5}
                    />
                  </a>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                    {r.snippet}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
