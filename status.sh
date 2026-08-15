#!/bin/bash

# FaceRec Events - Status Check Script

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         🔍 FaceRec Events - Service Status                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check backend
if curl -s http://localhost:5001/api/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Flask Backend (Port 5001)${NC}: RUNNING"
else
    echo -e "${RED}❌ Flask Backend (Port 5001)${NC}: NOT RUNNING"
fi

# Check frontend
if curl -s http://localhost:8000 >/dev/null 2>&1; then
    echo -e "${GREEN}✅ React Frontend (Port 8000)${NC}: RUNNING (Vite)"
else
    echo -e "${RED}❌ React Frontend (Port 8000)${NC}: NOT RUNNING"
fi

echo ""
