# blog-i18n

A blog in three languages: English, Persian, and Arabic.

## What this shows

- `languages: ["en", "fa", "ar"]` in the config, splitting `content/`
  into `content/en/`, `content/fa/`, `content/ar/`. Each becomes its
  own route prefix (`/en/`, `/fa/`, `/ar/`)
- Automatic RTL: `{{ dir }}` resolves to `rtl` for `fa`/`ar` and `ltr`
  for `en`, and the layouts use it directly (`<html dir="{{ dir }}">`)
- hreflang linking: `content/en/posts/second-post.md`,
  `content/fa/posts/second-post.md`, and
  `content/ar/posts/second-post.md` share the same path under each
  language directory, so Neyx treats them as translations of each
  other automatically, no extra front matter needed. Each page gets
  `<link rel="alternate" hreflang="...">` tags and a language switcher
  (`{{ each t in translations }}`) that jumps to the same post in
  another language, not just that language's home page
- `pages`/`posts` collections are scoped per language, so the Persian
  blog index only ever lists Persian posts

## Build it

```bash
neyx build
neyx preview
```

Then compare `/en/`, `/fa/`, and `/ar/` in the browser.
