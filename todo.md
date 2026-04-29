# Nexva.ai — Studio page + collapsible sidebar

## Phase 1 — Collapsible sidebar
- [ ] Add `collapsed` boolean state in `AppShell.tsx` (default `false`, persist to `localStorage`).
- [ ] Swap the left column width between `w-[240px]` and `w-[56px]` with a 180ms ease transition.
- [ ] Header row:
  - Expanded: show Nexva monogram + wordmark + PanelLeft toggle button on the right.
  - Collapsed: show monogram only + PanelLeft toggle button (tooltip "Expand sidebar").
- [ ] Collapsed state hides labels: icons only for primary nav; History section hidden; Help/Settings footer collapses to icon-only with tooltips.
- [ ] Primary nav rows become 40px square buttons with centered icon (no label) when collapsed.
- [ ] "New chat" row becomes a 40px `+` button when collapsed.
- [ ] Every icon-only element gets a Radix tooltip on hover (right side).

## Phase 2 — Studio entry + route
- [ ] Add `studio` to the `NavKey` union / nav items array in `AppShell.tsx`. Icon: `Sparkles` (outline).
- [ ] Add `studio` to the view switch in `pages/Home.tsx`.
- [ ] Keep all other routes identical.

## Phase 3 — StudioView
- [ ] Create `client/src/components/views/StudioView.tsx`.
- [ ] Composer:
  - Placeholder exactly: *"Try tasks, workflows, or rescheduling tasks — type @ to add files or skills"*
  - Left bottom row: `+`, `Tools` (text button, Sliders icon), `Skill` (text button, Zap icon).
  - Right bottom row: `Auto Model ▾`, circular send arrow.
- [ ] Category tiles row (9 items): General, Images, Documents, Slides, Chat, Sheets, Websites, Videos, Tools.
  - All B&W outline icons (Lucide) inside a 48px square with hairline border and 14px radius.
  - Label below tile (13px, foreground/80).
  - Selected state: label gets an underline offset 4px; others untouched.
  - Default selected = "General".
  - Click a tile → sets selected only (no pill, no route change).
- [ ] Submitting the composer appends a history entry + toasts "Routing to {selected category}…".

## Phase 4 — Verify + checkpoint
- [ ] TypeScript clean, preview renders.
- [ ] Save checkpoint.
