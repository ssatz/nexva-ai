/*
  TasksView — B&W minimal, Runable-style centered hero with a tasks list.
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

interface TasksViewProps {
  onSubmitPrompt?: (value: string) => void;
}

export function TasksView({ onSubmitPrompt }: TasksViewProps = {}) {
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);

  function add(title: string) {
    onSubmitPrompt?.(title);
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
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-4 pt-5 sm:px-6">
        <div className="text-[12px] font-medium text-foreground/70">Nexva.ai · Tasks</div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[11px] text-muted-foreground">
          <ListChecks className="h-3 w-3" strokeWidth={1.5} />
          <span className="font-mono">
            {tasks.filter((t) => t.status === "scheduled").length} scheduled
          </span>
        </div>
      </div>

      <div className="mx-auto mt-10 w-full max-w-[720px] px-4 anim-fade-up sm:mt-20 sm:px-6">
        <h2 className="text-center text-[26px] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-[36px] md:text-[40px]">
          Schedule a task in plain language.
        </h2>
        <div className="mt-7">
          <ChatComposer
            placeholder="Email me a summary of new AI papers every Monday at 8am"
            onSubmit={add}
          />
        </div>
      </div>

      <div className="mx-auto mt-8 w-full max-w-[760px] flex-1 px-4 pb-10 sm:mt-12 sm:px-6 sm:pb-16">
        <div className="mb-3 flex items-baseline justify-between border-b border-border pb-3">
          <div className="text-[13px] font-medium text-foreground">Your tasks</div>
          <div className="font-mono text-[11px] text-muted-foreground">
            {tasks.length} total
          </div>
        </div>

        <ul className="flex flex-col">
          {tasks.map((t) => (
            <li
              key={t.id}
              className={cn(
                "anim-fade-up flex items-start gap-4 border-b border-border px-1 py-4 transition-opacity",
                t.status !== "scheduled" && "opacity-50",
              )}
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                {t.cadence.toLowerCase().includes("recurring") ||
                t.cadence.toLowerCase().includes("weekly") ||
                t.cadence.toLowerCase().includes("daily") ? (
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
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
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
