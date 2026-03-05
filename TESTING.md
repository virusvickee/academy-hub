# Academy Hub - Testing Guide

## Current Status

✅ **MongoDB**: Running
❌ **Backend**: Not running
❌ **Frontend**: Not running

## To Start Testing:

### Step 1: Start Backend
```bash
cd backend
npm run dev
```
**Expected output**: 
```
Server running on port 5000
MongoDB connected successfully
```

### Step 2: Start Frontend (in new terminal)
```bash
cd frontend
npm run dev
```
**Expected output**:
```
VITE ready in XXX ms
Local: http://localhost:5173
```

### Step 3: Run Automated Tests
```bash
./test.sh
```

### Step 4: Manual Testing

#### Test 1: Register Academy User
1. Open: http://localhost:5173/register
2. Fill form:
   - Name: Test Academy
   - Email: academy@test.com
   - Password: password123
   - Role: Academy
3. Click Register
4. ✅ Should redirect to /academy dashboard

#### Test 2: Upload PDF (Requires Cloudinary)
1. Login as Academy
2. Fill upload form
3. Select PDF file
4. Click Upload
5. ✅ Should see success message

**Note**: PDF upload requires Cloudinary configuration in `backend/.env`

#### Test 3: Register Student
1. Logout
2. Register as Student
3. ✅ Should redirect to /student dashboard

#### Test 4: Search PDFs
1. Login as Student
2. Enter search criteria
3. Click Search
4. ✅ Should see results

## Quick API Test (Backend must be running)

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"pass123","role":"academy"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'
```

## Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongosh`
- Check .env file exists: `ls backend/.env`
- Check dependencies: `cd backend && npm install`

### Frontend won't start
- Check dependencies: `cd frontend && npm install`
- Check port 5173 is free

### PDF Upload fails
- Add Cloudinary credentials to `backend/.env`:
  ```
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  ```
- Get free account at: https://cloudinary.com

### CORS errors
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `frontend/.env`

## Test Checklist

- [ ] MongoDB running
- [ ] Backend running (port 5000)
- [ ] Frontend running (port 5173)
- [ ] Can register Academy user
- [ ] Can register Student user
- [ ] Can login
- [ ] Can logout
- [ ] Academy can view dashboard
- [ ] Student can view dashboard
- [ ] Protected routes work
- [ ] Role-based access works
- [ ] (Optional) Can upload PDF
- [ ] (Optional) Can search PDFs
- [ ] (Optional) Can update PDF
- [ ] (Optional) Can delete PDF

## Ready to Deploy?

Once all tests pass:
1. Push to GitHub
2. Deploy backend to Render/Railway/Heroku
3. Deploy frontend to Vercel
4. Update environment variables
