# Qesh — Modern Salon & Spa Management Platform

A complete, production-ready salon business operating system built with the MERN stack.

## Architecture

```
qesh/
├── frontend/        → Customer-facing website (React + Vite + Tailwind)
├── admin/           → Staff & Admin dashboard (React + Vite + Tailwind)
├── backend/         → REST API server (Node.js + Express + MongoDB)
└── docs/            → Design documents, ER diagrams, specs
```

## Tech Stack

| Layer     | Technology                                      |
|-----------|------------------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS v4, Framer Motion |
| Admin     | React 19, Vite, Tailwind CSS v4, Lucide Icons  |
| Backend   | Node.js, Express 5, MongoDB, Mongoose 9        |
| Auth      | JWT (HttpOnly cookies), bcrypt, WhatsApp OTP    |
| Deploy    | Vercel (frontend + admin + backend)             |

## Features

### Customer Portal (`/frontend`)
- Service browsing with category filtering
- Smart booking engine with real-time slot availability
- Product shop with inventory awareness
- Offers & coupon system
- OTP-based WhatsApp authentication
- Appointment history & cancellation

### Admin Dashboard (`/admin`)
- Real-time booking management (create, reschedule, cancel)
- Service & category CRUD with subcategories
- Staff management with role-based access
- Inventory/product tracking with stock alerts
- Promotional offers & coupon engine
- Dashboard analytics (revenue, bookings, trends)
- Notice board for staff communication
- Pixabay image search integration

### Staff Portal (`/admin` — staff role)
- Personal schedule view
- Appointment status updates
- Notice board access
- Profile management

## Quick Start

### Prerequisites
- Node.js ≥ 18.17
- MongoDB (local or Atlas)
- npm or pnpm

### Installation

```bash
# Clone
git clone https://github.com/Rahulgupta7777/Qesh.git
cd Qesh

# Backend
cd backend
cp .env.example .env   # Configure your env vars
npm install
npm run dev             # Runs on :3000

# Frontend (new terminal)
cd frontend
npm install
npm run dev             # Runs on :5174

# Admin (new terminal)
cd admin
npm install
npm run dev             # Runs on :5173
```

### Environment Variables (backend/.env)

```env
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
SUPER_ADMIN_EMAIL=admin@qesh.app
NODE_ENV=development

# WhatsApp OTP (optional — falls back to console logging in dev)
WHATSAPP_PHONE_ID=your_phone_id
WHATSAPP_ACCESS_TOKEN=your_access_token

# Image Search
PIXABAY_KEY=your_pixabay_key
```

### Environment Variables (frontend/.env & admin/.env)

```env
VITE_API_BASE_URL=http://localhost:3000
```

## API Overview

| Route Group         | Base Path         | Auth Required |
|---------------------|-------------------|---------------|
| Public Services     | `/api/public/`    | No            |
| Customer Auth       | `/api/auth/`      | No            |
| Customer Bookings   | `/api/bookings/`  | JWT (user)    |
| Staff Portal        | `/api/staff/`     | JWT (staff)   |
| Admin Operations    | `/api/admin/`     | JWT (admin)   |

## Security

- JWT stored in HttpOnly cookies (XSS prevention)
- bcrypt password hashing (salt rounds: 10)
- Role-based middleware (user → staff → admin)
- Rate limiting on OTP endpoints (5/hour/IP)
- CORS whitelist configuration
- MongoDB transaction support for bookings
- Compound indexes to prevent double-booking

## License

MIT
