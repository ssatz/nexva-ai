/*
  HistoryContext — sidebar History store.
  - Seeded with mock entries.
  - addEntry(title) pushes a new item to the top.
  - activeId / setActiveId let any view (Chat) react when a history row is clicked.
*/

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface HistoryEntry {
  id: string;
  title: string;
  /** ISO string */
  createdAt: string;
}

interface HistoryContextValue {
  entries: HistoryEntry[];
  addEntry: (title: string) => string; // returns the new entry's id
  clear: () => void;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

const SEED: HistoryEntry[] = [
  { id: "h1", title: "Grok Video Prompt Methods Compared",  createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString() },
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
  const [activeId, setActiveId] = useState<string | null>(null);

  const addEntry = useCallback((title: string) => {
    const trimmed = title.trim().replace(/\s+/g, " ");
    const id = crypto.randomUUID();
    if (!trimmed) return id;
    const display = trimmed.length > 56 ? trimmed.slice(0, 56) + "…" : trimmed;
    setEntries((prev) => [
      { id, title: display, createdAt: new Date().toISOString() },
      ...prev,
    ]);
    return id;
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const value = useMemo<HistoryContextValue>(
    () => ({ entries, addEntry, clear, activeId, setActiveId }),
    [entries, addEntry, clear, activeId],
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}

export function useHistory(): HistoryContextValue {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error("useHistory must be used within HistoryProvider");
  return ctx;
}
