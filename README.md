# V_Travel — Production-Ready Setup Guide

## What was fixed for production

| Issue | Fix Applied |
|-------|------------|
| Plain-text passwords | BCrypt hashing via `PasswordEncoder` |
| Fake JWT token | Real JWT (HMAC-SHA256) via `jjwt` library |
| Unprotected admin routes | Spring Security — `/api/admin/**` requires `ROLE_ADMIN` |
| Hardcoded CORS in each controller | Centralized in `SecurityConfig` via `application.properties` |
| No auto-logout on token expiry | Frontend intercepts 401 and redirects to `/login` |
| Token key mismatch (frontend vs backend) | Unified to `ws_token` everywhere |

---

## Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8+
- Node.js 18+

---

## Step 1 — Create the MySQL database

```sql
CREATE DATABASE vtravel_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

If your MySQL username/password is not `root`/`root`, update:
```
vtravel-backend/src/main/resources/application.properties
```

---

## Step 2 — (Optional) Change the JWT secret

Open `application.properties` and change:
```properties
app.jwt.secret=W@nderSoul#SecretKey!2024$Production@India
```
Use any string of 32+ characters. Keep it secret.

---

## Step 3 — Run the backend

```bash
cd vtravel-backend
mvn clean package -DskipTests
java -jar target/vtravel-backend-1.0.0.jar
```

Or for development:
```bash
mvn spring-boot:run
```

On first start, the app will:
- Create all tables automatically
- Seed 24 destinations across 4 categories
- Create admin user: `admin@vtravel.in` / `admin123`

Backend runs on: http://localhost:8080

---

## Step 4 — Run the frontend

```bash
cd vtravel-frontend
npm install
npm start
```

Frontend runs on: http://localhost:3000

---

## Step 5 — (Production deployment) Update CORS origins

In `application.properties`, change:
```properties
app.cors.allowed-origins=https://yourdomain.com
```

---

## API Endpoints Summary

### Public (no auth required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/destinations` | All destinations |
| GET | `/api/destinations?category=TEMPLES` | By category |
| GET | `/api/destinations/{id}` | Single destination |
| GET | `/api/destinations/search?keyword=...` | Search |
| GET | `/api/reviews/{destinationId}` | Reviews for destination |

### Authenticated (Bearer JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/me?email=...` | Current user profile |
| POST | `/api/bookings?destinationName=...` | Create booking |
| GET | `/api/bookings?email=...` | User's bookings |
| GET | `/api/bookings/{id}` | Booking details |
| PATCH | `/api/bookings/{id}/status` | Update status |

### Admin only (ROLE_ADMIN JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/bookings` | All bookings |
| PATCH | `/api/admin/bookings/{id}/status` | Change booking status |
| DELETE | `/api/admin/bookings/{id}` | Delete booking |
| GET | `/api/admin/destinations` | All destinations |
| POST | `/api/admin/destinations` | Create destination |
| PUT | `/api/admin/destinations/{id}` | Update destination |
| DELETE | `/api/admin/destinations/{id}` | Delete destination |
| GET | `/api/admin/users` | All users |
| PATCH | `/api/admin/users/{id}/role` | Change user role |
| DELETE | `/api/admin/users/{id}` | Delete user |
