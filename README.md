# 🏥 Doctor Hub — Supabase Version

> Full Stack Healthcare System | BSCS FYP | React + Node.js + Supabase (PostgreSQL)

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Supabase Setup

1. **[supabase.com](https://supabase.com)** pe free account banao
2. **New Project** create karo
3. **SQL Editor** mein jao → `backend/config/schema.sql` ka poora content paste karo → **Run** karo
4. **Settings → API** mein jao → copy karo:
   - `Project URL` → yeh hai `SUPABASE_URL`
   - `service_role` key → yeh hai `SUPABASE_SERVICE_KEY`

### Step 2: Environment Setup

```bash
cd backend
cp .env.example .env
```

`.env` file mein yeh values bharo:

```env
PORT=5000
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=doctorhub_super_secret_key_2024
JWT_REFRESH_SECRET=doctorhub_refresh_secret_2024
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Step 3: Install & Run

```bash
# Root folder mein
npm run install:all

# Development server start
npm run dev
```

### Step 4: Seed Demo Data (Optional)

```bash
cd backend
npm run seed
```

---

## 🗄️ Database Setup (Important!)

Supabase SQL Editor mein `backend/config/schema.sql` run karo.
Yeh automatically banayega:
- ✅ 15 tables
- ✅ Indexes
- ✅ Row Level Security
- ✅ Immutable medical history rules

---

## 🔑 Where to Get Supabase Keys

```
supabase.com → Your Project → Settings → API

Project URL:     https://abcdefgh.supabase.co   ← SUPABASE_URL
anon key:        eyJ...                          ← Public key (frontend ke liye)
service_role:    eyJ...                          ← SUPABASE_SERVICE_KEY (backend ke liye)
```

---

## 👥 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| Super Admin | superadmin@demo.com | 123456 |
| Admin | admin@demo.com | 123456 |
| Doctor | doctor@demo.com | 123456 |
| Doctor 2 | doctor2@demo.com | 123456 |
| Patient | patient@demo.com | 123456 |
| Assistant | asst@demo.com | 123456 |

---

## 📁 Project Structure

```
doctor-hub/
├── backend/
│   ├── config/
│   │   ├── db.js          ← Supabase client
│   │   └── schema.sql     ← Run this in Supabase SQL Editor!
│   ├── controllers/       ← All business logic (Supabase queries)
│   ├── routes/            ← API routes
│   ├── middleware/        ← JWT auth, upload, validator
│   └── server.js
│
├── frontend/              ← React + Vite (same as before)
│   └── src/
│       ├── pages/
│       ├── redux/
│       └── components/
│
└── package.json
```

---

## 🌐 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS + Redux Toolkit |
| Backend | Node.js + Express.js |
| Database | Supabase (PostgreSQL) |
| Auth | JWT + Bcrypt |
| Storage | Local uploads (Multer) |

---

## 🚀 Deployment

### Backend → Render.com
1. Push to GitHub
2. New Web Service → `backend` folder
3. Start command: `npm start`
4. Add env variables

### Frontend → Vercel
1. Push to GitHub  
2. Import on vercel.com
3. Framework: Vite
4. Add: `VITE_API_URL=https://your-render-url.onrender.com`

---

© 2024 Doctor Hub — BSCS Final Year Project
