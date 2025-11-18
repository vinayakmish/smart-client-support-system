Project: Smart Client Support Management System (MERN)

Goal:
Generate a complete MERN repository scaffold + working code for a Support Ticket system with analytics dashboard using the spec below. Do NOT create a Sign Up page — authentication should be seed-only (seeded users) and login only. Use best practices for security and structure.

High-level features (must implement):
- JWT auth using HttpOnly cookies (roles: Admin, Agent, Client). No signup page; use seeded accounts.
- Ticket management: create/read/update/delete (CR*D; Delete admin-only).
- Comments on tickets.
- File uploads (Multer) with 5MB limit.
- Role-based access control middleware for protected routes.
- Analytics endpoint for Admin that returns aggregated metrics (tickets by status, tickets per agent, monthly ticket counts).
- Dark/Light theme toggle persisted in localStorage.
- Responsive UI, Vite + React 19, Tailwind CSS, React Router, Recharts for graphs, Axios for API calls.
- Advanced filtering + search on tickets (status, priority, assigned agent, date range, text search).
- Use bcrypt for password hashing.
- Seed script to create Admin/Agent/Client default accounts and sample tickets.

Backend requirements:
- Node.js + Express, MongoDB + Mongoose.
- Folder structure:
  backend/
    config/db.js
    controllers/{authController,ticketController,analyticsController,userController}
    models/{User,Ticket,Comment}
    middleware/{auth,upload,roleCheck}
    routes/{authRoutes,ticketRoutes,analyticsRoutes,userRoutes}
    uploads/ (for files)
    server.js
    package.json
- Use HttpOnly cookies for JWT (set on login, clear on logout).
- Validate inputs and return consistent JSON responses with proper status codes.
- Provide `npm run seed` script to populate DB.
- Use environment variables (JWT_SECRET, MONGODB_URI, FRONTEND_URL, PORT).
- Provide CORS allowing FRONTEND_URL and secure cookie options when NODE_ENV=production.

Frontend requirements:
- Vite + React 19 project in `tyl/`.
- Context providers for Auth and Theme.
- Login page only; no sign-up.
- Pages: Dashboard(Admin-only analytics), TicketsList, TicketDetail, NewTicket (Client only), UsersList(Admin only), Profile.
- Ticket actions depend on role (assign to agent, change status/priority, add comments, upload attachments).
- Use Recharts for admin analytics (tickets by status, tickets per agent, monthly trend).
- Use localStorage for dark mode; persist token via HttpOnly cookies (so frontend uses API to get current user from `/api/auth/me`).
- Show friendly toasts for success/error.
- Provide responsive components and examples using Tailwind.

Deliverables:
- Full code for both backend and frontend ready to run locally.
- `README.md` with setup steps for backend and frontend (include seed step).
- `.env.example` files for frontend and backend.
- Seeded default users:
  - Admin: admin@support.com / admin123
  - Agent: agent1@support.com / agent123
  - Client: client1@example.com / client123

Additional instructions:
- Keep code modular; include comments for important parts.
- Ensure file upload size limited to 5MB and only allow common safe extensions (.png, .jpg, .pdf, .docx).
- Include tests for critical backend routes (optional but preferred).
- Include helpful npm scripts:
  - backend: dev, start, seed
  - frontend: dev, build, preview
- When generating code, include small example of how to call the analytics endpoint and sample response.
- Add `.env.example` contents at top-level of both packages.

Now scaffold the repository with production-ready code files and the README. Provide the code files as a file tree and include the most important file contents inline (server.js, auth middleware, sample model, React App main files, and analytics charts). Keep the implementation concise but complete enough to run locally with minimal edits.
