# Nexva.ai — ChatPDF iteration

- [ ] Add a "ChatPDF" chip to the home page chip row (between Tasks and More); reuse the existing chip click handler to switch view.
- [ ] Add a `pdf` view key (no sidebar entry).
- [ ] Build `ChatPdfView` empty state: centered "Document Intelligence" headline, dashed monochrome upload zone (icon + Click to upload or drag-and-drop + format hint + Select File button), Recent Documents list below.
- [ ] Build `ChatPdfView` active state: 2-column layout inside the canvas — left = PDF list (search input, items list, "+ Select File"), right = chat thread with model row (mock GPT-4o-mini) + file pill at top + composer "Ask something about your PDF…" at bottom.
- [ ] Switching screens: clicking a file or uploading enters active state; back arrow returns to empty state.
- [ ] Drag-and-drop accepts a file (visual only); show toast "Uploaded — preview only".
- [ ] Save checkpoint and deliver.
