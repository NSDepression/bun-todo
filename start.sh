#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Todo App - ElysiaJS + Bun + React   ║${NC}"
echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo ""

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    echo -e "${YELLOW}⚠️  Bun is not installed!${NC}"
    echo -e "Please install Bun from: https://bun.sh"
    exit 1
fi

echo -e "${GREEN}✓ Bun detected: $(bun --version)${NC}"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    bun install
    echo ""
fi

# Build WASM if not already built
if [ ! -f "wasm/build/release.wasm" ]; then
    echo -e "${YELLOW}🔧 Building WASM module...${NC}"
    bun run build:wasm
    echo ""
fi

# Copy WASM to frontend
echo -e "${YELLOW}📋 Copying WASM to frontend...${NC}"
mkdir -p frontend/public/wasm
cp wasm/build/release.wasm frontend/public/wasm/
echo ""

echo -e "${GREEN}🚀 Starting the application...${NC}"
echo ""
echo -e "${BLUE}Backend:${NC}  http://localhost:3000"
echo -e "${BLUE}Frontend:${NC} http://localhost:5173"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
echo ""

# Start both servers
bun run dev
