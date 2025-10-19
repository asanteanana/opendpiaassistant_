# 🚀 Quick Start: GitHub & Vercel Connection

## ✅ Current Status
Your project is already connected to GitHub! 
- **Repository**: `asanteanana/opendpiaassistant_`
- **Remote URL**: `https://github.com/asanteanana/opendpiaassistant_.git`

## 🎯 Next Steps

### 1. Deploy to Vercel (Frontend)

#### Option A: Automated Setup Script
```bash
./setup-deployment.sh
```

#### Option B: Manual Setup

**Install Vercel CLI:**
```bash
npm install -g vercel
```

**Login to Vercel:**
```bash
vercel login
```

**Deploy:**
```bash
vercel --prod
```

#### Option C: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import from GitHub: `asanteanana/opendpiaassistant_`
4. Framework: Next.js (auto-detected)
5. Deploy!

### 2. Environment Variables

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
NODE_ENV=production
```

### 3. Backend Deployment (Required)

Your frontend needs a backend API. Deploy to:

**Railway (Recommended):**
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repository
4. Root Directory: `backend`
5. Add PostgreSQL database
6. Set environment variables:
   ```env
   DATABASE_URL=postgresql://... (auto-set by Railway)
   SECRET_KEY=your-secret-key-min-32-chars
   CORS_ORIGINS=https://your-app.vercel.app
   ```

### 4. Update Frontend API URL

After backend deployment:
1. Copy your Railway app URL
2. Update Vercel environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-app.railway.app
   ```
3. Redeploy: `vercel --prod`

## 🔧 Available Scripts

```bash
npm run dev          # Local development
npm run build        # Build for production
npm run deploy       # Deploy to Vercel (production)
npm run deploy:preview # Deploy preview to Vercel
npm run setup:env    # Copy .env.example to .env.local
```

## 📁 Project Structure

```
opendpiaassistant_/
├── app/                 # Next.js frontend
├── backend/             # FastAPI backend
├── components/          # React components
├── vercel.json         # Vercel configuration
├── .env.example        # Environment variables template
└── setup-deployment.sh # Automated setup script
```

## 🚨 Important Notes

1. **Backend Required**: This is a full-stack app. Frontend alone won't work.
2. **Database**: Backend needs PostgreSQL (Railway provides this automatically)
3. **CORS**: Backend must allow your Vercel domain in CORS_ORIGINS
4. **Environment Variables**: Set in both Vercel (frontend) and Railway (backend)

## 🆘 Troubleshooting

### CORS Errors
- Verify `CORS_ORIGINS` includes your Vercel domain
- Check `NEXT_PUBLIC_API_URL` is set correctly

### Build Failures
- Check Node.js version (should be 18+)
- Verify all dependencies installed: `npm install`

### API Not Working
- Test backend directly: `https://your-backend.railway.app/docs`
- Check environment variables in both platforms

## 📖 Full Documentation

For complete deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Ready to deploy?** Run `./setup-deployment.sh` or follow the manual steps above! 🚀
