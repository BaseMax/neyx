# Example projects

Five small, real Neyx projects, each built and checked with
`neyx build` / `neyx check` and showing a different slice of what Neyx
does. Every one is self-contained — `cd` into it and run `neyx build`
or `neyx dev`.

| Project | Shows |
| --- | --- |
| [personal-website](personal-website/) | A single-language personal site: plain pages, a data-driven nav, no dates or collections |
| [blog](blog/) | A single-language blog: tags, pagination, drafts, RSS/Atom feeds, a table of contents |
| [blog-i18n](blog-i18n/) | The same blog in English, Persian, and Arabic: automatic RTL, hreflang links between translated posts, per-language collections |
| [docs-site](docs-site/) | Documentation: a sidebar from a data file, nested pages, client-side search, raw HTML mixed with Markdown |
| [landing-page](landing-page/) | A one-page marketing site powered entirely by a theme (`themes/simple/`), with no project-level layouts or assets at all |

## Try one

```bash
cd projects/blog
neyx build
neyx preview
```

Or watch it rebuild as you edit:

```bash
neyx dev
```
