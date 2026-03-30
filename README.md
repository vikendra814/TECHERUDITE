# Appointment Booking System

appointment booking system built with React, Node.js, Express, and MongoDB.

---

## Setup & Run

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## API Endpoints

| Method | Endpoint                        | Description                        |
|--------|---------------------------------|------------------------------------|
| POST   | /api/v1/availability            | Create availability + generate slots |
| GET    | /api/v1/availability/:linkId    | Fetch availability by booking link |
| POST   | /api/v1/book/:linkId            | Book a slot                        |

---

## Key Design Decisions

- **Joi validation middleware** runs before controllers; returns field-level 400 errors
- **Unique index** on `{availabilityId, slotId}` in Booking model as a DB-level guard
- **Axios interceptor** unwraps success responses; `errorHandler.js` routes 400/404/409/500 to appropriate UI feedback
