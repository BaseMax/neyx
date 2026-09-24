# docs-site

A small documentation site for a fictional product.

## What this shows

- A sidebar built entirely from a data file (`data/sidebar.yaml`), with
  a nested `{{ each section in data.sidebar.sections }}` /
  `{{ each item in section.items }}` loop
- Nested content (`content/guides/deployment.md` becomes
  `/guides/deployment/`)
- Per-page table of contents (`{{ & toc }}`) built from `##` headings
- Client-side search: `neyx-search.js` plus
  `NeyXSearch('#search-input', '#search-results')` in the layout,
  reading the auto-generated `search-index.json`
- A raw HTML block (a `<div class="callout">` in
  `content/configuration.md`) mixed with Markdown
- Tables, code fences, task lists, and a blockquote

## Build it

```bash
neyx build
neyx preview
```

Try the search box, and open dev tools to see it fetch `/search-index.json`.
