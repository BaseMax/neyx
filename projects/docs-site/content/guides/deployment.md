---
title: "Deployment"
description: "Ship your build to a static host."
---

# Deployment

## Any static host works

Since the output is plain HTML, CSS, and JS, any static host works: GitHub Pages, Netlify, Cloudflare Pages, S3, or a single nginx box.

## Checklist

- [x] Run a production build
- [x] Check for broken links
- [ ] Point DNS at the new host

## A note on caching

> Set a long cache lifetime on hashed assets and a short one on HTML. Nothing here hashes filenames yet, so keep HTML caching short everywhere for now.
