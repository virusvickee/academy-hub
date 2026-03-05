#!/bin/bash

echo "🚀 Starting Academy Hub Servers..."
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running!"
    echo "Please start MongoDB first:"
    echo "  - Windows: Start MongoDB service"
    echo "  - Linux/Mac: sudo systemctl start mongod"
    echo ""
fi

# Cleanup function
cleanup() {
    echo ""
    echo "Stopping servers..."
    # Kill process groups to ensure child processes are terminated
    if [ -n "$BACKEND_PID" ]; then
        kill -- -"$BACKEND_PID" 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill -- -"$FRONTEND_PID" 2>/dev/null || true
    fi
    exit
}

# Set trap early
trap cleanup INT TERM

# Start backend
echo "📦 Starting Backend Server (Port 5000)..."
if ! cd "$SCRIPT_DIR/backend"; then
    echo "Error: Failed to change to backend directory"
    exit 1
fi
setsid npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend Server (Port 5173)..."
if ! cd "$SCRIPT_DIR/frontend"; then
    echo "Error: Failed to change to frontend directory"
    kill -- -"$BACKEND_PID" 2>/dev/null || true
    exit 1
fi
setsid npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servers started!"
echo "   Backend:  http://localhost:5000"
echo "   Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for processes
wait
