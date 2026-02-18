# **Qesh — Modern Salon & Spa Management Platform**

## **The Reality of Beauty Business Operations**

Walk into any premium salon during peak hours. The reception is flooded with walk-ins, the phone won't stop ringing with booking requests, staff members are juggling multiple services, and the admin is scrambling to track inventory while managing schedules.

Most "modern" salon software fails exactly when it matters most—during the Friday evening rush or the weekend wedding season. **Qesh** was born from a simple observation: **A beauty business shouldn't be held back by outdated, complicated software.**

---

## **The "Why" Behind Qesh**

Current salon management platforms create four critical points of failure:

* **The "Double-Booking Disaster":** When systems don't sync in real-time, two clients get booked for the same slot, leading to chaos and customer dissatisfaction.
* **Peak Hour Bottleneck:** Manual appointment logging is slow. Every minute spent on paperwork is a minute not spent serving clients.
* **The "Stock-Out Surprise":** Without automated inventory tracking, salons run out of essential products mid-service, damaging reputation and revenue.
* **Staff Coordination Chaos:** Spreadsheets and WhatsApp groups aren't enough. Staff need real-time schedule visibility and assignment clarity.

---

## **The Qesh Solution**

Qesh is a **Unified-Experience** platform that treats every touchpoint—from client booking to staff coordination to admin oversight—as part of a seamless workflow.

* **For Clients:** A stunning, mobile-first interface for discovering services, booking instantly, and managing appointments.
* **For Staff:** A dedicated dashboard showing daily schedules, assigned services, and client preferences—everything they need at a glance.
* **For Owners:** Complete operational control with real-time booking analytics, inventory alerts, and revenue tracking.

---

## **Deep Dive: Key Features**

### **1. Smart Booking Engine (P0)**

This is the heart of Qesh. Using **conflict-free scheduling algorithms**, the system prevents double-bookings, intelligently suggests available slots, and sends automated confirmations via SMS and email.

### **2. Service Management Hub (P0)**

* **Dynamic Catalog:** Create and organize services by category (Hair, Skin, Nails, Spa) with custom pricing and duration.
* **Visual Display:** Drag-and-drop reordering for perfect service presentation.
* **Real-Time Updates:** Changes sync instantly across web and mobile platforms.

### **3. Staff Orchestration (P1)**

* **Smart Assignment:** Automatically assign staff based on expertise, availability, and workload distribution.
* **Schedule Management:** Staff can view their daily agenda, mark availability, and receive booking notifications.
* **Performance Tracking:** Monitor service completion rates and client feedback per staff member.

### **4. Inventory Intelligence (P1)**

* **Product Library:** Manage retail products and service supplies with SKU tracking.
* **Auto-Alerts:** Get notified when stock falls below threshold levels.
* **Sales Integration:** Track product sales alongside service revenue for complete financial visibility.

### **5. Promotional Engine (P1)**

* **Flexible Offers:** Create percentage or flat discounts with custom coupon codes.
* **Time-Bound Campaigns:** Schedule seasonal promotions with automatic activation and expiry.
* **Usage Analytics:** See which offers drive the most conversions.

### **6. Customer Experience Suite**

* **Ambient Gallery:** Showcase salon ambiance with a beautiful lightbox photo viewer.
* **Social Proof:** Display curated customer testimonials with ratings.
* **Location Integration:** Embedded Google Maps with one-tap navigation.
* **Contact Flows:** Multiple CTAs (Call, WhatsApp, Book Online) for maximum conversion.

---

## **The Tech Stack**

### **The Frontend Layer**

* **React 18 + Vite:** Lightning-fast development with optimized production builds.
* **Tailwind CSS:** Utility-first styling for a consistent, elegant design system.
* **Framer Motion:** Buttery-smooth animations and scroll-based interactions.
* **Lucide React:** Crisp, modern iconography with tree-shaking support.

### **The Backend Core**

* **Node.js & Express:** RESTful API architecture with middleware-based routing.
* **MySQL & Prisma:** Type-safe database ORM with migration management.
* **JWT Authentication:** Secure, stateless authentication with role-based access control.
* **Cookie-Parser:** Session management with HTTP-only cookies.

### **Infrastructure**

* **Vercel:** Edge-optimized deployment for the customer-facing site.
* **Cloud Database:** Managed MySQL instance with automated backups.
* **CORS Configuration:** Secure cross-origin resource sharing between frontend and admin.

---

## **Development Timeline**

* **Phase 1 (Foundation):** Building the Booking Engine and Admin Dashboard. If appointments aren't reliable, nothing else matters.
* **Phase 2 (Operations):** Staff coordination, service management, and schedule synchronization. Making the salon run like clockwork.
* **Phase 3 (Growth):** Inventory tracking, promotional campaigns, and offer management. Driving revenue and retention.
* **Phase 4 (Intelligence):** Analytics dashboards, revenue reports, and business insights. Making data-driven decisions.

---

## **Architecture Highlights**

### **Role-Based Access Control**

```
┌─────────────────────────────────────────┐
│           Qesh Platform                 │
├─────────────────────────────────────────┤
│                                         │
│  CLIENT                              │
│  ├─ Browse Services                     │
│  ├─ Book Appointments                   │
│  └─ View Booking History                │
│                                         │
│  STAFF                                │
│  ├─ View Assigned Schedule              │
│  ├─ Mark Services Complete              │
│  ├─ Update Availability                 │
│  └─ Access Notices Board                │
│                                         │
│  ADMIN                                │
│  ├─ Manage All Bookings                 │
│  ├─ Configure Services & Pricing        │
│  ├─ Control Staff & Schedules           │
│  ├─ Track Inventory & Products          │
│  ├─ Create Promotional Offers           │
│  └─ Access Business Analytics           │
│                                         │
└─────────────────────────────────────────┘
```

---

## **Getting Started**

### **Prerequisites**

```bash
Node.js ≥ 18.17
npm ≥ 9 (or pnpm/yarn)
MySQL ≥ 8.0
```

### **Installation**

```bash
# Clone repository
git clone https://github.com/yourusername/qesh.git
cd qesh

# Install dependencies for all modules
npm run install:all

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials and API keys

# Run database migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

### **Development**

```bash
# Start backend server (Port 5000)
cd backend
npm start

# Start admin dashboard (Port 5173)
cd admin
npm run dev

# Start customer frontend (Port 5174)
cd frontend
npm run dev
```

### **Production Build**

```bash
# Build frontend
cd frontend
npm run build

# Build admin dashboard
cd admin
npm run build

# Deploy backend
cd backend
npm run deploy
```

---

## **Project Structure**

```
qesh/
├── frontend/          # Customer-facing website
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
│
├── admin/            # Staff & Admin dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/    # Admin-only views
│   │   │   ├── staff/    # Staff views
│   │   │   └── common/   # Shared components
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
│
├── backend/          # Node.js API server
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
└── docs/             # Documentation
    ├── README.md
    ├── Idea.md
    ├── ErDiagram.md
    ├── ClassDiagram.md
    ├── SequenceDiagram.md
    └── UseCaseDiagram.md
```

---

## **API Endpoints Overview**

### **Public Endpoints**
- `GET /api/public/services` - Browse service catalog
- `GET /api/public/offers` - View active promotions
- `POST /api/bookings/check-availability` - Check time slot availability

### **Authenticated Endpoints**
- `POST /api/auth/login` - User authentication
- `GET /api/bookings/my-bookings` - User's appointment history
- `POST /api/bookings/create` - Create new booking

### **Staff Endpoints**
- `GET /api/staff/my-schedule` - Staff member's daily agenda
- `PUT /api/staff/update-availability` - Modify working hours
- `PATCH /api/bookings/:id/complete` - Mark service as completed

### **Admin Endpoints**
- `POST /api/admin/services` - Create/update services
- `GET /api/admin/analytics` - Business intelligence dashboard
- `POST /api/admin/staff` - Manage staff accounts
- `PUT /api/admin/inventory/:id` - Update product stock

---

## **Security Features**

**JWT-Based Authentication** - Stateless, secure token management  
**Password Hashing** - bcrypt with configurable salt rounds  
**Role-Based Authorization** - Middleware for route protection  
**HTTP-Only Cookies** - XSS attack prevention  
**CORS Configuration** - Whitelist-based origin control  
**Input Validation** - Sanitization and validation middleware  
**Audit Logging** - Complete activity trail for compliance  

---

## **Final Word**

Qesh isn't just another booking system. It's a study in **Operational Excellence**. It's built for the modern salon owner who refuses to compromise on customer experience, staff efficiency, or business insights.

This project is a testament to the idea that **good business software isn't just about features; it's about understanding workflows, eliminating friction, and building tools that grow with your business.**

---

## **License**

MIT License - See LICENSE file for details

## **Contributing**

Contributions are welcome! Please read CONTRIBUTING.md for guidelines.

## **Support**

- Email: support@qesh.app
- Documentation: https://docs.qesh.app
- Issues: https://github.com/yourusername/qesh/issues