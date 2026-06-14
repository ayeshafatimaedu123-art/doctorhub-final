# Live Link Project
https://doctor-hub-supabase.vercel.app


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
# Output SS
<img width="1917" height="1017" alt="Screenshot 2026-06-14 174759" src="https://github.com/user-attachments/assets/57b62c69-70b7-429e-a030-6213a0a4717d" />
<img width="1918" height="1025" alt="Screenshot 2026-06-14 174809" src="https://github.com/user-attachments/assets/1ef8b104-eb7e-4c67-9d9b-754235bb2168" />
<img width="1918" height="1003" alt="Screenshot 2026-06-14 174827" src="https://github.com/user-attachments/assets/5bec12ab-c7da-49cd-a2b9-442ef7e91e8c" />
<img width="1917" height="1011" alt="Screenshot 2026-06-14 174838" src="https://github.com/user-attachments/assets/84bbf856-6354-4cfd-a948-13d725bc99e8" />
<img width="1617" height="713" alt="Screenshot 2026-06-14 174851" src="https://github.com/user-attachments/assets/33d05b0a-7703-4db8-9eed-3bba47363568" />
<img width="1918" height="1007" alt="Screenshot 2026-06-14 174857" src="https://github.com/user-attachments/assets/f27e65cb-af37-4c65-9bfd-083b7857c1ad" />
<img width="1918" height="1023" alt="Screenshot 2026-06-14 174909" src="https://github.com/user-attachments/assets/421d5648-f181-4874-aa4f-5be5f2f1e41d" />
<img width="1908" height="1022" alt="Screenshot 2026-06-14 174919" src="https://github.com/user-attachments/assets/1be5d606-28b0-4317-89bb-aedb1ac4db97" />
<img width="1917" height="1008" alt="Screenshot 2026-06-14 174936" src="https://github.com/user-attachments/assets/7465f9ca-b3b6-4bb6-8d13-934106b2fb35" />
<img width="1907" height="985" alt="Screenshot 2026-06-14 174951" src="https://github.com/user-attachments/assets/82d7bc1e-c703-4fac-b316-616c97888f54" />
<img width="1918" height="1013" alt="Screenshot 2026-06-14 174943" src="https://github.com/user-attachments/assets/ee839f71-f481-48a3-8bee-30c5de997786" />
<img width="1913" height="1012" alt="Screenshot 2026-06-14 175002" src="https://github.com/user-attachments/assets/ef83c72a-f088-436b-a3b1-e372687b2342" />
<img width="1918" height="1017" alt="Screenshot 2026-06-14 175055" src="https://github.com/user-attachments/assets/4f770ee7-6bfa-467d-a93a-e2f62e45e84d" />
<img width="1918" height="1026" alt="Screenshot 2026-06-14 175115" src="https://github.com/user-attachments/assets/ec315998-95c1-49bf-a3c1-e355938cfea1" />
<img width="1918" height="1013" alt="Screenshot 2026-06-14 175239" src="https://github.com/user-attachments/assets/e05efbd7-6997-46df-9150-7ba2a51a2d49" />
<img width="1918" height="1018" alt="Screenshot 2026-06-14 175251" src="https://github.com/user-attachments/assets/af86f7a5-e374-4bf2-b61b-8103c40c1ca9" />

---

© 2024 Doctor Hub — BSCS Final Year Project
