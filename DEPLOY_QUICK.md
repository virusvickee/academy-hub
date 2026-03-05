# Quick Deployment Steps

## 1. Push to GitHub

⚠️ **Before pushing, ensure sensitive files are in .gitignore:**
```bash
# Verify .gitignore includes:
# .env
# .env.*
# !.env.example
# node_modules/
# dist/
# build/

# Review changes before committing
git status
git diff

# Stage specific files (avoid "git add .")
git add backend/ frontend/ README.md
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
5. **Copy environment variables** from your local `backend/.env` (⚠️ do NOT commit this file to the repo; ensure it's in .gitignore) into Render's dashboard
6. Deploy!

## 3. Deploy Frontend to Vercel

1. Go to https://vercel.com/dashboard
2. New Project → Import from GitHub
3. Settings:
   - Root Directory: `frontend`
   - Framework: Vite
4. **Add Environment Variable in Vercel dashboard**:
   - Key: `VITE_API_URL`
   - Value: `https://YOUR-BACKEND.onrender.com/api` (use your actual Render backend URL from step 2)
5. Deploy!

**Note**: Vercel will automatically use the environment variable during build. No need to commit `.env.production` to git.

## 4. Verify Deployment

After both services deploy:
- Backend: https://YOUR-APP.onrender.com/api/health
- Frontend: https://YOUR-APP.vercel.app

Test the full flow: Register → Login → Upload PDF → Search

## Done! 🎉

Your app is live at:
- Backend: https://YOUR-APP.onrender.com
- Frontend: https://YOUR-APP.vercel.app
