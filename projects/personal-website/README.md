# personal-website

A single-language personal/portfolio site.

## What this shows

- Plain pages with no dates, tags, or collections — `content/index.md`,
  `about.md`, `work.md`, `contact.md`
- A data-driven nav (`data/nav.yaml`, looped in the layout with
  `{{ each item in data.nav.items }}`) instead of hardcoded links
- A single custom `layouts/default.html` used for every page
- Front-matter `description` feeding both `<meta name="description">` and
  Open Graph tags automatically
- A Markdown table (`content/contact.md`)

## Build it

```bash
neyx build
neyx preview
```
