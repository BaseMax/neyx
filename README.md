# Neyx

Neyx is a lightweight, ultra-fast, feature-rich static site generator written entirely in the Salam programming language.

Static sites. Native speed. Written in Salam.

## Status

Early development. The CLI skeleton and command dispatch are in place; content loading, templating, and the build pipeline are being built out incrementally.

## Requirements

- The [Salam](https://github.com/SalamLang/Salam) compiler on your `PATH`.

## Building

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

## License

See [LICENSE](LICENSE).
