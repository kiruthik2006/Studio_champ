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

echo -e "${YELLOW}Stopping backend server...${NC}"
pkill -f "python app.py" 2>/dev/null
echo -e "${GREEN}✅ Backend stopped${NC}"

echo -e "${YELLOW}Stopping frontend server...${NC}"
pkill -f "http.server 8000" 2>/dev/null
pkill -f "python -m http.server" 2>/dev/null
echo -e "${GREEN}✅ Frontend stopped${NC}"

echo ""
echo -e "${GREEN}All services stopped successfully!${NC}"
