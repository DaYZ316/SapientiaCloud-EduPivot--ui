@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

set SERVER_PASSWORD=Ez54088zz
set SERVER_USER=root
set SERVER_IP=117.72.194.197
set SERVER_PATH=/var/www/SapientiaCloud-EduPivot

echo ========================================
echo     SapientiaCloud-EduPivot 部署脚本
echo ========================================
echo.

REM 检查 plink 和 pscp 是否可用
where plink >nul 2>&1
if errorlevel 1 (
    echo ❌ 未找到 plink，请先安装 PuTTY
    echo 下载地址: https://www.chiark.greenend.org.uk/~sgtatham/putty/
    pause
    exit /b 1
)

REM 步骤 1: 本地打包
echo [步骤 1/3] 正在打包项目...
echo.
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ 打包失败！请检查错误信息。
    pause
    exit /b 1
)
echo.
echo ✓ 打包成功！
echo.

REM 步骤 2: 清理服务器旧文件
echo [步骤 2/3] 正在清理服务器旧文件...
echo.
echo %SERVER_PASSWORD%| plink -ssh -pw %SERVER_PASSWORD% %SERVER_USER%@%SERVER_IP% "rm -rf %SERVER_PATH%/*"
if errorlevel 1 (
    echo.
    echo ❌ 清理服务器文件失败！请检查网络连接和服务器状态。
    pause
    exit /b 1
)
echo.
echo ✓ 服务器旧文件清理完成！
echo.

REM 步骤 3: 上传新文件
echo [步骤 3/3] 正在上传新版本到服务器...
echo.
pscp -pw %SERVER_PASSWORD% -r ./dist/* %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/
if errorlevel 1 (
    echo.
    echo ❌ 文件上传失败！请检查网络连接和服务器状态。
    pause
    exit /b 1
)
echo.
echo ✓ 文件上传完成！
echo.

REM 完成提示
echo ========================================
echo 🉐 部署完成！
echo ========================================
echo.
echo 部署信息：
echo   - 服务器地址: %SERVER_IP%
echo   - 部署路径: %SERVER_PATH%
echo   - 部署时间: %date% %time%
echo.
echo 提示：如果网站无法访问，请检查：
echo   1. nginx 服务是否正常运行
echo   2. nginx 配置文件是否正确
echo   3. 文件权限是否正确
echo.
pause