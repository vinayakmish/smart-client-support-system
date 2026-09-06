# Smart Client Support System

A full-stack customer support ticket management system built with the MERN stack. Designed for teams that need role-based ticket handling, real-time analytics, and a clean enterprise-grade interface.

## Features

- **Role-Based Access Control** — Three distinct roles (Admin, Agent, Client) with granular permissions enforced on both frontend and backend
- **User Management** — Admin can create, edit, and delete user accounts, assign roles (admin, agent, client), and reset passwords directly from the UI
- **Ticket Management** — Create, view, update, and delete support tickets with priority levels, categories, status tracking, and agent assignment
- **Comments & Collaboration** — Threaded comments on tickets for agent-client communication
- **File Uploads** — Attach files to tickets (up to 5 MB; supports PNG, JPG, PDF, DOCX)
- **Admin Analytics Dashboard** — Visual metrics with Recharts: tickets by status, tickets per agent, monthly trends, and resolution rates
- **Advanced Filtering & Search** — Filter tickets by status, priority, category, assigned agent, and date range with full-text search
- **Dark / Light Theme** — Per-user theme preference persisted in localStorage. Dark mode by default on first visit
- **Auto-Seeding** — Database is automatically populated with demo users and sample tickets on first startup
- **In-Memory DB Fallback** — If no MongoDB instance is available, the backend spins up an embedded in-memory MongoDB server so the app runs out of the box

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, React Router, Recharts, Axios |
| Backend | Node.js, Express, Mongoose, JWT (HttpOnly cookies), Multer |
| Database | MongoDB (Atlas or local). Falls back to `mongodb-memory-server` if unavailable |
| Auth | bcrypt password hashing, JWT tokens stored in HttpOnly cookies |

## Project Structure

```
smart-client-support-system/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection with in-memory fallback
│   │   └── seed.js            # Database seeding script
│   ├── controllers/
│   │   ├── authController.js  # Login, logout, current user
│   │   ├── ticketController.js
│   │   ├── analyticsController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT verification & role authorization
│   │   └── upload.js          # Multer file upload config
│   ├── models/
│   │   ├── User.js
│   │   ├── Ticket.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── ticketRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── userRoutes.js
│   ├── uploads/               # Uploaded attachments
│   ├── server.js              # Express entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/        # Sidebar, TicketCard, FiltersPanel, Icons, etc.
│   │   ├── context/           # AuthContext, ThemeContext
│   │   ├── pages/             # Login, Dashboard, TicketsList, TicketDetails, Analytics, UserManagement
│   │   ├── utils/             # Axios instance with interceptors
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** (optional — the app will use an in-memory database if no MongoDB instance is available)

### 1. Clone the Repository

```bash
git clone https://github.com/VikranthThanikanti/smart-client-support-system.git
cd smart-client-support-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see `.env.example` for reference):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/support_system
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

> **Note:** If you skip the `.env` file or don't have MongoDB running, the backend will automatically start an in-memory MongoDB instance and seed it with demo data.

Start the backend:

```bash
npm run dev
```

The API server starts on `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

The app opens at `http://localhost:5173`.

### 4. Seed the Database (Optional)

The database is auto-seeded on first startup if it's empty. To manually re-seed:

```bash
cd backend
npm run seed
```

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@support.com` | `admin123` |
| Agent | `agent1@support.com` | `agent123` |
| Agent | `agent2@support.com` | `agent123` |
| Client | `client1@example.com` | `client123` |
| Client | `client2@example.com` | `client123` |
| Client | `client3@example.com` | `client123` |

> These are demo accounts created by the seed script. There is no sign-up page — all user accounts are managed by the admin.

## Role Permissions

| Action | Admin | Agent | Client |
|--------|:-----:|:-----:|:------:|
| View all tickets | Yes | Yes | Own only |
| Create tickets | Yes | Yes | Yes |
| Assign tickets to agents | Yes | Yes | No |
| Update ticket status/priority | Yes | Yes | No |
| Delete tickets | Yes | No | No |
| Add comments | Yes | Yes | Own tickets |
| View analytics dashboard | Yes | No | No |
| Create / edit / delete users | Yes | No | No |
| Upload attachments | Yes | Yes | Yes |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email and password |
| POST | `/api/auth/logout` | Clear auth cookie |
| GET | `/api/auth/me` | Get current authenticated user |

### Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | List tickets (filtered by role) |
| POST | `/api/tickets` | Create a new ticket |
| GET | `/api/tickets/:id` | Get ticket details with comments |
| PUT | `/api/tickets/:id` | Update a ticket |
| DELETE | `/api/tickets/:id` | Delete a ticket (Admin only) |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Aggregated metrics (Admin only) |

**Sample Analytics Response:**

```json
{
  "ticketsByStatus": { "open": 2, "in_progress": 2, "pending": 2, "resolved": 1, "closed": 1 },
  "ticketsByPriority": { "low": 2, "medium": 2, "high": 3, "urgent": 1 },
  "ticketsPerAgent": [
    { "agent": "John Agent", "count": 4 },
    { "agent": "Jane Agent", "count": 3 }
  ],
  "monthlyTrend": [
    { "month": "2024-09", "count": 8 }
  ]
}
```

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users (Admin and Agent) |
| POST | `/api/users` | Create a new user (Admin only) |
| PUT | `/api/users/:id` | Update user name, email, role, or password (Admin only) |
| DELETE | `/api/users/:id` | Delete a user (Admin only) |

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/support_system` |
| `JWT_SECRET` | Secret key for JWT signing | Required |
| `JWT_EXPIRE` | JWT token expiration | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `NODE_ENV` | Environment mode | `development` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## Scripts

### Backend

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Start with nodemon (hot reload) |
| Production | `npm start` | Start the server |
| Seed | `npm run seed` | Populate database with demo data |

### Frontend

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Start Vite dev server |
| Build | `npm run build` | Build for production |
| Preview | `npm run preview` | Preview production build |

## License

This project is part of an entrepreneurship coursework submission.
