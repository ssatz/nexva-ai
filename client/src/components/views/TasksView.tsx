/*
  TasksView — schedule and track recurring/one-off tasks.
  Natural-language input via composer + a clean list of tasks below.
*/

import { useState } from "react";
import { ChatComposer } from "@/components/ChatComposer";
import { ListChecks, Calendar, Repeat, Check, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  cadence: string;
  nextRun: string;
  status: "scheduled" | "done" | "cancelled";
}

const SEED_TASKS: Task[] = [
  {
    id: "t1",
    title: "Brief me on AI funding rounds each Monday morning",
    cadence: "Weekly · Mon 08:00",
    nextRun: "Mon, 28 Apr · 08:00",
    status: "scheduled",
  },
  {
    id: "t2",
    title: "Generate three concept covers for the spring zine",
    cadence: "One-off",
    nextRun: "Today · 18:00",
    status: "scheduled",
  },
];

export function TasksView() {
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);

  function add(title: string) {
    const t: Task = {
      id: crypto.randomUUID(),
      title,
      cadence: title.toLowerCase().match(/(daily|weekly|every|each)/)
        ? "Recurring"
        : "One-off",
      nextRun: "Pending review",
      status: "scheduled",
    };
    setTasks((arr) => [t, ...arr]);
    toast("Task scheduled", { description: title });
  }

  function update(id: string, status: Task["status"]) {
    setTasks((arr) => arr.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between px-8 pt-6">
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Workspace · Tasks
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] text-muted-foreground">
          <ListChecks className="h-3 w-3" strokeWidth={1.5} />
          <span className="font-mono">
            {tasks.filter((t) => t.status === "scheduled").length} scheduled
          </span>
        </div>
      </div>

      <div className="mx-auto mt-12 w-full max-w-[820px] px-6 anim-fade-up">
        <h2 className="font-serif text-[44px] leading-[1.05] text-foreground">
          On a quiet schedule.
          <br />
          <span className="text-foreground/55">Describe a task in plain language.</span>
        </h2>
        <div className="mt-8">
          <ChatComposer
            placeholder="‘Email me a summary of new AI papers every Monday at 8am’"
            onSubmit={add}
          />
        </div>
      </div>

      <div className="mx-auto mt-12 w-full max-w-[820px] flex-1 px-6 pb-16">
        <div className="mb-4 flex items-baseline justify-between">
          <div className="font-serif text-[20px] text-foreground">Your tasks</div>
          <div className="font-mono text-[11px] text-muted-foreground">
            {tasks.length} total
          </div>
        </div>

        <ul className="flex flex-col gap-2">
          {tasks.map((t) => (
            <li
              key={t.id}
              className={cn(
                "anim-fade-up flex items-start gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-opacity",
                t.status !== "scheduled" && "opacity-50",
              )}
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                {t.cadence.toLowerCase().includes("recurring") || t.cadence.toLowerCase().includes("weekly") || t.cadence.toLowerCase().includes("daily") ? (
                  <Repeat className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                ) : (
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                )}
              </div>

              <div className="flex-1">
                <div
                  className={cn(
                    "text-[14px] text-foreground",
                    t.status === "done" && "line-through",
                  )}
                >
                  {t.title}
                </div>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="font-mono uppercase tracking-wider">{t.cadence}</span>
                  <span className="text-border">·</span>
                  <span>Next: {t.nextRun}</span>
                  <span className="text-border">·</span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5",
                      t.status === "scheduled" && "bg-accent text-accent-foreground",
                      t.status === "done" && "bg-muted text-muted-foreground",
                      t.status === "cancelled" && "bg-muted text-muted-foreground",
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {t.status}
                  </span>
                </div>
              </div>

              {t.status === "scheduled" && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => update(t.id, "done")}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    aria-label="Mark done"
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => update(t.id, "cancelled")}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    aria-label="Cancel"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
