# Render Deployment Guide - Academy Hub

## Backend Deployment (Render)

### Step 1: Prepare Repository
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `academy-hub-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 3: Add Environment Variables

In Render dashboard, add these environment variables:

```
PORT=5000
MONGODB_URI=mongodb+srv://vikasuniyalcsa_db_user:86e5erCY0N6kGEPk@cluster0.boejcjg.mongodb.net/?appName=Cluster0
JWT_SECRET=5d9fd20bf8e8d88f1541a8904686c34e
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=dxeojvo9g
CLOUDINARY_API_KEY=917856375913817
CLOUDINARY_API_SECRET=TYvS3sFjV-GEDqC-fBBz50i1cqM
```

### Step 4: Deploy
- Click **"Create Web Service"**
- Wait for deployment (2-3 minutes)
- Copy your backend URL (e.g., `https://academy-hub-backend.onrender.com`)

---

## Frontend Deployment (Vercel)

### Step 1: Update Frontend Environment

Create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Step 2: Deploy to Vercel

**Option A: Vercel CLI**
```bash
npm i -g vercel
cd frontend
vercel --prod
```

**Option B: Vercel Dashboard**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
6. Click **"Deploy"**

---

## Post-Deployment Checklist

### Backend (Render)
- [ ] Service is running (green status)
- [ ] MongoDB Atlas connection working
- [ ] Environment variables set
- [ ] Health check: `https://your-backend.onrender.com/api/health`

### Frontend (Vercel)
- [ ] Build successful
- [ ] Environment variable set
- [ ] Can access the site
- [ ] Can register/login
- [ ] Can upload PDFs

---

## Important Notes

### Render Free Tier
- ⚠️ **Spins down after 15 minutes of inactivity**
- First request after sleep takes ~30 seconds
- Upgrade to paid plan for always-on service

### MongoDB Atlas
- ✅ Already configured with cloud database
- Whitelist Render IPs if needed (or use 0.0.0.0/0)

### Cloudinary
- ✅ Already configured
- Free tier: 25 GB storage, 25 GB bandwidth/month

---

## Testing Deployment

1. **Backend Health Check**:
   ```bash
   curl https://your-backend.onrender.com/api/health
   ```

2. **Frontend**: Visit your Vercel URL

3. **Full Flow**:
   - Register as Academy
   - Upload a PDF
   - Register as Student
   - Search and view PDFs

---

## Troubleshooting

### Backend Issues
- Check Render logs in dashboard
- Verify environment variables
- Check MongoDB Atlas network access

### Frontend Issues
- Check Vercel deployment logs
- Verify `VITE_API_URL` is correct
- Check browser console for CORS errors

### CORS Issues
Backend already configured for CORS, but if issues persist:
- Update `cors()` in `backend/src/server.js`
- Add your Vercel domain to allowed origins

---

## URLs After Deployment

**Backend**: `https://academy-hub-backend.onrender.com`
**Frontend**: `https://academy-hub.vercel.app`
**API Docs**: `https://academy-hub-backend.onrender.com/api/health`

---

## Cost Estimate

- **Render (Free)**: $0/month (with limitations)
- **Vercel (Free)**: $0/month
- **MongoDB Atlas (Free)**: $0/month (512MB storage)
- **Cloudinary (Free)**: $0/month (25GB)

**Total**: $0/month for free tier! 🎉

---

## Upgrade Path

When ready to scale:
- **Render**: $7/month (always-on, better performance)
- **MongoDB Atlas**: $9/month (shared cluster)
- **Cloudinary**: $89/month (advanced features)
