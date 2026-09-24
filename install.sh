#!/usr/bin/env sh
set -eu

REPO="BaseMax/neyx"
INSTALL_DIR="${NEYX_INSTALL_DIR:-$HOME/.neyx/bin}"

os=$(uname -s)
arch=$(uname -m)

case "$os" in
  Linux)
    case "$arch" in
      x86_64|amd64) target="linux-x86_64" ;;
      *)
        echo "neyx: no prebuilt binary for linux/$arch yet." >&2
        echo "Build from source instead, see BUILD-SOURCE.md" >&2
        exit 1
        ;;
    esac
    ;;
  Darwin)
    case "$arch" in
      arm64) target="macos-arm64" ;;
      *)
        echo "neyx: no prebuilt binary for macOS/$arch yet (only Apple Silicon is built)." >&2
        echo "Build from source instead, see BUILD-SOURCE.md" >&2
        exit 1
        ;;
    esac
    ;;
  *)
    echo "neyx: unsupported OS '$os'. On Windows, use install.ps1 or install.bat instead." >&2
    exit 1
    ;;
esac

echo "Looking up the latest neyx release for $target..."
json=$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest")

asset_url=$(printf '%s' "$json" \
  | grep -o "\"browser_download_url\": *\"[^\"]*neyx-v[^\"]*-${target}\.tar\.gz\"" \
  | head -n 1 \
  | sed -E 's/.*"(https:[^"]+)"/\1/')

if [ -z "$asset_url" ]; then
  echo "neyx: could not find a release asset for $target." >&2
  echo "Check https://github.com/$REPO/releases or build from source, see BUILD-SOURCE.md" >&2
  exit 1
fi

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

echo "Downloading $asset_url"
curl -fsSL "$asset_url" -o "$tmp/neyx.tar.gz"
tar -xzf "$tmp/neyx.tar.gz" -C "$tmp"

mkdir -p "$INSTALL_DIR"
mv "$tmp/neyx" "$INSTALL_DIR/neyx"
chmod +x "$INSTALL_DIR/neyx"

echo "Installed neyx to $INSTALL_DIR/neyx"

case ":$PATH:" in
  *":$INSTALL_DIR:"*)
    ;;
  *)
    shell_rc="$HOME/.profile"
    case "${SHELL:-}" in
      */zsh) shell_rc="$HOME/.zshrc" ;;
      */bash) shell_rc="$HOME/.bashrc" ;;
    esac
    if [ ! -f "$shell_rc" ] || ! grep -qF "$INSTALL_DIR" "$shell_rc" 2>/dev/null; then
      printf '\nexport PATH="%s:$PATH"\n' "$INSTALL_DIR" >> "$shell_rc"
      echo "Added $INSTALL_DIR to PATH in $shell_rc"
    fi
    echo "Restart your shell (or run: . $shell_rc), then try: neyx version"
    ;;
esac

"$INSTALL_DIR/neyx" version || true
