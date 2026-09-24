<div align="center">

<img src="docs/assets/og-image.png" alt="NeyX - Static sites. Native speed. Written in Salam." width="720">

# NeyX

**Lightweight. Ultra-fast. Feature-rich static site generator.**

[![License: GPL v3](https://img.shields.io/badge/license-GPLv3-blue.svg)](LICENSE)
[![Latest release](https://img.shields.io/github/v/release/BaseMax/neyx?color=14b8a6)](https://github.com/BaseMax/neyx/releases/latest)
[![Website](https://img.shields.io/badge/docs-basemax.github.io%2Fneyx-14b8a6)](https://basemax.github.io/neyx/)

[Install](#install) · [Usage](#usage) · [Commands](#commands) · [Docs](https://basemax.github.io/neyx/)

</div>

## Install

macOS / Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/BaseMax/neyx/main/install.sh | sh
```

Windows (PowerShell):

```powershell
irm https://raw.githubusercontent.com/BaseMax/neyx/main/install.ps1 | iex
```

Windows (Command Prompt):

```cmd
curl -fsSL https://raw.githubusercontent.com/BaseMax/neyx/main/install.bat -o install.bat && install.bat
```

Each script downloads the right binary for your platform from the
[latest release](https://github.com/BaseMax/neyx/releases/latest) and puts
`neyx` on your `PATH`. Prefer to pick the file yourself? Grab it from the
[releases page](https://github.com/BaseMax/neyx/releases/latest) or the
download buttons on [basemax.github.io/neyx](https://basemax.github.io/neyx/).

Want to build NeyX yourself instead? See [BUILD-SOURCE.md](BUILD-SOURCE.md).

## Usage

```bash
neyx new my-site
cd my-site

neyx dev
neyx build
neyx preview
```

See [projects/](projects/) for five complete example sites (a personal
site, a blog, a blog in three languages, a docs site, and a themed
landing page), each is a real project you can `cd` into and build.

## Building with AI

[CLAUDE.md](CLAUDE.md) is a complete, self-contained reference to NeyX:
every CLI command and flag, the full `neyx.config.yml` format, front
matter fields, the entire template engine syntax and every filter, themes,
hooks, multi-language routing, taxonomies, and worked examples for a blog,
a docs site, a multi-language blog, and a themed landing page. Point an AI
coding assistant at it (Claude Code reads it automatically from the repo
root) and it has everything needed to scaffold and build a real site with
NeyX without reading any source code.

## Commands

| Command | Description |
| --- | --- |
| `neyx new <name>` | Scaffold a new project in a new directory |
| `neyx init` | Scaffold a project in the current (empty) directory |
| `neyx new post <title>` | Create a new dated post under `content/posts/` |
| `neyx build [--drafts] [--pretty] [--no-images] [--json]` | Build the site into the output directory |
| `neyx dev [--port] [--drafts]` | Build, serve, and rebuild automatically on changes |
| `neyx preview [--port]` | Serve an existing production build |
| `neyx clean` | Remove the output directory |
| `neyx check` | Check the build for broken links, missing assets, missing alt text, and duplicate routes |
| `neyx routes` | List every computed route |
| `neyx benchmark` | Time 3 repeated builds and report throughput |
| `neyx info` | Show project information |
| `neyx doctor` | Diagnose common project problems |
| `neyx version` / `neyx help` | Version and usage |

`neyx build` minifies HTML/XML output by default (`--pretty` for readable
output), generates responsive JPEG/PNG variants at 480/960/1440px (`--no-images`
to skip), and can print a single-line JSON summary instead of the normal log
(`--json`, handy for CI). `neyx dev` always builds with `--pretty --no-images`
for fast iteration, then watches `content/`, `layouts/`, `assets/`, `data/`,
`static/`, the active theme, and `neyx.config.yml`, rebuilding automatically
whenever something changes, until you stop it with Ctrl+C.

## Project layout

```text
my-site/
├── neyx.config.yml
├── content/       markdown pages, with YAML front matter
├── layouts/       HTML templates
├── assets/        copied to output/assets/
├── data/          YAML/JSON, exposed to templates as {{ data.<file>.* }}
├── static/        copied as-is to the output root (overrides generated files)
└── themes/<name>/ optional layouts/ and assets/ a project can fall back to
```

Routes are derived from the path under `content/`: `content/about.md` becomes
`/about/`, `content/posts/hello.md` becomes `/posts/hello/`, and an `index.md`
in any directory becomes that directory's own route.

## Configuration (`neyx.config.yml`)

```yaml
title: "My Site"
description: "A new NeyX site"
url: "https://example.com"
language: "en"
output: "dist"
content: "content"
layouts: "layouts"
assets: "assets"
data: "data"
static: "static"
pagination_size: 10
languages: ["en", "fa"]
taxonomies: ["tags", "categories"]
optimize_images: true
theme: ""
hooks:
  before_build: "echo starting"
  after_build: "echo done"
```

Every key is also available in templates under `{{ site.* }}`.

### Themes

Set `theme` to a name and add `themes/<name>/layouts/` and
`themes/<name>/assets/`. A layout or asset in the project's own `layouts/`
or `assets/` always wins, so a site only needs to override the files it
wants to change - everything else falls through to the theme, then to
NeyX's built-in default layout.

### Hooks

`hooks.before_build` runs (via the shell) right after config is loaded,
before any content is read; `hooks.after_build` runs after every file has
been written, including the static-passthrough overlay.

### Multi-language sites

Set `languages` to a list of codes and split `content/` into one directory
per language (`content/en/...`, `content/fa/...`). Routes get the language
prefix (`content/fa/about.md` → `/fa/about/`), and every template gets
`{{ lang }}` (the page's language) and `{{ dir }}` (`rtl` for `fa`/`ar`/`he`/`ur`,
`ltr` otherwise), the built-in layout already uses them:
`<html lang="{{ lang }}" dir="{{ dir }}">`. Without `languages` configured,
sites build exactly as before (single language, no prefix). `pages`/`posts`
are scoped to each page's own language automatically.

Pages at the same relative path in different language directories
(`content/en/about.md` and `content/fa/about.md`) are treated as
translations of each other: each gets `{{ each t in translations }}` (with
`t.lang`/`t.url`) and the built-in layout emits
`<link rel="alternate" hreflang="…">` for each one. Set `translation_key`
in front matter to link pages whose filenames don't match.

### Taxonomies

`taxonomies` (default `["tags"]`) lists which front-matter array fields
become browsable term collections - `tags: [...]` and `categories: [...]`
both work the same way. Each configured field gets `/<field>/<term>/` pages
(a `{{ each item in items }}` list) and a `/<field>/` index
(`{{ each t in terms }}`, each with `.name`/`.url`/`.count`). Terms are
matched case-insensitively, so `tags: [JavaScript]` and `tags: [javascript]`
land on the same page. Override the layouts with `layouts/<field>-term.html`
and `layouts/<field>.html` (e.g. `layouts/tags-term.html`).

## Front matter

```markdown
---
title: "Hello NeyX"
description: "My first NeyX article"
date: "2026-09-24"
tags: ["salam", "neyx"]
layout: post
draft: false
---

# Hello NeyX

Welcome to my site.
```

`layout` picks the file in `layouts/` used to render the page (defaults to
`default.html`). `draft: true` pages are skipped by `neyx build` unless
`--drafts` is passed. `paginate: true` splits a listing page's `posts` across
`/`, `/page/2/`, `/page/3/`... (size from `pagination_size`), with
`{{ pagination.page }}`, `.total_pages`, `.has_next`/`.has_prev`, and
`.next_url`/`.prev_url` available in the template.

## Templates

```html
<h1>{{ title }}</h1>
{{ if description }}<p>{{ description }}</p>{{ end }}
{{ & content }}

<ul>
{{ each post in posts }}
  <li><a href="{{ post.url }}">{{ post.title }}</a></li>
{{ end }}
</ul>
```

- `{{ path.to.value }}`: HTML-escaped output. Also accepts a literal string
  (`"..."`/`'...'`), number, or `true`/`false` in place of a path.
- `{{ path.0 }}` / `{{ path.2.name }}`: numeric path segments index into
  arrays, so a field holding a list can be reached into directly.
- `{{ & path }}`: raw, unescaped output (used for rendered page content).
- `{{! a comment }}`: removed entirely from output.
- `{{ set name = expr }}`: binds `name` to `expr` (a path, literal, or filter
  chain) for the rest of the current block, including nested blocks that
  follow it; it does not leak past the `{{ end }}` of whatever block it's in.
- `{{ if cond }} ... {{ else }} ... {{ end }}`: conditional. `cond` can be a bare
  path (truthy), `!path` (falsy), a comparison (`a == b`, `a != b`, `a > b`,
  `a < b`, `a >= b`, `a <= b`, against a literal string, number, `true`/`false`,
  or another path), or a chain of comparisons joined by all `&&` or all `||`.
- `{{ each item in path }} ... {{ end }}`: loop over an array.
- `{{ each i, item in path }} ... {{ end }}`: loop with a 0-based index variable.
  Every loop body also gets `loop.index` (0-based), `loop.index1` (1-based),
  `loop.first`, `loop.last`, and `loop.length`.
- `{{ with path as name }} ... {{ else }} ... {{ end }}`: if `path` is truthy,
  renders the body with `name` bound to it; otherwise renders the `else`
  branch. `as name` is optional and defaults to `with`.
- `{{ include "partial.html" }}`: parses and renders another file from your
  `layouts/` directory in place, sharing the current context and any `set`
  variables already in scope. Partials can themselves include others, up to
  a depth of 32.
- `{{ value | filter arg }}`: pipe a value through one or more filters, e.g.
  `{{ title | truncate 40 | upper }}`. Filters:
  - `upper`, `lower`, `title`, `capitalize`, `trim`, `reverse`, `sort`, `unique`
  - `truncate N`, `truncatewords N`
  - `replace old new`, `default value`, `split sep`
  - `length`, `first`, `last`, `nth N`, `join sep`, `keys`, `min`, `max`
  - `add N`, `sub N`, `mul N`, `div N`, `round`, `abs`
  - `slugify`, `striptags`, `urlencode`, `json`
  - `pluralize singular plural` (picks one based on the piped count)
  - `safe`: skip HTML-escaping, for use inside a filter chain instead of `&`

Every page's front matter fields are available at the top level (`{{ title }}`),
alongside `content` (the rendered body), `toc` (an `<li>` per `##` heading,
for `{{ & toc }}` inside your own `<ul>`/`<nav>`), `url` (the page's route),
`lang`/`dir`, `translations` (see multi-language sites, below), `site.*`
(config), `data.*` (data files), `pages` (every page in this language),
and `posts` (every page in this language with a `date`, newest first).

## Generated output

Every build also writes `sitemap.xml`, `feed.xml` (RSS 2.0), `atom.xml`
(Atom 1.0), `robots.txt`, `api/pages.json`, `api/posts.json`,
`search-index.json`, and a small dependency-free `assets/neyx-search.js`
into the output directory, plus term/index pages for every configured
taxonomy (see above). `sitemap.xml` skips any page with `noindex: true` in
front matter (which also adds `<meta name="robots" content="noindex">` in
the built-in layout).

### Client-side search

```html
<script src="/assets/neyx-search.js"></script>
<input id="q" placeholder="Search…">
<ul id="results"></ul>
<script>NeyXSearch('#q', '#results')</script>
```

It fetches `/search-index.json` once and filters by title/description as
the user types, no server or build step required.

## License

See [LICENSE](LICENSE).
