/*
  HistoryContext — tiny store for sidebar History.
  - Seeded with mock entries.
  - addEntry(title) pushes a new item to the top.
  - Pure in-memory (no persistence) per the brief.
*/

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export interface HistoryEntry {
  id: string;
  title: string;
  /** ISO string */
  createdAt: string;
}

interface HistoryContextValue {
  entries: HistoryEntry[];
  addEntry: (title: string) => void;
  clear: () => void;
}

const SEED: HistoryEntry[] = [
  { id: "h1", title: "Grok Video Prompt Methods Compared",  createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString()  },
  { id: "h2", title: "Faceless Story Narration: Best Voices", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  { id: "h3", title: "AI Chat Credit Debit Strategy",          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: "h4", title: "Nexva Hero Section Prompt",              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
  { id: "h5", title: "Image Analysis to JSON Prompt",          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString() },
  { id: "h6", title: "AI Character Engine: Consistent Casts",  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString() },
  { id: "h7", title: "Quiet UX patterns in modern assistants", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString() },
];

const HistoryContext = createContext<HistoryContextValue | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<HistoryEntry[]>(SEED);

  const addEntry = useCallback((title: string) => {
    const trimmed = title.trim().replace(/\s+/g, " ");
    if (!trimmed) return;
    const display = trimmed.length > 56 ? trimmed.slice(0, 56) + "…" : trimmed;
    setEntries((prev) => [
      { id: crypto.randomUUID(), title: display, createdAt: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const value = useMemo<HistoryContextValue>(
    () => ({ entries, addEntry, clear }),
    [entries, addEntry, clear],
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

export function useHistory(): HistoryContextValue {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error("useHistory must be used within HistoryProvider");
  return ctx;
}
