# CLAUDE.md

This file gives an AI assistant everything needed to (a) help someone build a real site with NeyX, and (b) work on the NeyX tool's own source in this repository.

## What NeyX is

NeyX is a lightweight, ultra-fast, batteries-included static site generator written entirely in the Salam programming language. It compiles to a single native binary (no runtime, no npm, no config beyond one YAML file). A build turns Markdown + YAML front matter + HTML templates into a static site, automatically generating feeds, a sitemap, taxonomy pages, pagination, multi-language routing, responsive images, and client-side search on every run.

## Quick start

```bash
neyx new my-site && cd my-site
neyx dev              # build, serve on :3000, rebuild on save
neyx build             # production build into dist/
neyx preview            # serve the production build
```

## CLI reference

| Command | Flags | Does |
| --- | --- | --- |
| `neyx new <name>` | | Scaffold a new project in a new directory `<name>` |
| `neyx init` | | Scaffold a project in the current (must be empty) directory |
| `neyx new post <title>` | | Create `content/posts/<slug>.md` with today's date pre-filled |
| `neyx build` | `--drafts` include draft pages · `--pretty` skip minification · `--no-images` skip responsive image generation · `--json` print a one-line JSON summary instead of a log | Build the site into `output` (default `dist`) |
| `neyx dev` | `--port=N` (default 3000) · `--drafts` | Build, serve, and watch `content/`, `layouts/`, `assets/`, `data/`, `static/`, the active theme, and `neyx.config.yml`, rebuilding on any change, until Ctrl+C. Always builds with `--pretty --no-images` |
| `neyx preview` | `--port=N` (default 3000) | Serve an existing `dist/` as-is, no rebuild |
| `neyx clean` | | Remove the output directory |
| `neyx check` | | After a build: broken internal links, missing referenced assets, `<img>` with no `alt`, duplicate routes |
| `neyx routes` | | List every computed route, its source file, and layout used |
| `neyx benchmark` | | Time 3 repeated builds, report best/average ms and pages/sec |
| `neyx info` | | Project title, NeyX version, page/draft counts, output/layouts/content dirs |
| `neyx doctor` | | Diagnose: config present, content/layouts dirs exist, theme dir exists if set, git repo present, salam on PATH |
| `neyx version` / `neyx help` | | Version string / usage |

## Project structure (a NeyX site, not this repo)

```text
my-site/
├── neyx.config.yml
├── content/        Markdown pages with YAML front matter. Path = route.
├── layouts/         HTML templates
├── assets/          copied to output/assets/, JPEG/PNG get responsive variants
├── data/            YAML/JSON, exposed to every template as {{ data.<filename>.* }}
├── static/          copied as-is to the output ROOT (wins over generated files)
└── themes/<name>/    optional layouts/ + assets/ fallback a project can opt into
```

Routing: `content/about.md` → `/about/`; `content/posts/hello.md` → `/posts/hello/`; `index.md` in any directory becomes that directory's own route.

## neyx.config.yml (all fields, with defaults)

```yaml
title: "My Site"
description: ""
url: ""
language: "en"
output: "dist"
content: "content"
layouts: "layouts"
assets: "assets"
data: "data"
static: "static"
pagination_size: 10
languages: []                   # e.g. ["en", "fa", "ar"] to enable multi-language mode
taxonomies: []                  # defaults to ["tags"] if left empty
optimize_images: true
theme: ""
hooks:
  before_build: ""
  after_build: ""
```

Every key is available in templates as `{{ site.* }}`. Wrong-typed or malformed values fall back to defaults silently, never crash a build.

## Front matter

```markdown
---
title: "Hello NeyX"
description: "My first article"
date: "2026-09-24"
tags: ["salam", "neyx"]
layout: post
draft: false
paginate: true
noindex: false
translation_key: "hello"
---

# Hello NeyX
Body in Markdown.
```

- `layout`: file in `layouts/` used to render this page (default `default.html`, no extension).
- `draft: true`: excluded from `neyx build` unless `--drafts`.
- `paginate: true`: splits a listing page's `posts` across `/`, `/page/2/`, ...; template gets `{{ pagination.page }}`, `.total_pages`, `.has_next`/`.has_prev`, `.next_url`/`.prev_url`.
- `noindex: true`: excluded from `sitemap.xml`, adds `<meta name="robots" content="noindex">`.
- `translation_key`: links pages across language directories whose filenames don't match.
- Any field named in config's `taxonomies` list (default `tags`) becomes a browsable term collection.

## Template engine

Every page's front matter fields sit at the template's top level (`{{ title }}`), plus: `content`, `toc` (use with `{{ & toc }}`), `url`, `lang`, `dir` (`rtl` for fa/ar/he/ur, else `ltr`), `translations`, `site.*`, `data.*`, `pages`, `posts`.

### Tags

| Syntax | Meaning |
| --- | --- |
| `{{ path.to.value }}` | HTML-escaped output. Also accepts a literal `"str"`, `'str'`, a number, or `true`/`false` directly. |
| `{{ path.0 }}`, `{{ items.2.name }}` | Numeric path segments index into arrays, at any depth. |
| `{{ & expr }}` | Raw, unescaped output. |
| `{{! comment }}` | Removed entirely from output. |
| `{{ set name = expr }}` | Local variable for the rest of the current block and nested blocks after it; does not leak past that block's `{{ end }}`. |
| `{{ if cond }} ... {{ else }} ... {{ end }}` | `cond`: bare path (truthy), `!path` (falsy), `==`/`!=`/`>`/`<`/`>=`/`<=` (literal or path either side), or one chain of all `&&` or all `\|\|`. |
| `{{ each item in path }} ... {{ end }}` | Loop over an array. |
| `{{ each i, item in path }} ... {{ end }}` | Same plus a 0-based index var. Every loop body also gets `loop.index`, `loop.index1`, `loop.first`, `loop.last`, `loop.length` regardless. |
| `{{ with path as name }} ... {{ else }} ... {{ end }}` | If `path` is truthy, renders body with `name` bound to it (`as name` optional, default `with`); else the `else` branch. |
| `{{ include "file.html" }}` | Renders another `layouts/` file in place, sharing scope. Max depth 32. |

### Filters

`{{ value \| filter arg \| filter2 }}`, chainable, left to right.

- **Strings**: `upper`, `lower`, `title`, `capitalize`, `trim`, `reverse`, `truncate N`, `truncatewords N`, `replace old new`, `split sep`, `slugify`, `striptags`, `urlencode`
- **Collections**: `sort`, `unique`, `length`, `first`, `last`, `nth N`, `join sep`, `keys`, `min`, `max`
- **Numbers**: `add N`, `sub N`, `mul N`, `div N`, `round`, `abs` (division by zero yields 0, never crashes)
- **Other**: `default value` (use `value` if input is falsy), `json` (serialize to a JSON string, pair with `&`), `pluralize singular plural`, `safe` (skip escaping, alternative to `&`)

Invalid inputs degrade gracefully: string filters on a number stringify it first; array filters on a non-array return the input (or empty) unchanged; comparing mismatched types is simply `false`. Never crashes a build.

## Themes, hooks, multi-language, taxonomies, images, generated output

- **Themes**: `theme: "name"` + `themes/name/layouts/` + `themes/name/assets/`. Resolution: project's own files first, then theme, then NeyX's built-in default.
- **Hooks**: `hooks.before_build` (after config load, before content read) and `hooks.after_build` (after every file written), both shell command strings.
- **Multi-language**: `languages: ["en", "fa"]`, split `content/` into `content/en/`, `content/fa/`; routes get the prefix; `{{ lang }}`/`{{ dir }}` in every template; same-path pages across languages auto-link as `{{ each t in translations }}` (or match via `translation_key`).
- **Taxonomies**: config's `taxonomies` (default `["tags"]`) generates `/<field>/<term>/` and `/<field>/` pages per configured field. Provide `layouts/<field>-term.html` and `layouts/<field>.html`, or you get NeyX's bare fallback.
- **Responsive images**: JPEG/PNG under `assets/` wider than 480/960/1440px get `name-480.ext`/`name-960.ext`/`name-1440.ext` variants automatically (`--no-images` to skip).
- **Generated automatically every build**: `sitemap.xml`, `feed.xml`, `atom.xml`, `robots.txt`, `api/pages.json`, `api/posts.json`, `search-index.json`, `assets/neyx-search.js` (drop in `<script src="/assets/neyx-search.js"></script>` + `NeyXSearch('#q', '#results')`, no server needed).

## Worked examples

- **Blog**: `taxonomies: ["tags"]`, `content/posts/*.md` with `date`/`tags`/`layout: post`, a `paginate: true` listing page, `layouts/post.html` + `layouts/blog.html` + `layouts/tags.html` + `layouts/tags-term.html`.
- **Docs site**: `data/nav.yml` listing sections, rendered as nested `{{ each }}` in the layout; nested `content/guide/*.md` pages; the search widget.
- **Multi-language blog**: `languages: ["en", "fa", "ar"]`, mirrored `content/<lang>/posts/` filenames, `{{ dir }}` for automatic RTL, `{{ each t in translations }}` as a language switcher.
- **Themed landing page**: no project `layouts/`/`assets/`, everything in `themes/simple/`, `content/index.md` mixing raw HTML sections directly into Markdown (untouched HTML passes through).

---

## Working in this repository

The above is about *using* NeyX. The rest is about *this* repo, which is NeyX's own source (written in Salam, a compiled language: `salam build neyx.salam --output=neyx`, or `salam run <file>.salam` to interpret one file directly).

- **No comments** in `.salam`, `.yml`/`.yaml`, `.css`, or `.js` files anywhere in this repo. Put reasoning in commit messages instead.
- **Salam ordering rule**: in a file, `import`s come first, then every private (non-`pub`) function must be defined before any `pub` function that isn't itself declaring types/consts at the top. Private helpers generally need to appear before their first use, top to bottom, in a file.
- **No closures** in Salam; pass named functions, not inline lambdas capturing outer state.
- **`str.Len`/`.len()` on a `str` compiles to `strlen`**, so embedded `0x00` bytes truncate. Never round-trip binary data through a plain `str` from an unknown-length source; use `Base64DecodeBytes` into a raw buffer instead of `Base64DecodeStrict` for anything binary.
- **No built-in file-mtime/process-management APIs** beyond what `std/os` exposes; shell out via `os.Run`/`os.RunCapture` for anything else, and expect Windows vs. POSIX differences (see `internal/dev/dev.salam` for the platform-conditional `SALAM_OS_WINDOWS`/`SALAM_OS_UNIX` pattern already used for the dev-server watcher).
- **Tests**: `internal/tests/*.salam`, run all of them with `salam run run_tests.salam` from the repo root (exits non-zero on any failure, using Salam's own `std/testing` package). Add new test files there and wire them into `run_tests.salam`'s imports; CI runs this on all three platforms right after building, before the slower smoke tests.
- **CI**: `.github/workflows/build-release.yml`. A push to `main` whose commit message starts with `release:` builds all platforms and publishes a public GitHub Release; anything else just builds and tests. Validate workflow edits with `actionlint` before pushing.
- **Commits**: short, human-sounding messages, no AI co-author line, no em-dashes anywhere in written content (commit messages, docs, chat) as it's a known AI-writing tell this project explicitly avoids.
- **Example projects** under `projects/` are real, working NeyX sites used as both documentation and CI-adjacent regression coverage; keep them buildable (`neyx build` in each) after any template-engine or builder change.
