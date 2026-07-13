@echo off
REM ========================================
REM Montajim Var - Local Deploy Script
REM ========================================

echo.
echo ========================================
echo Montajim Var V5 - Local Pi Deployment
echo ========================================
echo.

REM Step 1: Check if Pi is reachable
echo [1/6] Checking Pi connectivity...
ping -n 2 192.168.0.38 >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Cannot reach 192.168.0.38
    echo Make sure your Pi is on and connected to the same network
    pause
    exit /b 1
)
echo OK: Pi is reachable
echo.

REM Step 2: Get current commit
echo [2/6] Getting current git commit...
for /f "tokens=*" %%a in ('git rev-parse --short HEAD') do set COMMIT=%%a
echo Current commit: %COMMIT%
echo.

REM Step 3: Create deploy directory on Pi
echo [3/6] Creating deployment directory on Pi...
plink -pw 123456 pi@192.168.0.38 "mkdir -p /home/pi/deploy/montajimvar-%COMMIT%"
if %errorlevel% neq 0 (
    echo ERROR: Could not create deploy directory
    echo Make sure plink/pscp is installed or use SSH from WSL
    pause
    exit /b 1
)
echo OK: Directory created
echo.

REM Step 4: Upload files (excluding heavy folders)
echo [4/6] Uploading files to Pi... (this may take a while)
pscp -pw 123456 -r ^
    src ^
    public ^
    prisma ^
    package.json ^
    package-lock.json ^
    next.config.js ^
    tsconfig.json ^
    postcss.config.mjs ^
    .next ^
    .env ^
    .env.local ^
    pi@192.168.0.38:/home/pi/deploy/montajimvar-%COMMIT%/
if %errorlevel% neq 0 (
    echo ERROR: Upload failed
    pause
    exit /b 1
)
echo OK: Files uploaded
echo.

REM Step 5: Run deployment on Pi
echo [5/6] Running deployment on Pi...
plink -pw 123456 pi@192.168.0.38 "bash -s" < deploy-on-pi.sh %COMMIT%
if %errorlevel% neq 0 (
    echo ERROR: Deployment command failed
    pause
    exit /b 1
)
echo OK: Deployed
echo.

echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Site should be available at:
echo   http://192.168.0.38:3000
echo.
pause
