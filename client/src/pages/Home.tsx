/*
  Home — Nexva.ai workspace shell.
  B&W minimal · slim icon rail · centered chat-first hero.
*/

import { useState } from "react";
import { AppShell, type NavKey } from "@/components/AppShell";
import { ChatView } from "@/components/views/ChatView";
import { ImageGenView } from "@/components/views/ImageGenView";
import { SearchView } from "@/components/views/SearchView";
import { TasksView } from "@/components/views/TasksView";
import { toast } from "sonner";

export default function Home() {
  const [active, setActive] = useState<NavKey>("chat");
  const [resetTick, setResetTick] = useState(0);

  function newSession() {
    setResetTick((n) => n + 1);
    toast("New session", {
      description: "Started a clean slate.",
    });
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

  return (
    <AppShell active={active} onNavigate={setActive} onNewSession={newSession}>
      {active === "chat"   && <ChatView      key={`chat-${resetTick}`}   onChip={handleChip} />}
      {active === "image"  && <ImageGenView  key={`image-${resetTick}`} />}
      {active === "search" && <SearchView    key={`search-${resetTick}`} />}
      {active === "tasks"  && <TasksView     key={`tasks-${resetTick}`} />}
    </AppShell>
  );
}
