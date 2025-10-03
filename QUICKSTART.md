# Quick Start Guide

## Prerequisites

You need a PostgreSQL database. The fastest option is using a free cloud database.

## Step 1: Set Up Database (5 minutes)

### Recommended: Use Neon (Free)

1. Go to https://neon.tech
2. Sign up with GitHub/Google
3. Click "Create Project"
   - Name: `cc-africa`
   - Region: Choose closest to you
4. Copy the connection string shown (looks like: `postgres://user:pass@ep-xyz.neon.tech/neondb?sslmode=require`)
5. Open `apps/cms/.env` and update:
   ```
   DATABASE_URL=<paste-your-connection-string-here>
   DATABASE_SSL=true
   ```

### Alternative: Supabase

1. Go to https://supabase.com
2. New project → "cc-africa"
3. Settings → Database → Connection String → URI mode
4. Copy and paste into `apps/cms/.env`

## Step 2: Test Database Connection

```bash
npm run test-db
```

You should see: ✅ Successfully connected to database!

If you see errors, the script will tell you what to fix.

## Step 3: Start the CMS

```bash
npm run dev:cms
```

On first run, Payload will:
- Create all database tables automatically
- Start the server on http://localhost:3000
- Redirect to http://localhost:3000/admin

## Step 4: Create Admin Account

1. Browser will open to http://localhost:3000/admin
2. Fill in the form:
   - Email: your-email@example.com
   - Password: (choose a password)
   - First Name: Your Name
   - Last Name: Your Last Name
   - Roles: Select "Administrator"
3. Click "Create"

You're now logged in to the admin panel!

## Step 5: Add Test Data (Optional)

Open a **new terminal** (keep CMS running):

```bash
npm run seed
```

This creates:
- 3 users (1 admin, 2 church editors)
- 4 sample churches (3 published, 1 draft)

**Test accounts created:**
- Admin: `admin@ccafrica.org` / `password123`
- Editor (Kenya): `john.kamau@example.com` / `password123`
- Editor (Nigeria): `chioma.okafor@example.com` / `password123`

## Step 6: Start the Frontend

Open another **new terminal**:

```bash
npm run dev:web
```

Frontend starts on http://localhost:3001

You should see the published churches from the seed data!

## What to Explore

### Admin Panel (http://localhost:3000/admin)

1. **Churches Collection:**
   - View all churches
   - Click one to edit
   - Try publishing/unpublishing
   - Check version history tab

2. **Users Collection:**
   - See the created users
   - View assigned churches for editors

3. **Media Collection:**
   - Upload images to test

### Test Church Editor Permissions

1. Logout from admin account
2. Login as church editor: `john.kamau@example.com` / `password123`
3. Try to:
   - Edit Nairobi Central church (✅ should work)
   - Edit Lagos church (❌ should fail - not assigned)
   - Publish changes (❌ creates draft for admin approval)
4. Login back as admin to approve the changes

### Frontend (http://localhost:3001)

- Browse published churches
- Only published churches appear (drafts are hidden)
- Click "View details" on any church

## Next Steps

Once you've tested everything:

1. Create your own churches via admin panel
2. Upload church photos
3. Test the approval workflow
4. Explore the API: http://localhost:3000/api/churches

## Common Issues

**Port already in use:**
```bash
# Kill process on port 3000 (CMS)
npx kill-port 3000

# Kill process on port 3001 (Frontend)
npx kill-port 3001
```

**Database connection fails:**
- Check `apps/cms/.env` has correct DATABASE_URL
- Run `npm run test-db` to diagnose
- Verify DATABASE_SSL matches your database (true for cloud, false for local)

**"Cannot find module" errors:**
- Run `npm install` from project root

**Seed script fails:**
- Make sure CMS server is NOT running when you seed
- Database must be initialized first (run `npm run dev:cms` once, then stop it)

## Project Structure

```
cc-africa/
├── apps/
│   ├── cms/              # Payload CMS (port 3000)
│   │   ├── src/
│   │   │   ├── collections/    # Data models
│   │   │   ├── server.ts       # Express server
│   │   │   └── seed.ts         # Test data
│   │   └── .env               # CMS config
│   │
│   └── web/              # Next.js frontend (port 3001)
│       ├── src/app/           # Pages
│       └── .env.local         # Frontend config
│
├── SETUP.md             # Detailed setup guide
└── QUICKSTART.md       # This file
```

## Getting Help

- See `SETUP.md` for detailed documentation
- Check Payload docs: https://payloadcms.com/docs
- Check Next.js docs: https://nextjs.org/docs

## Summary of Commands

```bash
# Test database connection
npm run test-db

# Start CMS (port 3000)
npm run dev:cms

# Start frontend (port 3001)
npm run dev:web

# Add test data (CMS must be stopped first)
npm run seed

# Build for production
npm run build:cms
npm run build:web
```

That's it! You should now have a fully functional test environment. 🎉
