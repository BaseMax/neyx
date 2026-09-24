# blog

A single-language blog with tags, pagination, and feeds.

## What this shows

- A dated `posts/` collection, sorted newest first automatically
- Tag taxonomy (`tags: [...]` in front matter) generating `/tags/<tag>/`
  and `/tags/` pages, linked from each post
- Pagination (`paginate: true` + `pagination_size: 3` in the config) —
  6 posts split across `/`, `/page/2/`
- A draft post (`draft: true`) excluded from a normal build; run
  `neyx build --drafts` or `neyx dev --drafts` to include it
- Per-post table of contents (`{{ & toc }}`) generated from `##` headings
- RSS (`/feed.xml`) and Atom (`/atom.xml`) feeds, linked in the page head
- Three layouts: `default.html` (about page), `blog.html` (paginated
  listing), `post.html` (individual posts)
- Markdown tables, task lists, strikethrough, code fences, and blockquotes
  across the posts

## Build it

```bash
neyx build
neyx preview
```
