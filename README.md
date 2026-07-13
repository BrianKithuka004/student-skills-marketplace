# 🎓 Student Skills Marketplace

A marketplace for students to find freelance opportunities and talent on campus.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributors](#contributors)

---

## 🛠️ Tech Stack

### Frontend
- React.js 18
- TailwindCSS
- Framer Motion
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js 4
- Prisma ORM
- PostgreSQL (Supabase)
- JWT Authentication

### Deployment
- Vercel (Frontend)
- Render/Railway (Backend - Coming Soon)

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- [PostgreSQL](https://www.postgresql.org/) (or use Supabase)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/BrianKithuka004/student-skills-marketplace.git
cd student-skills-marketplace
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` folder:

```bash
cd backend
notepad .env   # Windows
# or
touch .env    # Mac/Linux
```

Add the following variables:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres"
JWT_SECRET="your_super_secret_jwt_key"
PORT=5000
```

**Generate a JWT Secret:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🗄️ Database Setup

### Using Supabase (Recommended)

1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project
3. Copy your connection string
4. Add it to your `.env` file

### Run Migrations

```bash
cd backend
npx prisma generate
npx prisma db push
```

### Verify Database

```bash
npx prisma studio
```

This opens a browser at `http://localhost:5555` showing your database tables.

---

## 🏃 Running the Project

### Start Backend

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### Start Frontend

Open a **new terminal**:

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| GET | `/api/jobs` | Get all jobs |
| POST | `/api/jobs` | Create a job |
| GET | `/api/jobs/:id` | Get job by ID |
| PUT | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |
| GET | `/api/applications` | Get all applications |
| POST | `/api/applications` | Create an application |
| GET | `/api/reviews` | Get all reviews |
| POST | `/api/reviews` | Create a review |

---

## 📁 Project Structure

```
student-skills-marketplace/
├── backend/
│   ├── controllers/      # Business logic
│   ├── routes/           # API endpoints
│   ├── src/
│   │   ├── middleware/   # Auth, validation
│   │   └── server.js     # Entry point
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   └── migrations/   # Database migrations
│   ├── .env              # Environment variables
│   └── package.json
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   ├── services/     # API services
│   │   └── App.js        # Main app
│   └── package.json
├── README.md
└── .gitignore
```

---

## 🌐 Deployment

### Frontend (Vercel)

1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Select `student-skills-marketplace`
5. Set **Root Directory** to `frontend`
6. Click "Deploy"

**Live URL:** https://student-skills-marketplace.vercel.app

### Backend (Coming Soon)

Will be deployed to Render or Railway.

---

## 👥 Contributors

- **Brian Kithuka** - Project Lead
- **Cee** - Collaborator
- **Wanyangu Flavius** - Collaborator
- **erickilungya** - Collaborator
- **lynmbinya** - Collaborator
- **Petermusolya** - Collaborator

---

## 📄 License

MIT

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Happy Coding! 🚀**