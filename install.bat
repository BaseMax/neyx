@echo off
setlocal
set "SCRIPT_URL=https://raw.githubusercontent.com/BaseMax/neyx/main/install.ps1"
powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((New-Object Net.WebClient).DownloadString('%SCRIPT_URL%'))"
endlocal
