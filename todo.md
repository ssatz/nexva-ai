# Nexva.ai — Image & Video (Beta) workspace

## Phase 1 — Header + tabs + search row
- [ ] Page title "Image & Video" with a small "Beta" pill.
- [ ] Underlined tabs: Explore (default) / History.
- [ ] Search row: monochrome search input + "+ Image" / "+ Video" pill chips.

## Phase 2 — Featured Templates strip
- [ ] Horizontal-scroll row of 6 Unsplash template cards with bottom-left label overlay.
- [ ] Labels: Scribbli, Chibi, Professional Headshot, Crayonify, Watercolor Portrait, 70s Street Style.
- [ ] Section header "Featured Templates" with right-side "View All" link.

## Phase 3 — Discover gallery
- [ ] Section header "Discover".
- [ ] 4-column responsive grid (1/2/3/4 across breakpoints) of Unsplash images.
- [ ] Mark a few items as videos with a small play badge in the bottom-right corner.

## Phase 4 — Floating composer (anchored bottom-center)
- [ ] Top row: preset chips (Surreal Landscape, Cozy Interior, Abstract Geometric).
- [ ] Image / Video segmented toggle (Image is default).
- [ ] Reference uploads row (only when Video is selected): Start frame, End frame, Image refs, Video refs, Audio refs.
- [ ] Placeholder swaps: "Type to imagine" / "Describe your video or reference by using @…".
- [ ] Bottom toolbar: model, aspect ratio, resolution, duration (Video), audio (Video), seed, enhance, credits-left chip, send.

## Phase 5 — History tab + send behavior
- [ ] History tab shows generations as a 4-column grid (mock with ~6 entries: mix of image/video).
- [ ] Pressing Send adds a new "generation" card to History and switches the active tab.
- [ ] Empty History state hint.

## Phase 6 — Save checkpoint and deliver
- [ ] Run check-status.
- [ ] Save checkpoint and send build URL.


---

# Todo — My Chats redesign (Search → My Chats)

- [ ] Read SearchView.tsx, AppShell.tsx, HistoryContext.tsx
- [ ] Rewrite SearchView as the "My Chats" page:
  - [ ] Title "My Chats" + dark "+ Create new" split button (with caret)
  - [ ] Search input with leading magnifier + trailing filter icon
  - [ ] "{N} Chats" count + "Select" link
  - [ ] Rows: title (semibold) + relative time, hairline dividers, hover bg + kebab
  - [ ] Click row → loads the session in Chat view
  - [ ] Empty state when no matches
- [ ] Update AppShell sidebar:
  - [ ] Rename "Search" → "My Chats" with chats icon
  - [ ] "+ New chat" styled as the dark split-button
- [ ] Verify dev server / save checkpoint / deliver


---

# Todo — Composer model picker + cleanup

- [ ] Read ChatComposer.tsx and ChatView.tsx
- [ ] Replace nexva-1.0 pill with a searchable Model dropdown (Gemini 3.1 Flash Lite NEW, Grok 4.1 Fast, Claude 4.5 Haiku, Gemini 3.1 Pro NEW Pro, Claude 4.6 Sonnet NEW Pro) with icons + descriptions, search field at top
- [ ] Remove the tips (lightbulb) and library (book) icons from the composer
- [ ] Remove the "Connect your tools to Nexva" strip from the home view
- [ ] Verify build, save checkpoint
