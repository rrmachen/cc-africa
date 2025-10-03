# CC Africa - Setup Guide

## Quick Start (Test Environment)

### 1. Database Setup

You need a PostgreSQL database. Choose one option:

#### Option A: Free Cloud Database (Recommended)

**Using Neon (Free tier, instant setup):**
1. Go to https://neon.tech
2. Sign up with GitHub/Google
3. Create a new project named "cc-africa"
4. Copy the connection string (looks like: `postgres://user:pass@host.neon.tech/dbname?sslmode=require`)
5. Update `apps/cms/.env`:
   ```
   DATABASE_URL=your-connection-string-here
   DATABASE_SSL=true
   ```

**Using Supabase:**
1. Go to https://supabase.com
2. Create new project "cc-africa"
3. Go to Settings > Database > Connection String > URI
4. Update `apps/cms/.env` with the connection string

#### Option B: Local PostgreSQL

**Windows:**
1. Download from https://www.postgresql.org/download/windows/
2. Install with default settings (remember the password!)
3. Open Command Prompt and create database:
   ```
   createdb cc_africa
   ```
4. Update `apps/cms/.env`:
   ```
   DATABASE_URL=postgres://postgres:your-password@localhost:5432/cc_africa
   DATABASE_SSL=false
   ```

#### Option C: Docker

```bash
docker run --name cc-africa-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=cc_africa -p 5432:5432 -d postgres:15
```

Update `apps/cms/.env`:
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/cc_africa
DATABASE_SSL=false
```

### 2. Start the CMS (Backend)

```bash
# From project root
npm run dev:cms
```

The CMS will:
- Run database migrations automatically
- Start server on http://localhost:3000
- Open admin panel at http://localhost:3000/admin

**First time setup:**
- You'll be prompted to create an admin account
- Fill in your details and select "Administrator" role

### 3. Start the Frontend

Open a new terminal:

```bash
# From project root
npm run dev:web
```

The frontend will start on http://localhost:3001

### 4. Add Test Data

Option 1: Use the admin panel at http://localhost:3000/admin
- Login with your admin account
- Go to Churches > Create New
- Fill in church details
- Click "Publish" to make it visible on the frontend

Option 2: Run the seed script (coming soon)

```bash
npm run seed
```

## Environment Variables

### apps/cms/.env
```
PAYLOAD_SECRET=your-super-secret-key-change-in-production
DATABASE_URL=postgres://user:password@localhost:5432/cc_africa
DATABASE_SSL=false
PORT=3000
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
```

### apps/web/.env.local
```
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000
```

## Testing the Setup

1. **CMS Admin Panel:** http://localhost:3000/admin
   - Login with admin credentials
   - Create a new church
   - Publish it

2. **Frontend:** http://localhost:3001
   - Should display published churches
   - Click on a church to view details (if detail page is implemented)

3. **API:** http://localhost:3000/api/churches
   - Should return JSON with churches data

## Troubleshooting

### "Cannot connect to database"
- Check DATABASE_URL is correct
- Verify PostgreSQL is running
- Check DATABASE_SSL setting matches your database

### "Module not found"
- Run `npm install` from project root

### "Port already in use"
- CMS: Change PORT in `apps/cms/.env`
- Web: Kill process using port 3001 or change in `apps/web/package.json`

### "PAYLOAD_SECRET is required"
- Ensure `apps/cms/.env` exists and has PAYLOAD_SECRET set

## Project Structure

```
cc-africa/
├── apps/
│   ├── cms/           # Payload CMS backend
│   │   ├── src/
│   │   │   ├── collections/  # Data models
│   │   │   ├── utils/        # Access control
│   │   │   └── server.ts     # Express server
│   │   └── .env
│   └── web/           # Next.js frontend
│       ├── src/
│       │   ├── app/          # Pages
│       │   └── lib/          # API calls
│       └── .env.local
└── package.json       # Workspace root
```

## Next Steps

Once your test environment is running:

1. Create multiple test churches across different African countries
2. Create church editor users and assign them to specific churches
3. Test the approval workflow (editors submit, admins approve)
4. Verify version history is working
5. Test access control (editors can only edit assigned churches)

## Deployment (Future)

- **CMS:** Deploy to Render (or similar)
- **Web:** Deploy to Vercel
- **Database:** Use production PostgreSQL (Render, Neon, Supabase)
- Update environment variables for production URLs
