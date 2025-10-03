# Deployment Guide - Render + Vercel

## Architecture

- **Database:** Render PostgreSQL (free tier)
- **Backend (Payload CMS):** Render Web Service (free tier)
- **Frontend (Next.js):** Vercel (free tier)

## Step-by-Step Deployment

### Part 1: Set Up Git Repository

1. **Initialize Git (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - CC Africa directory platform"
   ```

2. **Create GitHub repository:**
   - Go to https://github.com/new
   - Name: `cc-africa`
   - Keep it public or private (your choice)
   - Don't initialize with README (we already have files)
   - Click "Create repository"

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/cc-africa.git
   git branch -M main
   git push -u origin main
   ```

### Part 2: Deploy Database & CMS to Render

#### Option A: Using render.yaml (Recommended - Automated)

1. **Go to Render Dashboard:** https://dashboard.render.com

2. **Create New Blueprint:**
   - Click "New +" → "Blueprint"
   - Connect your GitHub account (if not already)
   - Select the `cc-africa` repository
   - Render will detect `render.yaml` automatically
   - Click "Apply"

3. **Wait for deployment:**
   - Database will be created first (~2 min)
   - Then CMS will deploy (~5 min)
   - You'll get a URL like: `https://cc-africa-cms.onrender.com`

4. **Note your CMS URL** - you'll need it for Vercel

#### Option B: Manual Setup (Alternative)

1. **Create PostgreSQL Database:**
   - Render Dashboard → "New +" → "PostgreSQL"
   - Name: `cc-africa-db`
   - Database: `cc_africa`
   - User: (auto-generated)
   - Region: Oregon (or closest to you)
   - Plan: Free
   - Click "Create Database"
   - **Copy the "External Database URL"** (you'll need this)

2. **Create Web Service for CMS:**
   - Render Dashboard → "New +" → "Web Service"
   - Connect your GitHub repo: `cc-africa`
   - Settings:
     - Name: `cc-africa-cms`
     - Region: Oregon (same as database)
     - Branch: `main`
     - Root Directory: (leave empty)
     - Environment: `Node`
     - Build Command: `npm install && npm run build:cms`
     - Start Command: `npm run start --workspace apps/cms`
     - Plan: Free

3. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable":

   ```
   NODE_VERSION = 20
   PAYLOAD_SECRET = [click "Generate" or use a long random string]
   DATABASE_URL = [paste External Database URL from step 1]
   DATABASE_SSL = true
   PORT = 10000
   PAYLOAD_PUBLIC_SERVER_URL = https://cc-africa-cms.onrender.com
   ```

   Replace `cc-africa-cms` in the URL with your actual service name

4. **Click "Create Web Service"**

### Part 3: Deploy Frontend to Vercel

1. **Go to Vercel:** https://vercel.com/new

2. **Import Git Repository:**
   - Click "Add New..." → "Project"
   - Import your `cc-africa` GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Project:**
   - Framework Preset: Next.js (should auto-detect)
   - Root Directory: `apps/web` ⚠️ **IMPORTANT**
   - Build Command: `npm run build` (override to use workspace)
   - Output Directory: `.next` (default is fine)
   - Install Command: `npm install` (override if needed)

4. **Add Environment Variable:**
   Under "Environment Variables":
   ```
   NEXT_PUBLIC_PAYLOAD_URL = https://cc-africa-cms.onrender.com
   ```
   Replace with your actual Render CMS URL from Part 2

5. **Click "Deploy"**

6. **Your frontend will be live at:** `https://cc-africa-xxx.vercel.app`

### Part 4: Update CMS CORS Settings

After Vercel deployment, update Render environment variables:

1. Go to Render Dashboard → `cc-africa-cms` service
2. Environment tab → Edit `PAYLOAD_PUBLIC_SERVER_URL`
3. Add your Vercel URL to the allowed origins (this is handled in code, but verify deployment works)

### Part 5: Initialize the System

1. **Create Admin Account:**
   - Visit your Render CMS URL: `https://cc-africa-cms.onrender.com/admin`
   - Fill in the first user form (this becomes your admin)
   - Email: your-email@example.com
   - Password: (choose secure password)
   - First Name, Last Name
   - Roles: ✅ Administrator
   - Click "Create"

2. **Add Test Data:**

   From your local machine:
   ```bash
   # Update local .env to point to production database
   # Copy DATABASE_URL from Render and add to apps/cms/.env

   npm run seed
   ```

   Or manually via admin panel:
   - Login to admin panel
   - Go to Churches → Create New
   - Fill in details and Publish

3. **Verify Frontend:**
   - Visit your Vercel URL
   - Should display published churches
   - Test navigation and display

## Important Notes

### Free Tier Limitations

**Render Free Tier:**
- Web services spin down after 15 min of inactivity
- First request after inactivity takes ~30-60s (cold start)
- Database has 90-day expiration (then must migrate or upgrade)
- 750 hours/month free compute

**Vercel Free Tier:**
- 100GB bandwidth/month
- Unlimited deployments
- No sleep/cold starts for frontend

### Production Considerations

For production (when ready):
- Upgrade Render database to paid tier (persistent)
- Consider Render's $7/month plan for CMS (no cold starts)
- Use custom domain
- Enable Cloudflare CDN
- Set up proper backup strategy

### Environment Variables Summary

**Render (CMS):**
```
NODE_VERSION=20
PAYLOAD_SECRET=<generate-secure-random-string>
DATABASE_URL=<from-render-postgres>
DATABASE_SSL=true
PORT=10000
PAYLOAD_PUBLIC_SERVER_URL=https://your-cms.onrender.com
```

**Vercel (Frontend):**
```
NEXT_PUBLIC_PAYLOAD_URL=https://your-cms.onrender.com
```

## Troubleshooting

### CMS won't start on Render
- Check build logs for errors
- Verify NODE_VERSION=20
- Ensure all env vars are set
- Check DATABASE_URL is correct

### Frontend can't fetch churches
- Verify NEXT_PUBLIC_PAYLOAD_URL is correct
- Check CMS is running (visit /admin)
- Check browser console for CORS errors
- Ensure churches are published (not drafts)

### Database connection fails
- Verify DATABASE_SSL=true for Render PostgreSQL
- Check DATABASE_URL format
- Ensure database is in same region as web service

### Seed script fails
- Make sure you're using production DATABASE_URL
- CMS must be deployed and migrations run first
- Check database credentials

## Deployment Commands Summary

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/cc-africa.git
git push -u origin main

# After code changes
git add .
git commit -m "Your commit message"
git push

# Render and Vercel will auto-deploy on push to main branch

# Seed production data (one-time)
# First update apps/cms/.env with production DATABASE_URL
npm run seed
```

## Next Steps After Deployment

1. ✅ Create admin account
2. ✅ Seed test data or create churches manually
3. ✅ Verify frontend displays churches
4. ✅ Test church editor workflow
5. ✅ Test approval process
6. 🚀 Share the URL with stakeholders!

## URLs to Bookmark

- **CMS Admin:** https://cc-africa-cms.onrender.com/admin
- **CMS API:** https://cc-africa-cms.onrender.com/api
- **Frontend:** https://cc-africa-xxx.vercel.app
- **Render Dashboard:** https://dashboard.render.com
- **Vercel Dashboard:** https://vercel.com/dashboard
