/*
  Home — Nexva.ai workspace shell.
  Wraps everything in HistoryProvider (sidebar consumes it) and renders the
  persistent TopBar (credits pill + account dropdown) on every view.
*/

import { useState } from "react";
import { AppShell, type NavKey } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { HistoryProvider, useHistory } from "@/contexts/HistoryContext";
import { ChatView } from "@/components/views/ChatView";
import { ImageGenView } from "@/components/views/ImageGenView";
import { SearchView } from "@/components/views/SearchView";
import { TasksView } from "@/components/views/TasksView";
import { toast } from "sonner";

function HomeInner() {
  const [active, setActive] = useState<NavKey>("chat");
  const [resetTick, setResetTick] = useState(0);
  const { addEntry } = useHistory();

  function newSession() {
    setResetTick((n) => n + 1);
    setActive("chat");
    toast("New session", { description: "Started a clean slate." });
  }

  function handleChip(key: string) {
    if (key === "more") {
      toast("More tools coming soon");
      return;
    }
    if (key === "chat" || key === "image" || key === "search" || key === "tasks") {
      setActive(key);
    }
  }

  // Image / Search / Tasks views also push history entries on submit.
  function logToHistory(prefix: string, value: string) {
    addEntry(`${prefix}: ${value}`);
  }

  return (
    <AppShell
      active={active}
      onNavigate={setActive}
      onNewSession={newSession}
      topBar={<TopBar />}
    >
      {active === "chat"   && <ChatView      key={`chat-${resetTick}`}   onChip={handleChip} />}
      {active === "image"  && <ImageGenView  key={`image-${resetTick}`}  onSubmitPrompt={(v) => logToHistory("Image", v)} />}
      {active === "search" && <SearchView    key={`search-${resetTick}`} onSubmitPrompt={(v) => logToHistory("Search", v)} />}
      {active === "tasks"  && <TasksView     key={`tasks-${resetTick}`}  onSubmitPrompt={(v) => logToHistory("Task", v)} />}
    </AppShell>
  );
}

export default function Home() {
  return (
    <HistoryProvider>
      <HomeInner />
    </HistoryProvider>
  );
}
