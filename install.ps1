$ErrorActionPreference = "Stop"

$Repo = "BaseMax/neyx"
$InstallDir = if ($env:NEYX_INSTALL_DIR) { $env:NEYX_INSTALL_DIR } else { "$env:USERPROFILE\.neyx\bin" }

if ($env:PROCESSOR_ARCHITECTURE -ne "AMD64") {
    Write-Error "neyx: no prebuilt binary for Windows/$($env:PROCESSOR_ARCHITECTURE) yet (only x86_64 is built). Build from source instead, see BUILD-SOURCE.md"
    exit 1
}
$Target = "windows-x86_64"

Write-Host "Looking up the latest neyx release for $Target..."
$release = Invoke-RestMethod -Uri "https://api.github.com/repos/$Repo/releases/latest"
$asset = $release.assets | Where-Object { $_.name -match "^neyx-v[\w.]+-$Target\.zip$" } | Select-Object -First 1

if (-not $asset) {
    Write-Error "neyx: could not find a release asset for $Target. Check https://github.com/$Repo/releases or build from source, see BUILD-SOURCE.md"
    exit 1
}

$tmp = Join-Path ([System.IO.Path]::GetTempPath()) ([System.Guid]::NewGuid())
New-Item -ItemType Directory -Path $tmp | Out-Null
$zipPath = Join-Path $tmp "neyx.zip"

Write-Host "Downloading $($asset.browser_download_url)"
Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $zipPath
Expand-Archive -Path $zipPath -DestinationPath $tmp -Force

New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
Copy-Item -Path (Join-Path $tmp "neyx.exe") -Destination (Join-Path $InstallDir "neyx.exe") -Force
Remove-Item -Recurse -Force $tmp

Write-Host "Installed neyx to $InstallDir\neyx.exe"

$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$InstallDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$InstallDir", "User")
    Write-Host "Added $InstallDir to your user PATH. Restart your terminal, then try: neyx version"
} else {
    Write-Host "Try: neyx version"
}

& "$InstallDir\neyx.exe" version
