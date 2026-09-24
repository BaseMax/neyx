# conference

A fictional two-day conference site, five pages, all data-driven.

## What this shows

- A multi-page site built entirely from `data/` files: speakers,
  the two-day schedule, ticket tiers, and sponsors each live in their
  own YAML file and get rendered by `{{ each }}`, not hand-written
  per page
- `{{ include "_nav.html" }}` and `{{ include "_footer.html" }}`
  shared across every layout instead of repeating the header/footer
  markup in each one
- A custom layout per page type (`home.html`, `schedule.html`,
  `speakers.html`, `register.html`), plus `default.html` as the
  fallback for a plain content page (`venue.md`)
- `loop.index` combined with `{{ if }}` to show only the first three
  speakers on the home page as a teaser, with the rest on their own
  page
- Nested `{{ each }}` (days containing sessions, ticket tiers
  containing perks, sponsor tiers containing companies)
- A content page (`register.md`) whose body (a hand-written FAQ)
  renders in between two data-driven sections (ticket cards above,
  sponsors below)

## Build it

```bash
neyx build
neyx preview
```
