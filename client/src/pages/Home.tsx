/*
  Home — Nexva.ai workspace shell.
  Quiet Studio: warm off-white canvas, hairline divider, lower-third composer.
  Single-page client routing across {chat | image | search | tasks} via AppShell.
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
  // Bump key to force-remount the active view → resets local message/task state
  const [resetTick, setResetTick] = useState(0);

  function newSession() {
    setResetTick((n) => n + 1);
    toast("New session", {
      description: "Started a clean slate in the current workspace.",
    });
  }

  return (
    <AppShell active={active} onNavigate={setActive} onNewSession={newSession}>
      {active === "chat"   && <ChatView   key={`chat-${resetTick}`} />}
      {active === "image"  && <ImageGenView key={`image-${resetTick}`} />}
      {active === "search" && <SearchView   key={`search-${resetTick}`} />}
      {active === "tasks"  && <TasksView    key={`tasks-${resetTick}`} />}
    </AppShell>
  );
}
