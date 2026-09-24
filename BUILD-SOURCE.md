# Building Neyx from source

Most people should just install a prebuilt binary, see the "Install" section
in [README.md](README.md). Build from source instead if you want to
contribute, need a platform without a prebuilt binary, or want the latest
unreleased code.

## 1. Install the Salam compiler

Neyx is written in [Salam](https://github.com/SalamLang/Salam) and needs the
`salam` compiler on your `PATH` to build.

macOS / Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/SalamLang/Salam/refs/heads/main/install.sh | sh
```

Windows (PowerShell):

```powershell
irm https://raw.githubusercontent.com/SalamLang/Salam/refs/heads/main/install.ps1 | iex
```

Check it worked:

```bash
salam version
```

Neyx's CI builds against Salam `0.4.4`; if something doesn't compile, try
pinning that version:

```bash
curl -fsSL https://raw.githubusercontent.com/SalamLang/Salam/refs/heads/main/install.sh | sh -s -- --version 0.4.4
```

## 2. Clone the repository

```bash
git clone https://github.com/BaseMax/neyx.git
cd neyx
```

## 3. Build

```bash
salam build
```

This produces a `neyx` binary in the repository root (`neyx.exe` if you pass
`--output=neyx.exe` on Windows, matching what CI does):

```bash
salam build neyx.salam --output=neyx.exe
```

## 4. Verify

```bash
./neyx version
./neyx new my-site
cd my-site
../neyx dev
```

## Releases

Version tags are cut from the `VERSION` constant in
`internal/cli/app.salam`. A push to `main` whose commit message starts with
`release:` triggers `.github/workflows/build-release.yml`, which builds and
smoke-tests `neyx` on Linux, macOS, and Windows (including a live hot-reload
check), then packages each platform binary as `.zip`, `.tar.gz`, and `.7z`
and publishes them to a GitHub release tagged `v<VERSION>`. Any other push
just builds and tests, it does not publish anything.
