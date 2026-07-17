@echo off
REM ========================================
REM Montajim Var - Preview Router Setup (Pi)
REM Sprint 11
REM
REM Installs and starts the preview router on Pi:
REM   - Uploads scripts/preview-router.mjs to /home/pi/preview-router/
REM   - Starts PM2 process "montajimvar-preview-router" on port 3019
REM   - cloudflared wildcard *.test.montajimvar.xyz → 3019
REM
REM Usage: setup-preview-router.bat
REM ========================================

setlocal

echo.
echo ========================================
echo  Preview Router Setup (Pi)
echo ========================================
echo  Target:  Pi (192.168.0.38)
echo  File:    /home/pi/preview-router/preview-router.mjs
echo  Port:    3019 (router)
echo  Range:   3020-3099 (preview processes)
echo ========================================
echo.

echo [1/3] Checking Pi connectivity...
ping -n 2 -w 2000 192.168.0.38 >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Cannot reach Pi
    pause
    exit /b 1
)
echo OK
echo.

echo [2/3] Uploading preview-router.mjs to Pi...
plink -pw 123456 pi@192.168.0.38 "mkdir -p /home/pi/preview-router"
if %errorlevel% neq 0 (
    echo ERROR: Could not create /home/pi/preview-router dir
    pause
    exit /b 1
)
pscp -pw 123456 -batch scripts\preview-router.mjs pi@192.168.0.38:/home/pi/preview-router/preview-router.mjs
if %errorlevel% neq 0 (
    echo ERROR: Upload failed
    pause
    exit /b 1
)
echo OK
echo.

echo [3/3] Starting/stopping PM2 process "montajimvar-preview-router"...
plink -pw 123456 pi@192.168.0.38 "pm2 delete montajimvar-preview-router 2>/dev/null; pm2 start /home/pi/preview-router/preview-router.mjs --name montajimvar-preview-router --interpreter node --max-memory-restart 128M && pm2 save && sleep 2 && curl -s http://localhost:3019/__router_health"
if %errorlevel% neq 0 (
    echo ERROR: PM2 start failed (is Node.js installed on Pi?)
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Preview Router installed!
echo ========================================
echo  Routes: *.test.montajimvar.xyz → previews on ports 3020-3099
echo  Health: https://preview-router.test.montajimvar.xyz/__router_health
echo  Logs:   pm2 logs montajimvar-preview-router --lines 50
echo ========================================
pause
exit /b 0
