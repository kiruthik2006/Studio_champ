#!/bin/bash

# FaceRec Events - Stop All Services Script

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         🛑 Stopping FaceRec Events Services                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Stopping backend server (Port 5001)...${NC}"
pkill -f "python app.py" 2>/dev/null
lsof -ti:5001 | xargs kill -9 2>/dev/null
echo -e "${GREEN}✅ Backend stopped${NC}"

echo -e "${YELLOW}Stopping React frontend server (Port 8000)...${NC}"
pkill -f "vite" 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null
echo -e "${GREEN}✅ Frontend stopped${NC}"

echo ""
echo -e "${GREEN}All services stopped successfully!${NC}"
