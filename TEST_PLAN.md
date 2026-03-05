# End-to-End Test Plan - Academy Hub

## Prerequisites Check

### 1. MongoDB
```bash
# Check if MongoDB is running
mongosh --eval "db.version()"
# OR
mongo --version
```

### 2. Backend Dependencies
```bash
cd backend
npm list
```

### 3. Frontend Dependencies
```bash
cd frontend
npm list
```

## Test Scenarios

### Scenario 1: User Registration & Login

#### Academy Registration
1. Navigate to: http://localhost:5173/register
2. Fill form:
   - Name: "Test Academy"
   - Email: "academy@test.com"
   - Password: "password123"
   - Role: Academy
3. Click Register
4. **Expected**: Redirect to /academy dashboard

#### Student Registration
1. Navigate to: http://localhost:5173/register
2. Fill form:
   - Name: "Test Student"
   - Email: "student@test.com"
   - Password: "password123"
   - Role: Student
3. Click Register
4. **Expected**: Redirect to /student dashboard

#### Login Test
1. Logout
2. Navigate to: http://localhost:5173/login
3. Login with academy@test.com
4. **Expected**: Redirect to /academy

---

### Scenario 2: PDF Upload (Academy)

**Note**: Cloudinary must be configured for this to work!

1. Login as Academy
2. Fill upload form:
   - Subject: "Mathematics"
   - Class: "Grade 10"
   - School: "Springfield High"
   - PDF: Select any PDF file
3. Click Upload
4. **Expected**: 
   - Success toast
   - PDF appears in table
   - File uploaded to Cloudinary

---

### Scenario 3: PDF Management (Academy)

#### Update PDF
1. Click pencil icon on any PDF
2. Update fields:
   - Subject: "Advanced Mathematics"
   - Class: "Grade 11"
3. Click Update
4. **Expected**: 
   - Success toast
   - Table updates with new values

#### Delete PDF
1. Click trash icon on any PDF
2. **Expected**:
   - Success toast
   - PDF removed from table
   - PDF deleted from Cloudinary

---

### Scenario 4: PDF Search (Student)

1. Login as Student
2. Search with filters:
   - Subject: "Math"
   - Class: "10"
   - School: "Springfield"
3. Click Search
4. **Expected**:
   - Results display matching PDFs
   - Can click to preview PDF

#### Preview PDF
1. Click on any PDF card
2. **Expected**:
   - Modal opens
   - PDF displays in iframe

---

### Scenario 5: Authentication & Authorization

#### Protected Routes
1. Logout
2. Try to access: http://localhost:5173/academy
3. **Expected**: Redirect to /login

#### Role-Based Access
1. Login as Student
2. Try to access: http://localhost:5173/academy
3. **Expected**: Redirect to /student

---

## API Endpoint Tests

### Health Check
```bash
curl http://localhost:5000/api/health
```
**Expected**: `{"status":"OK","message":"Server is running"}`

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test User",
    "email": "apitest@test.com",
    "password": "password123",
    "role": "academy"
  }'
```
**Expected**: Returns token and user object

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@test.com",
    "password": "password123"
  }'
```
**Expected**: Returns token and user object

### Get PDFs (requires token)
```bash
curl http://localhost:5000/api/pdfs/my-pdfs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
**Expected**: Returns array of PDFs

---

## Known Issues to Check

### 1. Cloudinary Not Configured
- **Symptom**: PDF upload fails
- **Fix**: Add Cloudinary credentials to `backend/.env`

### 2. MongoDB Not Running
- **Symptom**: Backend crashes on start
- **Fix**: Start MongoDB service

### 3. CORS Issues
- **Symptom**: Network errors in browser console
- **Fix**: Already configured, but check if ports match

### 4. Port Conflicts
- **Symptom**: "Port already in use"
- **Fix**: Kill process or change port in .env

---

## Quick Test Script

Run this to test basic functionality:

```bash
# Test backend health
curl http://localhost:5000/api/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"pass123","role":"academy"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'
```

---

## Success Criteria

✅ Users can register and login
✅ Academy can upload PDFs (with Cloudinary)
✅ Academy can view their PDFs
✅ Academy can update PDF metadata
✅ Academy can delete PDFs
✅ Students can search PDFs
✅ Students can preview PDFs
✅ Protected routes work
✅ Role-based access works
✅ Logout works
✅ No console errors
