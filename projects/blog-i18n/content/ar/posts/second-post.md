---
title: "لماذا ثلاث لغات"
description: "ملاحظة قصيرة عن سبب وجود هذا الموقع بثلاث لغات."
date: "2026-09-10"
tags: ["meta"]
layout: post
---

# لماذا ثلاث لغات

يكتشف NeyX أن `content/en/posts/second-post.md` و`content/fa/posts/second-post.md` و`content/ar/posts/second-post.md` هي نفس الصفحة بثلاث لغات، لأنها تشترك في نفس المسار داخل كل مجلد لغة. تحصل كل صفحة بعدها على وسوم `hreflang` تشير إلى أشقائها، ويمكن لمبدّل اللغة في القالب سرد هذه الأشقاء باستخدام `{{ each t in translations }}`.
