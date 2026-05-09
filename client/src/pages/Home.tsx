/*
  Home — Nexva.ai workspace shell.
  Tracks `sessionTitle` so ChatView can bubble up the currently-open seeded
  conversation; when present, TopBar flips into session mode (centered title +
  Share + Kebab to the left of the Upgrade pill).
*/

import { useCallback, useState } from "react";
import { AppShell, type NavKey } from "@/components/AppShell";
import { TopBar } from "@/components/TopBar";
import { HistoryProvider, useHistory } from "@/contexts/HistoryContext";
import { ChatView } from "@/components/views/ChatView";
import { ImageGenView } from "@/components/views/ImageGenView";
import { SearchView } from "@/components/views/SearchView";
import { TasksView } from "@/components/views/TasksView";
import { ChatPdfView } from "@/components/views/ChatPdfView";
import { StudioView } from "@/components/views/StudioView";
import { SettingsView } from "@/components/views/SettingsView";
import { toast } from "sonner";

type ViewKey = NavKey | "pdf" | "settings";

function HomeInner() {
  const [active, setActive] = useState<ViewKey>("chat");
  const [resetTick, setResetTick] = useState(0);
  const [sessionTitle, setSessionTitle] = useState<string | null>(null);
  const { addEntry } = useHistory();

  function newSession() {
    setResetTick((n) => n + 1);
    setActive("chat");
    setSessionTitle(null);
    toast("New session", { description: "Started a clean slate." });
  }

  function handleChip(key: string) {
    if (key === "more") {
      toast("More tools coming soon");
      return;
    }
    if (
      key === "chat" ||
      key === "image" ||
      key === "search" ||
      key === "tasks" ||
      key === "pdf" ||
      key === "studio" ||
      key === "settings"
    ) {
      setActive(key as ViewKey);
    }
  }

  function logToHistory(prefix: string, value: string) {
    addEntry(`${prefix}: ${value}`);
  }

  // Stable callback so ChatView's effect doesn't thrash.
  const onSessionTitleChange = useCallback((t: string | null) => {
    setSessionTitle(t);
  }, []);

  return (
    <AppShell
      active={active === "pdf" ? "chat" : active}
      onNavigate={(k) => setActive(k)}
      onNewSession={newSession}
      topBar={
        <TopBar
          title={active === "chat" ? sessionTitle ?? undefined : undefined}
          onShare={() => toast("Link copied", { description: "Anyone with the link can view." })}
          onRename={() => toast("Rename", { description: "Coming soon" })}
          onExport={() => toast("Export", { description: "Coming soon" })}
          onDelete={() => toast("Delete", { description: "Coming soon" })}
        />
      }
    >
      {active === "chat"     && <ChatView      key={`chat-${resetTick}`}   onChip={handleChip} onSessionTitleChange={onSessionTitleChange} />}
      {active === "studio"   && <StudioView    key={`studio-${resetTick}`} />}
      {active === "image"    && <ImageGenView  key={`image-${resetTick}`}  onSubmitPrompt={(v) => logToHistory("Image", v)} />}
      {active === "search"   && <SearchView    key={`search-${resetTick}`} onOpenChat={() => setActive("chat")} />}
      {active === "tasks"    && <TasksView     key={`tasks-${resetTick}`}  onSubmitPrompt={(v) => logToHistory("Task", v)} />}
      {active === "pdf"      && <ChatPdfView   key={`pdf-${resetTick}`} />}
      {active === "settings" && <SettingsView  key={`settings-${resetTick}`} />}
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
