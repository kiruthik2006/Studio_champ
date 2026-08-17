@echo off
setlocal
echo ===================================================
echo   Studio Champ v2.4 - Windows Launch Script
echo ===================================================

cd /d "%~dp0"

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not found in PATH. Please install Python 3.9+ from python.org
    pause
    exit /b 1
)

REM Use universal cross-platform runner
python run.py start

endlocal
