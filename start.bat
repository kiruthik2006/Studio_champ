@echo off
chcp 65001 >nul
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║         🎭 FaceRec Events - AI Photo Discovery             ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

set BACKEND_PORT=5001
set FRONTEND_PORT=8000
set BACKEND_DIR=%~dp0backend
set FRONTEND_DIR=%~dp0frontend

echo [INFO] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    exit /b 1
)
echo [SUCCESS] Python found

if not exist "%BACKEND_DIR%\venv" (
    echo [INFO] Creating virtual environment...
    cd /d "%BACKEND_DIR%"
    python -m venv venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment
        exit /b 1
    )
    echo [SUCCESS] Virtual environment created
)

echo [INFO] Starting Flask Backend Server...
cd /d "%BACKEND_DIR%"
call venv\Scripts\activate.bat

python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo [INFO] Installing backend dependencies...
    pip install -q flask flask-sqlalchemy flask-jwt-extended flask-cors flask-migrate pymysql bcrypt pillow opencv-python-headless numpy python-dotenv werkzeug marshmallow marshmallow-sqlalchemy piexif
)

start /B python app.py > %TEMP%\facerec_backend.log 2>&1
echo [SUCCESS] Backend server started

echo [INFO] Waiting for backend to initialize...
:check_backend
ping -n 2 127.0.0.1 >nul
curl -s http://localhost:%BACKEND_PORT%/api/health >nul 2>&1
if errorlevel 1 goto check_backend
echo [SUCCESS] Backend is ready!

echo [INFO] Starting Frontend HTTP Server...
cd /d "%FRONTEND_DIR%"
start /B python -m http.server %FRONTEND_PORT% > %TEMP%\facerec_frontend.log 2>&1
echo [SUCCESS] Frontend server started

echo [INFO] Waiting for frontend to initialize...
timeout /t 2 /nobreak >nul

echo.
echo ════════════════════════════════════════════════════════════
echo   ✅ All services started successfully!
echo ════════════════════════════════════════════════════════════
echo.
echo Access the application:
echo   🌐 Frontend:    http://localhost:%FRONTEND_PORT%
echo   ⚙️  Backend API: http://localhost:%BACKEND_PORT%
echo   🔍 Health:      http://localhost:%BACKEND_PORT%/api/health
echo.
echo Default Login:
echo   📧 Email:    admin@facerec.com
echo   🔑 Password: admin123
echo.
echo Log Files:
echo   📄 Backend:  %TEMP%\facerec_backend.log
echo   📄 Frontend: %TEMP%\facerec_frontend.log
echo.
echo Press any key to stop all services...
pause >nul

echo.
echo [INFO] Shutting down services...
taskkill /F /IM python.exe >nul 2>&1
echo [SUCCESS] All services stopped. Goodbye!
