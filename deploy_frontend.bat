@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ========================================
REM   智语·云枢 (SapientiaCloud-EduPivot) 
REM   前端 Vue 一键部署脚本 (pnpm版)
REM ========================================

REM --- 1. 服务器配置 ---
set SERVER_PASSWORD=Ez54088zz
set SERVER_USER=root
set SERVER_IP=117.72.194.197
set SERVER_PATH=/var/www/SapientiaCloud-EduPivot
set DATE_STR=%date% %time%

echo ========================================
echo   [Deploying Frontend...]
echo   Server: %SERVER_IP%
echo   Path: %SERVER_PATH%
echo ========================================
echo.

REM 检查工具是否可用
where plink >nul 2>&1
if errorlevel 1 (
    echo [Error] plink not found. Please install PuTTY.
    pause
    exit /b 1
)

REM 步骤 1: 本地打包
echo [Step 1/3] Running local build (pnpm run build)...
echo.
call pnpm run build
if errorlevel 1 (
    echo.
    echo [Error] Build failed! Please check your code.
    pause
    exit /b 1
)
echo.
echo [Success] Local build completed!
echo.

REM 步骤 2: 清理服务器旧文件
echo [Step 2/3] Cleaning up old files on server...
echo.
echo %SERVER_PASSWORD%| plink -ssh -pw %SERVER_PASSWORD% %SERVER_USER%@%SERVER_IP% "mkdir -p %SERVER_PATH% && rm -rf %SERVER_PATH%/*"
if errorlevel 1 (
    echo [Error] Failed to clean up server files.
    pause
    exit /b 1
)
echo [Success] Server files cleaned.
echo.

REM 步骤 3: 传输新文件
echo [Step 3/3] Uploading new files to server...
echo.
echo y | pscp -pw %SERVER_PASSWORD% -r .\dist\* %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/
if errorlevel 1 (
    echo.
    echo [Error] File transfer failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Deployment Completed Successfully!
echo ========================================
echo.
echo [Deployment Summary]
echo ----------------------------------------
echo   - Server IP   : %SERVER_IP%
echo   - Target Path : %SERVER_PATH%
echo   - Finish Time : %DATE_STR%
echo ----------------------------------------
echo.
echo [Troubleshooting Tips]
echo   1. If site is unreachable, check Nginx config.
echo   2. If 403 Forbidden, check permissions (chmod -R 755).
echo.
pause