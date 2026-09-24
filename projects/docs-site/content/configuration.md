---
title: "Configuration"
description: "All the settings, in one place."
---

# Configuration

## File format

Configuration lives in `widget.config.yml`, at the project root.

| Key | Default | Description |
| --- | --- | --- |
| `output` | `dist` | Where built files go |
| `strict` | `false` | Fail the build on warnings |

## Example

<div class="callout">
Changing <code>output</code> after your first build? Run <code>widget clean</code> first.
</div>

```yaml
title: "My Project"
output: "dist"
strict: true
```
