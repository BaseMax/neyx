# landing-page

A one-page marketing site, styled entirely by a theme.

## What this shows

- The theme system: `theme: simple` in the config points at
  `themes/simple/`, which supplies `layouts/default.html` and
  `assets/style.css`. This project has no `layouts/` or `assets/`
  directory of its own at all. A project can override individual
  theme files when it needs to, but doesn't have to
- Raw HTML blocks mixed with Markdown (the hero and call-to-action
  sections are plain `<section>` HTML; the features list and pricing
  table in between are Markdown)
- A same-page anchor link (`href="#pricing"`) landing on the
  auto-generated heading ID for `## Pricing`

## Build it

```bash
neyx build
neyx preview
```

## Try the override

Create `layouts/default.html` in this project and it will be used
instead of the theme's; everything else keeps coming from the theme.
