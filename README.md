# Smart Client Support Management System

A complete MERN stack application for managing client support tickets with analytics dashboard.

## Features

- 🔐 JWT Authentication with HttpOnly Cookies (Admin, Agent, Client roles)
- 🎫 Complete Ticket Management System
- 📊 Analytics Dashboard (Admin only)
- 🌙 Dark/Light Theme Toggle
- 📁 File Upload Support
- 🔍 Advanced Filtering and Search
- 📱 Responsive Design

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer for file uploads
- Bcrypt for password hashing

### Frontend
- React 19 + Vite
- React Router
- Tailwind CSS
- Recharts for analytics
- Axios for API calls

## Project Structure

```
project/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── seed.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── ticketController.js
│   │   ├── analyticsController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Ticket.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── ticketRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── tyl/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── utils/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── .env.example
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/support_system
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

5. Seed the database with initial data:
```bash
npm run seed
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd tyl
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` if needed (default should work):
```
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Default Login Credentials

After running the seed script, you can use these credentials:

- **Admin**: admin@support.com / admin123
- **Agent**: agent1@support.com / agent123
- **Client**: client1@example.com / client123

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Tickets
- `GET /api/tickets` - Get all tickets (with filters)
- `GET /api/tickets/:id` - Get single ticket
- `POST /api/tickets` - Create ticket (Client only)
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket (Admin only)
- `POST /api/tickets/:id/comments` - Add comment
- `POST /api/tickets/:id/upload` - Upload file

### Analytics (Admin only)
- `GET /api/analytics` - Get analytics data

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user

## Features by Role

### Admin
- View all tickets
- Access analytics dashboard
- Manage users
- Assign tickets to agents
- Update any ticket

### Agent
- View assigned tickets and unassigned tickets
- Update ticket status and priority
- Add comments
- Assign tickets to themselves

### Client
- Create tickets
- View own tickets
- Update own ticket details (title, description, category)
- Add comments to own tickets

## Development

### Backend
- Development mode with auto-reload: `npm run dev`
- Production mode: `npm start`
- Seed database: `npm run seed`

### Frontend
- Development server: `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`

## Notes

- JWT tokens are stored in HttpOnly cookies for security
- File uploads are limited to 5MB per file
- All routes are protected except login
- Role-based access control is enforced on both frontend and backend
- Dark mode preference is saved in localStorage

## License

MIT

