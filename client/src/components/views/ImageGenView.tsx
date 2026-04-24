/*
  ImageGenView — Quiet Studio surface for prompt-based image generation.
  Layout: prompt at top, gallery grid below. No real generation backend wired —
  the "generate" action enqueues a placeholder card and shows a toast.
*/

import { useState } from "react";
import { ChatComposer } from "@/components/ChatComposer";
import { toast } from "sonner";
import { Image as ImageIcon, Aperture } from "lucide-react";

interface GenItem {
  id: string;
  prompt: string;
  status: "pending" | "ready";
}

const ASPECT_OPTIONS = ["1:1", "3:2", "16:9", "9:16"] as const;

export function ImageGenView() {
  const [items, setItems] = useState<GenItem[]>([]);
  const [aspect, setAspect] = useState<(typeof ASPECT_OPTIONS)[number]>("1:1");

  function generate(prompt: string) {
    const id = crypto.randomUUID();
    setItems((arr) => [{ id, prompt, status: "pending" }, ...arr]);
    toast("Render queued", { description: prompt });
    setTimeout(() => {
      setItems((arr) => arr.map((it) => (it.id === id ? { ...it, status: "ready" } : it)));
    }, 1400);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between px-8 pt-6">
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Workspace · Image Gen
        </div>
        <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
          {ASPECT_OPTIONS.map((a) => (
            <button
              key={a}
              onClick={() => setAspect(a)}
              className={`rounded-full px-2.5 py-1 font-mono text-[11px] transition-colors ${
                aspect === a
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 w-full max-w-[820px] px-6 anim-fade-up">
        <h2 className="font-serif text-[44px] leading-[1.05] text-foreground">
          Compose with light.
          <br />
          <span className="text-foreground/55">Describe an image and Nexva will render it.</span>
        </h2>

        <div className="mt-8">
          <ChatComposer
            placeholder="A still life of ceramics on a linen tablecloth, soft window light…"
            onSubmit={generate}
          />
        </div>
      </div>

      <div className="mx-auto mt-12 w-full max-w-[1100px] flex-1 px-6 pb-16">
        {items.length === 0 ? (
          <EmptyGallery />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => (
              <GalleryCard key={it.id} item={it} aspect={aspect} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function aspectClass(a: string) {
  switch (a) {
    case "3:2":  return "aspect-[3/2]";
    case "16:9": return "aspect-[16/9]";
    case "9:16": return "aspect-[9/16]";
    default:     return "aspect-square";
  }
}

function GalleryCard({ item, aspect }: { item: GenItem; aspect: string }) {
  return (
    <div className="anim-fade-up overflow-hidden rounded-2xl border border-border bg-card">
      <div
        className={`relative ${aspectClass(aspect)} w-full bg-gradient-to-br from-muted to-accent/40`}
      >
        {item.status === "pending" ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 text-[12px] text-muted-foreground backdrop-blur">
              <Aperture className="h-3.5 w-3.5 animate-pulse" strokeWidth={1.5} />
              Rendering…
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
            <ImageIcon className="h-10 w-10" strokeWidth={1.25} />
          </div>
        )}
      </div>
      <div className="px-4 py-3">
        <div className="line-clamp-2 text-[13px] text-foreground/85">{item.prompt}</div>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {item.status}
        </div>
      </div>
    </div>
  );
}

function EmptyGallery() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/40 px-8 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background">
        <ImageIcon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <div className="mt-4 font-serif text-[22px] text-foreground">No renders yet</div>
      <div className="mx-auto mt-2 max-w-[420px] text-[13px] text-muted-foreground">
        Your generated images will appear here in a clean grid. Start with a descriptive prompt above.
      </div>
    </div>
  );
}
