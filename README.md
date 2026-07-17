# Ethan Hennenhoefer — Portfolio

Single-page portfolio. No build step — plain HTML/CSS/JS.

**Design direction:** warm-paper Swiss editorial. Ink on paper, one Klein-blue
accent, expanded Archivo display type, Fragment Mono labels, hairline rules,
film grain, GSAP scroll motion (degrades gracefully without JS / with
reduced-motion).

## Run locally

```sh
python3 -m http.server 4173
# → http://localhost:4173
```

## Structure

```
index.html        — everything lives here (one page)
css/styles.css    — design tokens at the top, then per-section styles
js/main.js        — Lenis smooth scroll + GSAP reveals/parallax/marquee,
                    menu, clock, copy-email, dot-field canvas
assets/           — favicon (real images/screenshots land here later)
CONTENT-TODO.md   — every placeholder that needs real content
```

## Filling in real content

See `CONTENT-TODO.md`. Media placeholders are marked with black "SLOT" chips
directly on the page so they're impossible to miss.
