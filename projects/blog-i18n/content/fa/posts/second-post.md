---
title: "چرا سه زبان"
description: "یادداشتی کوتاه درباره‌ی اینکه چرا این سایت به سه زبان است."
date: "2026-09-10"
tags: ["meta"]
layout: post
---

# چرا سه زبان

Neyx به‌طور خودکار تشخیص می‌دهد که `content/en/posts/second-post.md`، `content/fa/posts/second-post.md` و `content/ar/posts/second-post.md` همان صفحه به سه زبان هستند، چون در پوشه‌ی هر زبان مسیر یکسانی دارند. سپس هر صفحه برچسب‌های `hreflang` به نسخه‌های دیگر خود می‌گیرد و یک تعویض‌گر زبان در قالب می‌تواند آن‌ها را با `{{ each t in translations }}` فهرست کند.
