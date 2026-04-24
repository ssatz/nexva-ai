/*
  ImageGenView — B&W minimal, Runable-style centered hero with a chip-based
  aspect selector below the composer. Generated cards are monochrome.
*/

import { useState } from "react";
import { ChatComposer } from "@/components/ChatComposer";
import { toast } from "sonner";
import { Image as ImageIcon, Aperture } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenItem {
  id: string;
  prompt: string;
  status: "pending" | "ready";
}

const ASPECT_OPTIONS = ["1:1", "3:2", "16:9", "9:16"] as const;

interface ImageGenViewProps {
  onSubmitPrompt?: (value: string) => void;
}

export function ImageGenView({ onSubmitPrompt }: ImageGenViewProps = {}) {
  const [items, setItems] = useState<GenItem[]>([]);
  const [aspect, setAspect] = useState<(typeof ASPECT_OPTIONS)[number]>("1:1");

  function generate(prompt: string) {
    onSubmitPrompt?.(prompt);
    const id = crypto.randomUUID();
    setItems((arr) => [{ id, prompt, status: "pending" }, ...arr]);
    toast("Render queued", { description: prompt });
    setTimeout(() => {
      setItems((arr) => arr.map((it) => (it.id === id ? { ...it, status: "ready" } : it)));
    }, 1400);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between px-6 pt-5">
        <div className="text-[12px] font-medium text-foreground/70">Nexva.ai · Image</div>
        <button className="rounded-full border border-border bg-background px-3 py-1 text-[12px] text-foreground/80 hover:bg-accent transition-colors">
          Upgrade
        </button>
      </div>

      <div className="mx-auto mt-20 w-full max-w-[720px] px-6 anim-fade-up">
        <h2 className="text-center text-[36px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[40px]">
          Describe an image to render.
        </h2>

        <div className="mt-7">
          <ChatComposer
            placeholder="A still life of ceramics on a linen tablecloth, soft window light…"
            onSubmit={generate}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {ASPECT_OPTIONS.map((a) => (
            <button
              key={a}
              onClick={() => setAspect(a)}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-[11px] transition-colors",
                aspect === a
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground/70 hover:bg-accent",
              )}
            >
              {a}
            </button>
          ))}
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
      <div className={`relative ${aspectClass(aspect)} w-full bg-muted`}>
        {item.status === "pending" ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-[12px] text-muted-foreground">
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
      <div className="mt-4 text-[18px] font-semibold text-foreground">No renders yet</div>
      <div className="mx-auto mt-2 max-w-[420px] text-[13px] text-muted-foreground">
        Your generated images will appear here in a clean grid.
      </div>
    </div>
  );
}
