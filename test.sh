#!/bin/bash

echo "🧪 Academy Hub - End-to-End Test"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local method=${3:-GET}
    local data=$4
    
    echo -n "Testing $name... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" \
            -d "$data" 2>&1)
    else
        response=$(curl -s -w "\n%{http_code}" "$url" 2>&1)
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $http_code)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $http_code)"
        echo "  Response: $body"
        ((FAILED++))
        return 1
    fi
}

echo "📡 Backend Tests"
echo "----------------"

# Test 1: Health Check
test_endpoint "Health Check" "http://localhost:5000/api/health"

# Test 2: Register Academy
REGISTER_DATA='{"name":"Test Academy","email":"testacademy@test.com","password":"password123","role":"academy"}'
if test_endpoint "Register Academy" "http://localhost:5000/api/auth/register" "POST" "$REGISTER_DATA"; then
    # Extract token (basic parsing)
    TOKEN=$(curl -s -X POST "http://localhost:5000/api/auth/register" \
        -H "Content-Type: application/json" \
        -d '{"name":"Test Academy 2","email":"testacademy2@test.com","password":"password123","role":"academy"}' \
        | grep -o '"token":"[^"]*' | cut -d'"' -f4)
fi

# Test 3: Register Student
REGISTER_STUDENT='{"name":"Test Student","email":"teststudent@test.com","password":"password123","role":"student"}'
test_endpoint "Register Student" "http://localhost:5000/api/auth/register" "POST" "$REGISTER_STUDENT"

# Test 4: Login
LOGIN_DATA='{"email":"testacademy@test.com","password":"password123"}'
test_endpoint "Login" "http://localhost:5000/api/auth/login" "POST" "$LOGIN_DATA"

echo ""
echo "🌐 Frontend Tests"
echo "-----------------"

# Test 5: Frontend is running
echo -n "Testing Frontend... "
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASSED${NC} (Server running)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ SKIPPED${NC} (Server not running)"
    echo "  Start with: cd frontend && npm run dev"
fi

echo ""
echo "📊 Test Summary"
echo "==============="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "🎉 Your application is ready!"
    echo ""
    echo "Next steps:"
    echo "1. Configure Cloudinary in backend/.env"
    echo "2. Start frontend: cd frontend && npm run dev"
    echo "3. Visit: http://localhost:5173"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Make sure MongoDB is running"
    echo "2. Check backend is running: cd backend && npm run dev"
    echo "3. Check backend/.env configuration"
    exit 1
fi
