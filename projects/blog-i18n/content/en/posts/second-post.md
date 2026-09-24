---
title: "Why three languages"
description: "A short note on why this site exists in three languages."
date: "2026-09-10"
tags: ["meta"]
layout: post
---

# Why three languages

Neyx notices that `content/en/posts/second-post.md`, `content/fa/posts/second-post.md`, and `content/ar/posts/second-post.md` are the same page in three languages, because they share the same path under each language directory. Each page then gets `<link rel="alternate" hreflang="...">` tags pointing at its siblings, and a language switcher in the layout can list them with `{{ each t in translations }}`.
