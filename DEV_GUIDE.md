# Academy Hub - Development Guide

## Prerequisites

1. **MongoDB** - Make sure MongoDB is installed and running
   - Windows: Start MongoDB service
   - Linux: `sudo systemctl start mongod`
   - Mac: `brew services start mongodb-community`

2. **Node.js** - Version 18 or higher

## Setup & Run

### Option 1: Run Both Servers (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: Use Start Script (Linux/Mac)
```bash
./start.sh
```

## Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

## Environment Setup

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/academy-hub
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in backend/.env

**Port Already in Use:**
- Backend: Change PORT in backend/.env
- Frontend: Vite will auto-assign another port

**CORS Issues:**
- Backend already configured for CORS
- Check VITE_API_URL in frontend/.env
