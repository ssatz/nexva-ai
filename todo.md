# Nexva.ai — Session page: fixed chrome, scrollable thread

## Phase 1 — AppShell sticky
- [ ] Make the aside sticky: `sticky top-0 h-screen` so sidebar scroll is independent.
- [ ] Ensure `<main>` is a `flex flex-col h-screen min-h-0` so inner thread can own the scroll.
- [ ] Page body doesn't scroll — only the thread region.

## Phase 2 — TopBar session mode
- [ ] Add optional `title?`, `onShare?`, `onKebab?` props to `TopBar` (or lift title rendering to Home).
- [ ] Render centered title absolutely centered in the top-bar row.
- [ ] Add Share (lucide `Share2`) and Kebab (`MoreHorizontal`) icon buttons to the left of the Upgrade pill.
- [ ] Keep TopBar fixed by pinning its parent row at the top of `<main>` with `sticky top-0 bg-background z-20 border-b border-border`.

## Phase 3 — ChatView session layout
- [ ] When `seeded` (history-hydrated) session: switch ChatView to the new frame.
- [ ] Remove the old in-thread session header (title now in top bar).
- [ ] Thread: `flex-1 overflow-y-auto` — the only scroll.
- [ ] Composer: anchored in a non-scrolling footer at the bottom of `<main>`.
- [ ] Placeholder in session mode: "Ask Nexva".
- [ ] Keep the gradient fade above the composer for a clean reading surface.
- [ ] Wire TopBar title from the active seeded session.

## Phase 4 — Verify + checkpoint
- [ ] TypeScript clean.
- [ ] Visual check: clicking "Grok Video Prompt Methods Compared" shows fixed chrome and only the thread scrolls.
- [ ] Save checkpoint.

## Phase 5 — TopBar centering fix
- [ ] Convert the TopBar row (in AppShell) to a 3-column grid so title centers on the whole canvas.
- [ ] In TopBar, swap absolute centering for a middle-column centered title (truncates on small widths).
- [ ] Move Share from the session-cluster to the right of the row (before the kebab).
- [ ] Tighten icon button sizes to match the Manus-style reference (h-9 rounded buttons, icon stroke 1.5).
- [ ] Verify on narrow canvas the title truncates with ellipsis and doesn't collide with either cluster.
