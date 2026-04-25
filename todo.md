# Nexva.ai — History Mock-up: "Grok Video Prompt Methods Compared"

- [ ] Create `client/src/data/mockSessions.ts` with a typed `MOCK_SESSIONS` map keyed by history id, and seed the `h1` "Grok Video Prompt Methods Compared" entry with a designed multi-turn conversation (intro question, comparison table, code-style example prompts, follow-up).
- [ ] Refactor `HistoryContext` to also expose `activeId` + `setActiveId`, and to mark the `h1` seed entry as a "mock" so clicking it loads canned messages.
- [ ] Update `ChatView` to read `activeId` and hydrate `messages` from `MOCK_SESSIONS` when present; switching back to a blank session clears the thread.
- [ ] Add a slim session header above the thread showing the title and a small "Mock preview" tag.
- [ ] Tighten Streamdown table + code styling so the comparison table looks clean in B&W.
- [ ] Save checkpoint and deliver.
