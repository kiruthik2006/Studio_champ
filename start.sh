#!/bin/bash

# FaceRec Events - Complete Startup Script
# This script starts both the Flask backend and the React frontend Vite dev server

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to the script directory
cd "$SCRIPT_DIR" || exit 1

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_PORT=5001
FRONTEND_PORT=8000
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend-react"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to kill process on a port
kill_port() {
    local port=$1
    if check_port $port; then
        print_warning "Port $port is already in use. Stopping existing process..."
        lsof -ti:$port | xargs kill -9 2>/dev/null
        sleep 1
    fi
}

# Function to check if Python is available
check_python() {
    if command -v python3 &> /dev/null; then
        echo "python3"
    elif command -v python &> /dev/null; then
        echo "python"
    else
        print_error "Python is not installed or not in PATH"
        exit 1
    fi
}

# Display banner
clear
echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║      🎭 FaceRec Events (Studio Champ) - React + AI         ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

print_status "Script directory: $SCRIPT_DIR"

# Verify directories exist
if [ ! -d "$BACKEND_DIR" ]; then
    print_error "Backend directory not found: $BACKEND_DIR"
    exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
    print_error "Frontend directory not found: $FRONTEND_DIR"
    exit 1
fi

print_success "Directory structure verified"

# Get Python command
PYTHON_CMD=$(check_python)
print_status "Using Python: $PYTHON_CMD"

# Check if virtual environment exists
if [ ! -d "$BACKEND_DIR/venv" ]; then
    print_status "Creating virtual environment..."
    cd "$BACKEND_DIR" && $PYTHON_CMD -m venv venv
    if [ $? -ne 0 ]; then
        print_error "Failed to create virtual environment"
        exit 1
    fi
    print_success "Virtual environment created"
fi

# Kill any existing processes on the ports
kill_port $BACKEND_PORT
kill_port $FRONTEND_PORT

# Start Backend Server
print_status "Starting Flask Backend Server..."
print_status "Backend directory: $BACKEND_DIR"
cd "$BACKEND_DIR" || { print_error "Cannot access $BACKEND_DIR"; exit 1; }

# Activate virtual environment
VENV_BIN=""
if [ -f "venv/bin/activate" ]; then
    VENV_BIN="venv/bin"
elif [ -f "venv/Scripts/activate" ]; then
    VENV_BIN="venv/Scripts"
else
    print_error "Virtual environment activation script not found"
    exit 1
fi

# Use venv binaries for subsequent commands
PIP_CMD="$VENV_BIN/pip"
PYTHON_CMD_VENV="$VENV_BIN/python"

# Install backend dependencies from requirements.txt
print_status "Installing/Updating backend dependencies..."
$PIP_CMD install -r requirements.txt
if [ $? -ne 0 ]; then
    print_warning "Some packages may have failed to install, but continuing..."
fi

# Start the Flask app
$PYTHON_CMD_VENV app.py > /tmp/facerec_backend.log 2>&1 &
BACKEND_PID=$!
print_success "Backend server started (PID: $BACKEND_PID)"

# Wait for backend to be ready
print_status "Waiting for backend to initialize..."
for i in {1..30}; do
    if curl -s http://localhost:$BACKEND_PORT/api/health >/dev/null 2>&1; then
        print_success "Backend is ready!"
        break
    fi
    sleep 1
    if [ $i -eq 30 ]; then
        print_error "Backend failed to start within 30 seconds"
        print_status "Check logs: /tmp/facerec_backend.log"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
done

# Start Frontend React Vite Server
print_status "Starting React Vite Dev Server..."
print_status "React directory: $FRONTEND_DIR"
cd "$FRONTEND_DIR" || { print_error "Cannot access $FRONTEND_DIR"; exit 1; }

# Check node_modules
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
fi

# Start Vite dev server
npx vite --port $FRONTEND_PORT --host > /tmp/facerec_frontend.log 2>&1 &
FRONTEND_PID=$!
print_success "React Frontend server started (PID: $FRONTEND_PID)"

# Wait for frontend to be ready
print_status "Waiting for React dev server to initialize..."
for i in {1..15}; do
    if curl -s http://localhost:$FRONTEND_PORT >/dev/null 2>&1; then
        print_success "React Frontend is ready!"
        break
    fi
    sleep 1
    if [ $i -eq 15 ]; then
        print_warning "React frontend may still be compiling..."
    fi
done

# Display success message
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✅ FaceRec Events (React SPA) is running!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Access the application:${NC}"
echo -e "  🌐 React App:   ${YELLOW}http://localhost:$FRONTEND_PORT${NC}"
echo -e "  ⚙️  Backend API: ${YELLOW}http://localhost:$BACKEND_PORT${NC}"
echo -e "  🔍 Health:      ${YELLOW}http://localhost:$BACKEND_PORT/api/health${NC}"
echo ""
echo -e "${BLUE}Default Admin Account:${NC}"
echo -e "  📧 Email:    ${YELLOW}admin@facerec.com${NC}"
echo -e "  🔑 Password: ${YELLOW}admin123${NC}"
echo ""
echo -e "${BLUE}Log Files:${NC}"
echo -e "  📄 Backend:  ${YELLOW}/tmp/facerec_backend.log${NC}"
echo -e "  📄 Frontend: ${YELLOW}/tmp/facerec_frontend.log${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    print_status "Shutting down services..."
    
    # Kill backend
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID 2>/dev/null
        print_success "Backend server stopped"
    fi
    
    # Kill frontend
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID 2>/dev/null
        print_success "React frontend server stopped"
    fi
    
    print_success "All services stopped. Goodbye!"
    exit 0
}

# Set trap for Ctrl+C
trap cleanup INT

# Keep the script running
while true; do
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        print_error "Backend server stopped unexpectedly!"
        print_status "Check logs: /tmp/facerec_backend.log"
        cleanup
    fi
    
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        print_error "Frontend server stopped unexpectedly!"
        print_status "Check logs: /tmp/facerec_frontend.log"
        cleanup
    fi
    
    sleep 2
done
