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
| `neyx new <name>` | Scaffold a new project |
| `neyx build [--drafts]` | Build the site into the output directory |
| `neyx dev [--port] [--drafts]` | Build and serve the site, rebuild-on-request |
| `neyx preview [--port]` | Serve an existing production build |
| `neyx clean` | Remove the output directory |
| `neyx check` | Check the build for broken links, missing assets, and duplicate routes |
| `neyx info` | Show project information |
| `neyx version` / `neyx help` | Version and usage |

## Project layout

```text
my-site/
├── neyx.config.yml
├── content/       markdown pages, with YAML front matter
├── layouts/       HTML templates
├── assets/        copied to output/assets/
├── data/          YAML/JSON, exposed to templates as {{ data.<file>.* }}
└── static/        copied as-is to the output root (overrides generated files)
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
```

Every key is also available in templates under `{{ site.* }}`.

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
`--drafts` is passed.

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

Every build also writes `sitemap.xml`, `feed.xml` (RSS), and `robots.txt`
into the output directory, plus `/tags/<tag>/` and `/tags/` pages for any
`tags` used in front matter.

## License

See [LICENSE](LICENSE).
