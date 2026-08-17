#!/usr/bin/env python3
"""
Studio Champ - Universal Cross-Platform Automation & Process Runner
Supports: Windows, macOS (Apple Silicon & Intel), and Linux

Usage:
  python run.py start    # Starts both Backend (port 5001) and Frontend (port 8000)
  python run.py stop     # Gracefully stops running services
  python run.py status   # Displays live health and port binding status
  python run.py setup    # Installs cross-platform dependencies for host OS
"""

import sys
import os
import subprocess
import socket
import time
import signal
import platform
import shutil

# Configuration
BACKEND_PORT = 5001
FRONTEND_PORT = 8000
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend-react")
IS_WINDOWS = sys.platform.startswith("win")
IS_MACOS = sys.platform == "darwin"
IS_ARM64 = platform.machine().lower() in ("arm64", "aarch64")

# Terminal formatting
GREEN = "\033[92m" if not IS_WINDOWS or os.getenv("TERM") else ""
YELLOW = "\033[93m" if not IS_WINDOWS or os.getenv("TERM") else ""
RED = "\033[91m" if not IS_WINDOWS or os.getenv("TERM") else ""
CYAN = "\033[96m" if not IS_WINDOWS or os.getenv("TERM") else ""
RESET = "\033[0m" if not IS_WINDOWS or os.getenv("TERM") else ""

def print_info(msg):
    print(f"{CYAN}[INFO]{RESET} {msg}")

def print_success(msg):
    print(f"{GREEN}[SUCCESS]{RESET} {msg}")

def print_warn(msg):
    print(f"{YELLOW}[WARN]{RESET} {msg}")

def print_error(msg):
    print(f"{RED}[ERROR]{RESET} {msg}")

def is_port_in_use(port):
    """Check if a port is in use using cross-platform socket connect"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex(("127.0.0.1", port)) == 0

def get_python_exe():
    """Detect virtual environment python executable or fallback to system python"""
    if IS_WINDOWS:
        venv_py = os.path.join(BACKEND_DIR, "venv", "Scripts", "python.exe")
        if os.path.exists(venv_py):
            return venv_py
        return sys.executable or "python"
    else:
        venv_py = os.path.join(BACKEND_DIR, "venv", "bin", "python")
        if os.path.exists(venv_py):
            return venv_py
        return sys.executable or "python3"

def get_npm_cmd():
    """Resolve npm / npx command across Windows and POSIX"""
    if IS_WINDOWS:
        return shutil.which("npm.cmd") or shutil.which("npm") or "npm.cmd"
    return shutil.which("npm") or "npm"

def setup_environment():
    """Setup dependencies according to the host platform"""
    print_info(f"Detected Platform: {platform.system()} ({platform.machine()})")
    
    # 1. Backend venv setup
    venv_dir = os.path.join(BACKEND_DIR, "venv")
    if not os.path.exists(venv_dir):
        print_info("Creating Python virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", venv_dir], cwd=BACKEND_DIR, check=True)
    
    py_exe = get_python_exe()
    print_info(f"Upgrading pip and installing dependencies via {py_exe}...")
    subprocess.run([py_exe, "-m", "pip", "install", "--upgrade", "pip"], cwd=BACKEND_DIR)
    
    req_file = os.path.join(BACKEND_DIR, "requirements.txt")
    if os.path.exists(req_file):
        subprocess.run([py_exe, "-m", "pip", "install", "-r", req_file], cwd=BACKEND_DIR, check=True)
    
    # 2. Frontend node_modules setup
    npm_cmd = get_npm_cmd()
    node_modules = os.path.join(FRONTEND_DIR, "node_modules")
    if not os.path.exists(node_modules):
        print_info("Installing frontend npm dependencies...")
        subprocess.run([npm_cmd, "install"], cwd=FRONTEND_DIR, check=True)
    
    print_success("Cross-platform environment setup complete!")

def start_services():
    """Start both backend and frontend servers with live monitoring"""
    print_info("=" * 60)
    print_info(f"Studio Champ v2.4 Universal Runner")
    print_info(f"Host OS: {platform.system()} {platform.release()} ({platform.machine()})")
    print_info("=" * 60)

    # Check ports
    if is_port_in_use(BACKEND_PORT):
        print_warn(f"Port {BACKEND_PORT} is already bound. Backend may already be running.")
    if is_port_in_use(FRONTEND_PORT):
        print_warn(f"Port {FRONTEND_PORT} is already bound. Frontend may already be running.")

    py_exe = get_python_exe()
    npm_cmd = get_npm_cmd()

    print_info(f"Starting Backend on http://127.0.0.1:{BACKEND_PORT} ...")
    backend_proc = subprocess.Popen(
        [py_exe, "app.py"],
        cwd=BACKEND_DIR,
        env={**os.environ, "FLASK_RUN_PORT": str(BACKEND_PORT)}
    )

    print_info(f"Starting Frontend on http://localhost:{FRONTEND_PORT} ...")
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev", "--", "--port", str(FRONTEND_PORT), "--host"],
        cwd=FRONTEND_DIR
    )

    print_success("=" * 60)
    print_success(f"🚀 Studio Champ is LIVE!")
    print_success(f"👉 Frontend Dashboard: http://localhost:{FRONTEND_PORT}")
    print_success(f"👉 Backend API:       http://127.0.0.1:{BACKEND_PORT}")
    print_success("Press Ctrl+C to stop all services.")
    print_success("=" * 60)

    def shutdown(signum, frame):
        print_info("\nGracefully shutting down services...")
        try:
            frontend_proc.terminate()
            backend_proc.terminate()
            time.sleep(1)
            if frontend_proc.poll() is None:
                frontend_proc.kill()
            if backend_proc.poll() is None:
                backend_proc.kill()
        except Exception:
            pass
        print_success("All services stopped.")
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    if not IS_WINDOWS:
        signal.signal(signal.SIGTERM, shutdown)

    # Wait for processes
    try:
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None:
                print_error(f"Backend exited with code {backend_proc.returncode}")
                break
            if frontend_proc.poll() is not None:
                print_error(f"Frontend exited with code {frontend_proc.returncode}")
                break
    except KeyboardInterrupt:
        shutdown(None, None)

def check_status():
    """Report status of backend and frontend ports"""
    b_alive = is_port_in_use(BACKEND_PORT)
    f_alive = is_port_in_use(FRONTEND_PORT)

    print_info("=" * 45)
    print_info(f"Studio Champ System Status ({platform.system()})")
    print_info("=" * 45)
    
    b_status = f"{GREEN}ONLINE{RESET}" if b_alive else f"{RED}OFFLINE{RESET}"
    f_status = f"{GREEN}ONLINE{RESET}" if f_alive else f"{RED}OFFLINE{RESET}"
    
    print(f"Backend API (Port {BACKEND_PORT}):   {b_status}")
    print(f"Frontend App (Port {FRONTEND_PORT}):  {f_status}")
    print_info("=" * 45)

def stop_services():
    """Kill processes on configured ports cross-platform"""
    print_info(f"Stopping services on ports {BACKEND_PORT} and {FRONTEND_PORT}...")
    if IS_WINDOWS:
        for port in (BACKEND_PORT, FRONTEND_PORT):
            try:
                cmd = f"FOR /F \"tokens=5\" %P IN ('netstat -a -n -o ^| findstr :{port}') DO TaskKill.exe /F /PID %P"
                subprocess.run(cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            except Exception:
                pass
    else:
        for port in (BACKEND_PORT, FRONTEND_PORT):
            subprocess.run(f"lsof -ti:{port} | xargs kill -9 2>/dev/null", shell=True)
    
    time.sleep(1)
    check_status()

if __name__ == "__main__":
    action = sys.argv[1].lower() if len(sys.argv) > 1 else "start"
    if action == "start":
        start_services()
    elif action == "stop":
        stop_services()
    elif action == "status":
        check_status()
    elif action in ("setup", "install"):
        setup_environment()
    else:
        print(f"Usage: python run.py [start|stop|status|setup]")
