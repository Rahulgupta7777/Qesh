# Sequence Diagram — Qesh

## **Overview**

This diagram illustrates the end-to-end flow of a customer booking a salon appointment through the Qesh platform. It demonstrates:

- **Availability checking** to prevent double-bookings
- **Smart staff assignment** for balanced workload
- **Transactional booking creation** ensuring data consistency
- **Multi-channel notifications** for confirmation and reminders
- **Real-time updates** to admin dashboards

The sequence showcases how multiple system components coordinate to deliver a seamless booking experience while maintaining operational integrity.

---

## **Primary Use Case: Client Books an Appointment**

```mermaid
sequenceDiagram
    actor C as Client
    participant FE as Frontend (React)
    participant API as Booking API
    participant AUTH as Auth Service
    participant SVC as Service Manager
    participant STAFF as Staff Coordinator
    participant DB as Database (MySQL)
    participant NOTIF as Notification Service
    participant ADMIN as Admin Dashboard

    Note over C, FE: Phase 1 — Service Discovery

    C->>FE: Visits website homepage
    FE->>API: GET /api/public/services
    API->>SVC: getActiveServices()
    SVC->>DB: SELECT * FROM services WHERE is_active=true ORDER BY display_order
    DB-->>SVC: Service catalog (Hair, Skin, Nails, Spa)
    SVC-->>API: List of active services
    API-->>FE: JSON response with services
    FE-->>C: Display service gallery with cards

    Note over C, STAFF: Phase 2 — Availability Check

    C->>FE: Selects "Premium Haircut" + picks date
    FE->>API: POST /api/bookings/check-availability<br/>{serviceId, date}
    API->>SVC: getService(serviceId)
    SVC->>DB: SELECT * FROM services WHERE id=?
    DB-->>SVC: Service details (duration: 60min)
    
    API->>STAFF: findAvailableStaff(date, 60min)
    STAFF->>DB: SELECT u.* FROM users u<br/>JOIN staff_schedules ss ON u.id=ss.staff_id<br/>WHERE ss.schedule_date=? AND u.role='STAFF'
    DB-->>STAFF: List of staff working on that date
    
    STAFF->>DB: SELECT start_time, end_time FROM bookings<br/>WHERE staff_id IN (...) AND booking_date=?<br/>AND status != 'CANCELLED'
    DB-->>STAFF: Existing bookings per staff
    
    STAFF->>STAFF: Calculate free time slots (gap analysis)
    STAFF-->>API: Available slots: [10:00, 11:00, 14:00, 15:00]
    API-->>FE: JSON with available time slots
    FE-->>C: Display time picker with available slots

    Note over C, NOTIF: Phase 3 — Booking Confirmation

    C->>FE: Selects 14:00 slot + enters name/phone
    FE->>API: POST /api/bookings/create<br/>{serviceId, date, time, name, phone}
    
    API->>AUTH: createOrFindUser(name, phone)
    AUTH->>DB: SELECT * FROM users WHERE phone=?
    
    alt User exists
        DB-->>AUTH: Existing user record
    else New user
        AUTH->>DB: INSERT INTO users (name, phone, role='CLIENT')
        DB-->>AUTH: New user ID
    end
    
    AUTH-->>API: User object with ID
    
    API->>STAFF: balanceWorkload(date, time)
    STAFF->>DB: SELECT staff_id, COUNT(*) as bookings<br/>FROM bookings<br/>WHERE booking_date=? GROUP BY staff_id
    DB-->>STAFF: Workload distribution
    STAFF->>STAFF: Select staff with least bookings
    STAFF-->>API: Assigned staff (John Doe, ID: staff_123)
    
    API->>DB: BEGIN TRANSACTION
    API->>DB: INSERT INTO bookings<br/>(user_id, service_id, staff_id, booking_date,<br/>start_time, end_time, status='PENDING')
    DB-->>API: Booking created (ID: bk_789)
    
    API->>DB: INSERT INTO audit_logs<br/>(user_id, action='CREATE_BOOKING', entity_id)
    DB-->>API: Log recorded
    
    API->>DB: COMMIT TRANSACTION
    DB-->>API: Success
    
    API->>NOTIF: sendBookingConfirmation(booking)
    
    par Parallel Notifications
        NOTIF->>C: SMS: "Booking confirmed for 14:00 on Feb 20"
        NOTIF->>C: Email: Detailed confirmation with calendar invite
        NOTIF->>STAFF: SMS to John: "New booking assigned: 14:00 Premium Haircut"
    end
    
    API->>ADMIN: WebSocket broadcast: NEW_BOOKING event
    ADMIN-->>ADMIN: Update today's booking count in real-time
    
    API-->>FE: 201 Created {bookingId, confirmationCode}
    FE-->>C: Success page: "Booking confirmed! Check your SMS/email"

    Note over NOTIF, C: Phase 4 — Automated Reminder (24h before)

    NOTIF->>NOTIF: Scheduled job runs every hour
    NOTIF->>DB: SELECT * FROM bookings<br/>WHERE booking_date = TOMORROW()<br/>AND status = 'CONFIRMED'
    DB-->>NOTIF: Upcoming bookings
    
    loop For each booking
        NOTIF->>C: SMS: "Reminder: Your haircut appointment is tomorrow at 14:00"
        NOTIF->>STAFF: SMS: "Reminder: You have 3 appointments tomorrow"
    end
```

---

## **Alternative Flows**

### **Scenario: Slot Becomes Unavailable**

```mermaid
sequenceDiagram
    actor C as Client
    participant FE as Frontend
    participant API as Booking API
    participant DB as Database

    C->>FE: Selects 14:00 slot
    Note over C, FE: Another client books the same slot simultaneously
    
    FE->>API: POST /api/bookings/create {time: 14:00}
    API->>DB: BEGIN TRANSACTION
    API->>DB: SELECT * FROM bookings WHERE staff_id=? AND booking_date=? AND start_time=?
    DB-->>API: Existing booking found (just created by other client)
    API->>DB: ROLLBACK TRANSACTION
    API-->>FE: 409 Conflict: "Slot no longer available"
    FE-->>C: Show error: "This slot was just booked. Please choose another time."
    FE->>API: GET /api/bookings/check-availability (refresh slots)
```

### **Scenario: Client Cancels Booking**

```mermaid
sequenceDiagram
    actor C as Client
    participant FE as Frontend
    participant API as Booking API
    participant DB as Database
    participant NOTIF as Notification Service
    participant STAFF as Staff Member

    C->>FE: Clicks "Cancel Booking" button
    FE->>API: DELETE /api/bookings/:bookingId
    API->>DB: SELECT * FROM bookings WHERE id=? AND user_id=?
    DB-->>API: Booking details (status: CONFIRMED, date: tomorrow)
    
    alt Cancellation allowed (>24h before appointment)
        API->>DB: UPDATE bookings SET status='CANCELLED' WHERE id=?
        DB-->>API: Success
        API->>NOTIF: sendCancellationNotice(booking)
        NOTIF->>C: SMS: "Booking cancelled. Rescheduling anytime!"
        NOTIF->>STAFF: SMS: "Booking at 14:00 was cancelled - slot now free"
        API-->>FE: 200 OK
        FE-->>C: "Booking cancelled successfully"
    else Too late to cancel (<24h)
        API-->>FE: 403 Forbidden: "Cannot cancel within 24 hours"
        FE-->>C: "Please call salon to cancel: +1234567890"
    end
```

---

## **Staff Dashboard Flow**

```mermaid
sequenceDiagram
    actor S as Staff Member
    participant FE as Admin Dashboard
    participant API as Backend API
    participant DB as Database

    S->>FE: Logs in with staff credentials
    FE->>API: POST /api/auth/login {email, password}
    API->>DB: SELECT * FROM users WHERE email=? AND role='STAFF'
    DB-->>API: Staff user record
    API->>API: Verify password (bcrypt)
    API-->>FE: JWT token + user data
    FE->>FE: Store token in localStorage
    
    FE->>API: GET /api/staff/my-schedule?date=today
    API->>DB: SELECT b.*, s.name as service_name, u.name as client_name<br/>FROM bookings b<br/>JOIN services s ON b.service_id=s.id<br/>JOIN users u ON b.user_id=u.id<br/>WHERE b.staff_id=? AND b.booking_date=?
    DB-->>API: Today's bookings (9:00 Haircut for Sarah, 11:00 Color for Mike)
    API-->>FE: JSON with booking list
    FE-->>S: Display schedule timeline with appointments
    
    S->>FE: Marks 9:00 appointment as "Completed"
    FE->>API: PATCH /api/bookings/:id/complete
    API->>DB: UPDATE bookings SET status='COMPLETED' WHERE id=?
    DB-->>API: Success
    API-->>FE: 200 OK
    FE-->>S: Visual confirmation (checkmark animation)
```

---

## **Admin Analytics Dashboard**

```mermaid
sequenceDiagram
    actor A as Admin
    participant FE as Admin Dashboard
    participant API as Backend API
    participant DB as Database

    A->>FE: Navigates to Analytics tab
    FE->>API: GET /api/admin/analytics?period=this_month
    
    par Parallel data fetching
        API->>DB: SELECT COUNT(*) FROM bookings WHERE status='COMPLETED' AND MONTH(booking_date)=?
        DB-->>API: Total bookings: 342
        
        API->>DB: SELECT SUM(final_price) FROM bookings WHERE status='COMPLETED' AND MONTH(booking_date)=?
        DB-->>API: Total revenue: $18,450
        
        API->>DB: SELECT s.name, COUNT(b.id) as count FROM bookings b JOIN services s ON b.service_id=s.id GROUP BY s.id ORDER BY count DESC LIMIT 5
        DB-->>API: Top services (Haircut: 89, Color: 67, Spa: 54...)
        
        API->>DB: SELECT u.name, COUNT(b.id) as count FROM bookings b JOIN users u ON b.staff_id=u.id GROUP BY u.id ORDER BY count DESC
        DB-->>API: Staff performance (Sarah: 78, John: 69, Emma: 64...)
    end
    
    API-->>FE: JSON with all analytics data
    FE-->>A: Display charts: bar graph (services), line graph (revenue trend), leaderboard (staff)
```

---

## **Flow Summary**

| Phase | Key Operations | Design Patterns |
| --- | --- | --- |
| **1. Service Discovery** | Public API fetches active services with categorization | **API Gateway**, Query Optimization |
| **2. Availability Check** | Gap analysis on existing bookings to find free slots | **Conflict Detection**, Range Queries |
| **3. Staff Assignment** | Workload balancing algorithm selects least-busy staff | **Load Balancing**, Fairness Algorithm |
| **4. Transactional Booking** | ACID transaction ensures booking + audit log atomicity | **Database Transactions**, Consistency |
| **5. Notifications** | Parallel SMS/Email delivery for instant confirmation | **Async Processing**, Fan-Out Pattern |
| **6. Real-Time Updates** | WebSocket broadcast updates admin dashboard instantly | **Pub-Sub**, Event-Driven Architecture |
| **7. Scheduled Reminders** | Cron job queries upcoming bookings and sends reminders | **Scheduled Tasks**, Background Jobs |

---

## **Key Timing Characteristics**

| Operation | Average Latency | Optimization Strategy |
| --- | --- | --- |
| Service Catalog Fetch | 45ms | Database indexing on `is_active, display_order` |
| Availability Check | 120ms | Composite index on `(staff_id, booking_date, start_time)` |
| Booking Creation | 250ms | Transaction batching, connection pooling |
| SMS Notification | 800ms | Async queue (doesn't block API response) |
| Email Notification | 1.2s | Background worker (doesn't block API response) |
| WebSocket Broadcast | 10ms | In-memory pub-sub via Socket.io |
| Analytics Query | 180ms | Materialized views for aggregated data |

---

## **Error Handling & Resilience**

### **Double-Booking Prevention**
```javascript
// Atomic check-and-insert with database lock
const existingBooking = await db.bookings.findFirst({
  where: {
    staffId: assignedStaff.id,
    bookingDate: date,
    startTime: { lte: requestedTime },
    endTime: { gt: requestedTime },
    status: { not: 'CANCELLED' }
  },
  lock: 'FOR UPDATE' // Row-level lock
});

if (existingBooking) {
  throw new ConflictError('Slot unavailable');
}
```

### **Notification Failures**
```javascript
// Retry logic with exponential backoff
try {
  await notificationService.sendSMS(booking);
} catch (error) {
  // Queue for retry instead of failing the booking
  await retryQueue.add('send-sms', {
    bookingId: booking.id,
    attempts: 0,
    maxAttempts: 3,
    backoff: 'exponential'
  });
}
```

### **Database Unavailability**
```javascript
// Circuit breaker pattern
if (dbCircuitBreaker.isOpen()) {
  return res.status(503).json({
    error: 'Service temporarily unavailable',
    retryAfter: 60
  });
}
```

---

## **Security Considerations**

✅ **Authentication:** JWT tokens with expiration  
✅ **Authorization:** Role-based middleware checks  
✅ **Input Validation:** Sanitize all user inputs  
✅ **Rate Limiting:** Prevent booking spam attacks  
✅ **SQL Injection Protection:** Parameterized queries via Prisma  
✅ **XSS Protection:** HTTP-only cookies, CSP headers  
✅ **Audit Logging:** Every booking action recorded  

---

## **Scalability Notes**

### **Current Architecture Supports:**
- **~1000 bookings/day** with single database instance
- **~50 concurrent users** with horizontal API scaling
- **~10,000 services** with current indexing strategy

### **Future Optimizations:**
- **Read Replicas:** For analytics queries
- **Redis Caching:** For frequently accessed service catalog
- **Message Queue:** For background job processing (notifications, emails)
- **CDN:** For frontend static assets
- **Database Sharding:** If expanding to multi-location chains

---

## **Summary**

The Qesh booking flow demonstrates:

**Multi-layered validation** to prevent errors  
**Smart resource allocation** for staff workload balance  
**Transactional integrity** ensuring data consistency  
**Async communication** for non-blocking operations  
**Real-time updates** for immediate feedback  
**Graceful error handling** with user-friendly messages  

This sequence ensures that every booking is **accurate**, **fast**, and **reliable**—the foundation of exceptional customer experience.