@echo off
REM ========================================
REM Montajim Var - Staging Deploy (local → Pi)
REM Sprint 11
REM
REM Usage:
REM   deploy-staging.bat                 — default branch "develop"
REM   deploy-staging.bat main             — deploy main branch
REM   deploy-staging.bat feat/my-branch
REM ========================================

setlocal

set BRANCH=%~1
if "%BRANCH%"=="" set BRANCH=develop

echo.
echo ========================================
echo  Montajim Var V5 - Staging Deploy
echo ========================================
echo  Branch:    %BRANCH%
echo  Target:     Pi (192.168.0.38)
echo  URL:        https://staging.montajimvar.xyz
echo  Port:       3010
echo ========================================
echo.

REM Step 1: Check Pi connectivity
echo [1/4] Checking Pi connectivity...
ping -n 2 -w 2000 192.168.0.38 >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Cannot reach 192.168.0.38
    pause
    exit /b 1
)
echo OK: Pi is reachable
echo.

REM Step 2: Upload source files (excluding node_modules and .next)
echo [2/4] Uploading source files to Pi...
pscp -pw 123456 -r -batch src pi@192.168.0.38:/home/pi/staging/src
if %errorlevel% neq 0 goto :uploadfail
pscp -pw 123456 -r -batch public pi@192.168.0.38:/home/pi/staging/public
if %errorlevel% neq 0 goto :uploadfail
pscp -pw 123456 -r -batch prisma pi@192.168.0.38:/home/pi/staging/prisma
if %errorlevel% neq 0 goto :uploadfail
pscp -pw 123456 -batch package.json pi@192.168.0.38:/home/pi/staging/package.json
if %errorlevel% neq 0 goto :uploadfail
pscp -pw 123456 -batch package-lock.json pi@192.168.0.38:/home/pi/staging/package-lock.json
if %errorlevel% neq 0 goto :uploadfail
pscp -pw 123456 -batch next.config.js pi@192.168.0.38:/home/pi/staging/next.config.js
if %errorlevel% neq 0 goto :uploadfail
pscp -pw 123456 -batch tsconfig.json pi@192.168.0.38:/home/pi/staging/tsconfig.json
if %errorlevel% neq 0 goto :uploadfail
pscp -pw 123456 -batch postcss.config.mjs pi@192.168.0.38:/home/pi/staging/postcss.config.mjs
if %errorlevel% neq 0 goto :uploadfail
echo OK: Files uploaded
echo.

REM Step 3: Upload deploy-staging.sh & .env.staging (if exists locally)
echo [3/4] Uploading deploy script + env...
pscp -pw 123456 -batch scripts\deploy-staging.sh pi@192.168.0.38:/home/pi/staging/deploy-staging.sh
if %errorlevel% neq 0 goto :uploadfail
if exist .env.staging (
    echo  Uploading .env.staging
    pscp -pw 123456 -batch .env.staging pi@192.168.0.38:/home/pi/staging/.env.staging
    if %errorlevel% neq 0 goto :uploadfail
)
echo OK: Script + env uploaded
echo.

REM Step 4: Run staging deploy on Pi
echo [4/4] Running staging deploy on Pi...
plink -pw 123456 pi@192.168.0.38 "chmod +x /home/pi/staging/deploy-staging.sh && bash /home/pi/staging/deploy-staging.sh %BRANCH%"
if %errorlevel% neq 0 (
    echo ERROR: Staging deployment failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Staging Deployment Complete!
echo ========================================
echo  URL: https://staging.montajimvar.xyz
echo  Health: https://staging.montajimvar.xyz/api/health
echo ========================================
pause
exit /b 0

:uploadfail
echo ERROR: Upload failed
pause
exit /b 1
