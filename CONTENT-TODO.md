# Content to replace before this goes live

Everything on the page is designed to look finished, but these are the slots
holding placeholder content. All in `index.html` unless noted.

## Media slots (marked with black "SLOT" chips on the page)
- [x] ~~Reel frame~~ — removed 2026-07-16 (Ethan has no showreel video; section
      order is now Hero → About → Practice → Work → Contact). If a video ever
      exists, the old scroll-scrub hook is in git-less history: ask Claude to re-add.
- [ ] **Scribe screenshot** (`.browser` mockup) — replace skeleton UI with a real
      product screenshot (keep the browser chrome frame, swap `.browser-body` for an `<img>`).
- [ ] **Workout app screenshots × 3** (`.phones`) — replace each `.phone-screen`
      contents with real app screenshots (`<img>` fills the screen div).
- [x] **Portrait** — done (assets/portrait.jpg, grayscale treatment, hover
      reveals color; delete the `.portrait-img` filter lines in styles.css
      for always-color).

## Copy that is plausible-but-placeholder
- [ ] Scribe description + meta year/tags ("2025 · AI · Product")
- [ ] Workout app real name (currently literally "Workout App"), description, meta
- [ ] Practice section blurb + the four service descriptions — tune to the real offer
- [ ] "Map / Automate / Ship & run" step copy
- [ ] About bio (2 paragraphs + lede) — written in Ethan's probable voice, verify
- [ ] Toolbox stacks (AI/Web/Mobile/Data lists) — confirm actual tools
- [ ] Hero meta: "Open to select projects", "Currently — Independent AI consultant"

## Links
- [x] GitHub (github.com/EthanH2004) + LinkedIn (linkedin.com/in/ethan-hennenhoefer) — done; X removed per Ethan
- [ ] Consider: resume PDF link, calendar booking link for the Practice CTA

## Meta
- [ ] `og:image` (1200×630) once we have a hero visual
- [x] Location — "Based in Austin, Texas" in hero meta; footer shows "Austin, TX · <12h time>" (America/Chicago)
- [ ] Analytics if wanted

## Later ideas discussed
- Higgsfield image→video for the reel/portrait slots with scroll scrubbing (hook ready)
- Case-study pages per project (cursor tag currently says "Full case — soon")
