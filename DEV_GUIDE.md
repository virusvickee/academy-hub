# Academy Hub - Development Guide

## Prerequisites

1. **MongoDB** - Make sure MongoDB is installed and running
   - Windows: Start MongoDB service
   - Linux: `sudo systemctl start mongod`
   - Mac: `brew services start mongodb-community`

2. **Node.js** - Version 18 or higher

## Setup & Run

### Prerequisites Setup

**Install Dependencies:**
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

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

**⚠️ SECURITY WARNING:**
- **NEVER commit .env files to version control**
- Ensure .env is in .gitignore
- Rotate all secrets before deploying to production

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/academy-hub
JWT_SECRET=<generate-with-openssl-rand-base64-32>
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Generate a strong JWT_SECRET:**
```bash
openssl rand -base64 32
```

**⚠️ Sensitive Variables:**
- `JWT_SECRET` - Keep secret, rotate for production
- `MONGODB_URI` - Contains database credentials
- `CLOUDINARY_API_KEY` - API credentials
- `CLOUDINARY_API_SECRET` - API credentials

Never commit these to your repository!

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
