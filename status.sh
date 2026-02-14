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
    echo -e "${GREEN}✅ Backend (Port 5001)${NC}: RUNNING"
    curl -s http://localhost:5001/api/health | grep -o '"message":"[^"]*"' | cut -d'"' -f4
else
    echo -e "${RED}❌ Backend (Port 5001)${NC}: NOT RUNNING"
fi

# Check frontend
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000 | grep -q "200\|304"; then
    echo -e "${GREEN}✅ Frontend (Port 8000)${NC}: RUNNING"
else
    echo -e "${RED}❌ Frontend (Port 8000)${NC}: NOT RUNNING"
fi

echo ""
echo "Process Information:"
echo "===================="
ps aux | grep -E "(python app.py|http.server 8000)" | grep -v grep | awk '{print $2, $11, $12}'

echo ""
echo "Recent Log Entries:"
echo "==================="
echo -e "${YELLOW}Backend (last 5 lines):${NC}"
tail -5 /tmp/facerec_backend.log 2>/dev/null || echo "No log file found"

echo ""
echo -e "${YELLOW}Frontend (last 5 lines):${NC}"
tail -5 /tmp/facerec_frontend.log 2>/dev/null || echo "No log file found"
