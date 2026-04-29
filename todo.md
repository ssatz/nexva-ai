# Nexva.ai — mobile responsive pass

## Phase 1 — AppShell
- [ ] On <md: sidebar becomes off-canvas drawer (fixed, translate-x, backdrop overlay).
- [ ] On ≥md: keep the sticky static aside; collapse toggle keeps working.
- [ ] Expose `mobileOpen` state; close on nav, on route change, on Esc, on backdrop click.
- [ ] The AppShell root switches from `flex h-screen` (desktop) to a simple `min-h-dvh` (mobile), with main taking full width.

## Phase 2 — TopBar
- [ ] Add a hamburger button on <md that toggles the drawer (lives in AppShell, not TopBar).
- [ ] Hide the Upgrade pill on <sm; keep avatar + (session icons).
- [ ] Reduce icon button sizes and paddings on <sm.
- [ ] Center title: make font smaller on <sm, ensure truncation still works.

## Phase 3 — Views
- [ ] ChatView empty state: paddings, chip wrapping, headline font scale for mobile.
- [ ] Studio: one-column grid of category tiles on <sm (scrollable row on sm if needed).
- [ ] ChatPDF: stack left PDF-list pane over the chat pane on <md (tabs or stacked sections).
- [ ] Image / Search / Tasks: mobile padding tune and single-column cards.

## Phase 4 — Composer / Thread
- [ ] Composer padding shrinks on <sm; ensure the rounded corner + shadow look right at 100% width.
- [ ] ToolsStrip: hide the x close button on <sm, compact spacing.
- [ ] ChatThread: narrower avatars, tighter line-height on <sm.
- [ ] Add `pb-[env(safe-area-inset-bottom)]` on the anchored composer footer.

## Phase 5 — Verify + checkpoint
- [ ] TypeScript clean.
- [ ] Manual check at 360×780, 414×896, 768 (tablet), 1024 (desktop).
- [ ] Save checkpoint.
