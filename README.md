# Neyx

Neyx is a lightweight, ultra-fast, feature-rich static site generator written entirely in the Salam programming language.

Static sites. Native speed. Written in Salam.

## Requirements

- The [Salam](https://github.com/SalamLang/Salam) compiler on your `PATH`.

## Building Neyx

```bash
salam build neyx.salam --output=neyx
```

## Usage

```bash
neyx new my-site
cd my-site

neyx dev
neyx build
neyx preview
```

## Commands

| Command | Description |
| --- | --- |
| `neyx new <name>` | Scaffold a new project in a new directory |
| `neyx init` | Scaffold a project in the current (empty) directory |
| `neyx new post <title>` | Create a new dated post under `content/posts/` |
| `neyx build [--drafts] [--pretty] [--no-images] [--json]` | Build the site into the output directory |
| `neyx dev [--port] [--drafts]` | Build and serve the site |
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
for fast iteration.

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
description: "A new Neyx site"
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
wants to change — everything else falls through to the theme, then to
Neyx's built-in default layout.

### Hooks

`hooks.before_build` runs (via the shell) right after config is loaded,
before any content is read; `hooks.after_build` runs after every file has
been written, including the static-passthrough overlay.

### Multi-language sites

Set `languages` to a list of codes and split `content/` into one directory
per language (`content/en/...`, `content/fa/...`). Routes get the language
prefix (`content/fa/about.md` → `/fa/about/`), and every template gets
`{{ lang }}` (the page's language) and `{{ dir }}` (`rtl` for `fa`/`ar`/`he`/`ur`,
`ltr` otherwise) — the built-in layout already uses them:
`<html lang="{{ lang }}" dir="{{ dir }}">`. Without `languages` configured,
sites build exactly as before (single language, no prefix).

## Front matter

```markdown
---
title: "Hello Neyx"
description: "My first Neyx article"
date: "2026-09-24"
tags: ["salam", "neyx"]
layout: post
draft: false
---

# Hello Neyx

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

- `{{ path.to.value }}` — HTML-escaped output.
- `{{ & path }}` — raw, unescaped output (used for rendered page content).
- `{{ if path }} ... {{ else }} ... {{ end }}` — truthy conditional.
- `{{ each item in path }} ... {{ end }}` — loop over an array.

Every page's front matter fields are available at the top level (`{{ title }}`),
alongside `content` (the rendered body), `url` (the page's route), `site.*`
(config), `data.*` (data files), `pages` (every page), and `posts` (every page
with a `date`, newest first).

## Generated output

Every build also writes `sitemap.xml`, `feed.xml` (RSS), `robots.txt`,
`api/pages.json`, `api/posts.json`, and `search-index.json` into the output
directory, plus `/tags/<tag>/` and `/tags/` pages for any `tags` used in
front matter.

## License

See [LICENSE](LICENSE).
