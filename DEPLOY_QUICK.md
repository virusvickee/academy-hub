# Quick Deployment Steps

## 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## 2. Deploy Backend to Render

1. Go to https://dashboard.render.com/
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
5. Add Environment Variables (from backend/.env)
6. Deploy!

## 3. Deploy Frontend to Vercel

1. Go to https://vercel.com/dashboard
2. New Project → Import from GitHub
3. Settings:
   - Root Directory: `frontend`
   - Framework: Vite
4. Add Environment Variable:
   - `VITE_API_URL` = `https://YOUR-BACKEND.onrender.com/api`
5. Deploy!

## 4. Update Frontend .env.production

After backend deploys, update:
```
VITE_API_URL=https://YOUR-ACTUAL-BACKEND-URL.onrender.com/api
```

Then redeploy frontend on Vercel.

## Done! 🎉

Your app is live at:
- Backend: https://YOUR-APP.onrender.com
- Frontend: https://YOUR-APP.vercel.app
