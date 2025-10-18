# 🚀 Deployment Guide - Open DPIA Assistant

This guide covers deploying the Open DPIA Assistant to production.

## 📋 Deployment Strategy

Since this is a full-stack application:
- **Frontend (Next.js)** → Deploy to **Vercel**
- **Backend (FastAPI)** → Deploy to **Railway**, **Render**, or **Fly.io**

---

## 🎨 Option 1: Deploy Frontend to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Backend deployed elsewhere (see Option 2 below)

### Step 1: Push to GitHub

```bash
cd /Users/nanaasante/opendpiaassistant_

# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Open DPIA Assistant"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/open-dpia-assistant.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Frontend to Vercel

#### Via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```

6. Click **"Deploy"**

#### Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# Set up and deploy? Yes
# Which scope? (Select your account)
# Link to existing project? No
# What's your project's name? open-dpia-assistant
# In which directory is your code located? ./
# Want to override settings? No

# For production deployment
vercel --prod
```

### Step 3: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
NODE_ENV=production
```

---

## 🔧 Option 2: Deploy Backend

### A. Railway (Recommended - Free Tier)

1. **Sign up at [railway.app](https://railway.app)**

2. **Create New Project** → Deploy from GitHub

3. **Add your repository**

4. **Configure**:
   - Root Directory: `backend`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`

5. **Environment Variables**:
   ```env
   DATABASE_URL=postgresql://user:pass@host/db
   SECRET_KEY=your-secret-key-here
   CORS_ORIGINS=https://your-vercel-app.vercel.app
   ENV=production
   ```

6. **Add PostgreSQL Database**:
   - Click "New" → Database → PostgreSQL
   - Railway will auto-set `DATABASE_URL`

7. **Deploy** → Railway will auto-deploy on git push

8. **Get URL**: Copy the Railway app URL (e.g., `https://your-app.railway.app`)

### B. Render (Alternative)

1. **Sign up at [render.com](https://render.com)**

2. **New** → **Web Service**

3. **Connect GitHub repository**

4. **Configure**:
   - Name: `dpia-backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn backend.app:app --host 0.0.0.0 --port $PORT`

5. **Environment Variables**:
   ```env
   DATABASE_URL=postgresql://...
   SECRET_KEY=your-secret-key
   CORS_ORIGINS=https://your-vercel-app.vercel.app
   PYTHON_VERSION=3.11.0
   ```

6. **Add PostgreSQL**:
   - New → PostgreSQL
   - Link to web service

7. **Deploy**

### C. Fly.io (Advanced)

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Navigate to backend
cd backend

# Initialize
flyctl launch
# App Name: dpia-backend
# Region: Choose closest to users
# PostgreSQL: Yes
# Redis: No

# Set secrets
flyctl secrets set SECRET_KEY=your-secret-key
flyctl secrets set CORS_ORIGINS=https://your-vercel-app.vercel.app

# Deploy
flyctl deploy
```

---

## 🔄 Complete Deployment Flow

### 1. Deploy Backend First

**Railway (Easiest):**
```bash
# Push to GitHub
git push origin main

# Railway auto-deploys
# Get backend URL: https://your-app.railway.app
```

### 2. Deploy Frontend

**Update Frontend Environment:**
```bash
cd frontend

# Create .env.production
echo "NEXT_PUBLIC_API_URL=https://your-app.railway.app" > .env.production
```

**Deploy to Vercel:**
```bash
vercel --prod

# Or via Dashboard with env var:
# NEXT_PUBLIC_API_URL=https://your-app.railway.app
```

### 3. Update Backend CORS

In Railway/Render, update environment variable:
```env
CORS_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com
```

### 4. Test

Visit: `https://your-app.vercel.app`

---

## 🗄️ Database Setup

### PostgreSQL on Railway

**Automatic:**
- Railway handles database creation
- Connection string auto-set

**Manual Schema Creation:**
```bash
# The app will auto-create tables on first run
# Or manually:
railway run python -c "from backend.db import init_db; init_db()"
```

### PostgreSQL on Render

1. New → PostgreSQL
2. Copy connection string
3. Add to environment variables as `DATABASE_URL`

---

## 🔐 Environment Variables Checklist

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
CORS_ORIGINS=https://your-vercel-app.vercel.app
ENV=production
```

### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

---

## 🎯 Quick Deploy Script

Create `deploy.sh` in project root:

```bash
#!/bin/bash

echo "🚀 Deploying Open DPIA Assistant..."

# Deploy backend (if using Railway)
echo "📦 Pushing to GitHub..."
git add .
git commit -m "Deploy: $(date)"
git push origin main

echo "⏳ Waiting for Railway deployment..."
sleep 30

# Deploy frontend
echo "🎨 Deploying frontend to Vercel..."
cd frontend
vercel --prod

echo "✅ Deployment complete!"
echo "Frontend: https://your-app.vercel.app"
echo "Backend: https://your-app.railway.app"
```

Make executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🔍 Troubleshooting

### CORS Errors
- Verify `CORS_ORIGINS` in backend includes your Vercel domain
- Check Vercel environment variables are set

### Database Connection Issues
- Ensure `DATABASE_URL` is correctly set
- Check PostgreSQL is running
- Verify network/firewall rules

### Build Failures
- Check Node.js version (should be 20+)
- Verify all dependencies in `package.json`
- Check build logs in Vercel dashboard

### API Calls Failing
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check backend health: `https://your-backend.railway.app/`
- Verify API endpoints work: `https://your-backend.railway.app/docs`

---

## 📊 Post-Deployment

### 1. Test Everything
- Create an assessment
- Answer questions
- View report
- Export PDF/JSON

### 2. Set Up Custom Domain (Optional)

**Vercel:**
- Settings → Domains → Add
- Configure DNS records

**Railway:**
- Settings → Domains → Custom Domain

### 3. Monitor

**Vercel:**
- Analytics available in dashboard
- Real-time logs

**Railway:**
- View logs: `railway logs`
- Monitor metrics in dashboard

### 4. Enable HTTPS (Auto)
Both Vercel and Railway auto-provision SSL certificates.

---

## 🔄 Continuous Deployment

### Automatic Deployments

**Vercel:**
- Auto-deploys on push to `main` branch
- Preview deployments for PRs

**Railway:**
- Auto-deploys on push to `main`
- Configure in Settings → Deployments

### Manual Deployments

```bash
# Frontend
cd frontend
vercel --prod

# Backend (Railway)
railway up
```

---

## 💰 Cost Estimate

### Free Tier (Sufficient for Starting)
- **Vercel**: Free (100GB bandwidth, unlimited projects)
- **Railway**: $5/month after free trial
- **Render**: Free tier available (spins down after inactivity)

### Recommended for Production
- **Vercel Pro**: $20/month
- **Railway**: ~$10-20/month (usage-based)
- **PostgreSQL**: Included with Railway/Render

---

## 🎉 Success!

Once deployed, your app will be live at:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`
- API Docs: `https://your-app.railway.app/docs`

Share the link and start conducting DPIAs! 🛡️

