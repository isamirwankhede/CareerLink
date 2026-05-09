# 🚀 MERN Job Portal — Complete Project Guide

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, TailwindCSS, react-router-dom v7 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (local) + Mongoose ODM |
| **Auth** | JWT (JSON Web Tokens) stored in localStorage + httpOnly cookie |
| **Styling** | TailwindCSS v3 + custom design system (glassmorphism, dark mode) |
| **Icons** | lucide-react |
| **Notifications** | react-hot-toast |
| **HTTP Client** | Axios (with JWT interceptor) |

---

## 📁 Project Structure

```
c:\job-portal\
├── client/                        # React Frontend (Vite)
│   └── src/
│       ├── main.jsx               # App entry point
│       ├── App.jsx                # Routes & layout
│       ├── index.css              # Global styles (Tailwind + custom)
│       ├── context/
│       │   └── AuthContext.jsx    # Global auth state (user, login, logout)
│       ├── services/              # Axios API calls
│       │   ├── api.js             # Base Axios instance (JWT interceptor)
│       │   ├── auth.service.js    # register, login, logout, getMe
│       │   ├── job.service.js     # getAllJobs, getJob, createJob, etc.
│       │   ├── application.service.js  # apply, getUserApplications, etc.
│       │   ├── user.service.js    # getProfile, updateProfile, saveJob
│       │   └── company.service.js # createCompany, getCompanies, etc.
│       ├── components/            # Reusable UI components
│       │   ├── Navbar.jsx         # Top navigation bar
│       │   ├── JobCard.jsx        # Job listing card
│       │   ├── FilterPanel.jsx    # Left sidebar filters
│       │   ├── SearchBar.jsx      # Keyword + location search
│       │   ├── DashboardCards.jsx # Admin stat cards
│       │   ├── ProtectedRoute.jsx # Auth + role guard
│       │   └── Spinner.jsx        # Loading spinner
│       └── pages/
│           ├── auth/
│           │   ├── Login.jsx
│           │   └── Register.jsx
│           ├── user/              # Job Seeker pages
│           │   ├── Home.jsx       # Browse & search jobs
│           │   ├── JobDetail.jsx  # Single job + apply form
│           │   ├── Profile.jsx    # Edit profile & skills
│           │   ├── AppliedJobs.jsx # Track applications
│           │   └── SavedJobs.jsx  # Bookmarked jobs
│           └── admin/             # Recruiter pages
│               ├── Dashboard.jsx  # Stats overview
│               ├── CompanySetup.jsx # Create/edit company
│               ├── PostJob.jsx    # Create new job listing
│               ├── ManageJobs.jsx # Edit/delete/toggle jobs
│               └── Applicants.jsx # Review applicants
│
└── server/                        # Express Backend
    ├── server.js                  # Entry point
    ├── .env                       # Environment variables
    ├── config/
    │   └── db.js                  # MongoDB connection
    ├── models/
    │   ├── User.model.js          # Users schema
    │   ├── Job.model.js           # Jobs schema
    │   ├── Application.model.js   # Applications schema
    │   └── Company.model.js       # Companies schema
    ├── controllers/               # Business logic
    │   ├── auth.controller.js
    │   ├── user.controller.js
    │   ├── job.controller.js
    │   ├── application.controller.js
    │   └── company.controller.js
    ├── routes/                    # Express route definitions
    │   ├── auth.routes.js
    │   ├── user.routes.js
    │   ├── job.routes.js
    │   ├── application.routes.js
    │   └── company.routes.js
    └── middleware/
        ├── auth.middleware.js     # JWT protect + role authorize
        └── error.middleware.js    # Global error handler
```

---

## ⚙️ Commands to Run the Project

### Prerequisites (install once)
```bash
# Install server dependencies
cd c:\job-portal\server
npm install

# Install client dependencies
cd c:\job-portal\client
npm install
```

### Run (every time you want to start)

> Open **2 separate terminals** side by side

**Terminal 1 — Backend Server:**
```powershell
cd c:\job-portal\server
node server.js
# OR with auto-restart on file changes:
npx nodemon server.js
```

**Terminal 2 — Frontend Dev Server:**
```powershell
cd c:\job-portal\client
npm run dev
```

### Access the App
| URL | Purpose |
|---|---|
| http://localhost:5173 | Frontend (React app) |
| http://localhost:5000/api/health | Backend health check |
| http://localhost:5000/api/debug/users | View all registered users |

---

## 🔐 Environment Variables (`server/.env`)

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/job-portal
JWT_SECRET=supersecretjwtkey_12345
CLIENT_URL=http://localhost:5173
```

---

## 👤 Two User Roles

| Role | Who | What they can do |
|---|---|---|
| `user` | Job Seeker | Browse jobs, apply, save jobs, manage profile |
| `admin` | Recruiter | Create company, post jobs, manage jobs, view applicants |

---

## 🔄 Full App Flow

### Flow 1 — Job Seeker (role: user)

```
Register → Login → Browse Jobs (Home) → Search/Filter
  → Click Job Card → View Job Detail
  → Click "Apply Now" → Fill Resume Link + Cover Letter → Submit
  → Track status in "Applied Jobs"
  → Bookmark jobs → View in "Saved Jobs"
  → Edit profile/skills in "Profile"
```

**Step by step:**
1. Go to `/register` → fill Name, Email, Password, select **User**
2. You're auto-logged in and redirected to `/` (Home)
3. Browse all active job listings
4. Use the **SearchBar** (keyword/location) or **Filter Panel** (job type, experience, category)
5. Click any **Job Card** → goes to `/job/:id`
6. On the Job Detail page:
   - Click **"Apply Now"** → form slides in
   - Optionally enter your **Resume URL** (Google Drive link etc.)
   - Optionally write a **Cover Letter**
   - Click **"Submit Application"**
7. Go to **Applied** in the navbar → see all your applications + their status
8. Go to **Saved** → see bookmarked jobs (bookmark icon on any job card)
9. Go to **Profile** → edit your name, bio, location, phone, experience, education, skills, resume URL

---

### Flow 2 — Recruiter (role: admin)

```
Register (admin) → Login → Dashboard
  → Company Setup → Create Company
  → Post Job → Fill details → Submit
  → Manage Jobs → Toggle active/inactive, Delete
  → Applicants → Filter by job → Change status (pending/reviewing/accepted/rejected)
```

**Step by step:**
1. Go to `/register` → fill details, select **Admin**
2. Auto-redirected to `/admin/dashboard`
3. **MUST DO FIRST:** Go to **Company** → click "Add Company" → fill company details → Create
4. Go to **Post Job** → fill:
   - Job Title, select Company, Description
   - Location, Salary, Job Type, Experience, Category
   - Add Skills and Requirements
   - Click **Post Job**
5. Go to **Manage Jobs** → see all your job listings:
   - Toggle **Active/Closed** (closed jobs don't appear to job seekers)
   - Click **Applicants** to filter applicants for that job
   - **Delete** job (also removes all applications for that job)
6. Go to **Applicants** → 
   - Filter by specific job or view all
   - See applicant's name, email, phone, skills, experience, resume link
   - Change status dropdown: `pending → reviewing → accepted → rejected`

---

## 🌐 All API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/logout` | Private | Logout |
| GET | `/api/auth/me` | Private | Get current user |

### User Routes (`/api/user`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/user/profile` | Private | Get profile (with savedJobs populated) |
| PUT | `/api/user/profile` | Private | Update profile |
| PUT | `/api/user/save-job/:jobId` | User only | Toggle save/unsave job |

### Job Routes (`/api/jobs`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/jobs` | Private | Get all active jobs (with filters) |
| GET | `/api/jobs/admin` | Admin only | Get admin's own jobs |
| GET | `/api/jobs/:id` | Private | Get single job detail |
| POST | `/api/jobs` | Admin only | Create new job |
| PUT | `/api/jobs/:id` | Admin only | Update job |
| DELETE | `/api/jobs/:id` | Admin only | Delete job |

### Application Routes (`/api`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/apply/:jobId` | User only | Apply for a job |
| GET | `/api/applications` | User only | Get my applications |
| GET | `/api/applications/admin` | Admin only | Get all applications for my jobs |
| GET | `/api/applications/job/:jobId` | Admin only | Get applicants for specific job |
| PUT | `/api/application/status/:id` | Admin only | Update application status |

### Company Routes (`/api/company`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/company` | Admin only | Create company |
| GET | `/api/company` | Admin only | Get admin's companies |
| GET | `/api/company/:id` | Private | Get single company |
| PUT | `/api/company/:id` | Admin only | Update company |

---

## 🗄️ Database Collections (MongoDB)

### users
```js
{
  name, email, password (hashed),
  role: "user" | "admin",
  skills: [],
  resume: "",          // Resume URL
  experience: "",
  education: "",
  bio: "", location: "", phone: "", avatar: "",
  savedJobs: [ObjectId]  // References to Job documents
}
```

### jobs
```js
{
  title, description, requirements: [],
  salary, location,
  jobType: "Full-time" | "Part-time" | "Contract" | "Internship" | "Remote",
  experience, skills: [], category,
  companyId: ObjectId,    // Reference to Company
  createdBy: ObjectId,    // Reference to User (admin)
  applicants: [ObjectId], // References to Applications
  isActive: true
}
```

### applications
```js
{
  userId: ObjectId,     // Who applied
  jobId: ObjectId,      // Which job
  status: "pending" | "reviewing" | "accepted" | "rejected",
  coverLetter: "",
  resumeLink: ""        // Resume submitted at apply time
}
```

### companies
```js
{
  companyName, description, website,
  location, industry, size, logo,
  createdBy: ObjectId   // Admin who created it
}
```

---

## 🐚 mongosh Commands — Inspect Your Data

Open a terminal and run `mongosh`, then:

```js
// Select the database
use job-portal

// View all users (without passwords)
db.users.find({}, { password: 0 }).pretty()

// View all jobs
db.jobs.find().pretty()

// View only active jobs
db.jobs.find({ isActive: true })

// View all companies
db.companies.find().pretty()

// View all applications
db.applications.find().pretty()

// View pending applications only
db.applications.find({ status: "pending" })

// Count documents in each collection
db.users.countDocuments()
db.jobs.countDocuments()
db.applications.countDocuments()
db.companies.countDocuments()

// Delete all data (fresh start)
db.users.deleteMany({})
db.jobs.deleteMany({})
db.applications.deleteMany({})
db.companies.deleteMany({})

// Exit mongosh
exit
```

---

## 🔑 Authentication Flow (How JWT Works)

```
User logs in
    ↓
Server validates credentials
    ↓
Server creates JWT token (expires in 7 days)
    ↓
Token sent back in:
  - Response body (saved to localStorage by client)
  - httpOnly Cookie (backup)
    ↓
Every API request → Axios adds "Authorization: Bearer <token>"
    ↓
Server middleware (protect) verifies token → attaches req.user
    ↓
authorize('admin') or authorize('user') checks role
```

---

## 🚦 Application Status Flow

```
User Applies → pending
      ↓
Admin Reviews → reviewing
      ↓
      ├── accepted ✅
      └── rejected ❌
```

---

## ❗ Common Issues & Fixes

| Problem | Fix |
|---|---|
| `Cannot connect to MongoDB` | Run `Get-Service MongoDB` — if stopped, start it from Services |
| White screen on frontend | Make sure `npm run dev` is running in `/client` |
| 401 Unauthorized | Token expired — logout and login again |
| "No Company Found" on Post Job | Create a company first under Admin → Company |
| Port 5000 already in use | Kill the old process or change `PORT` in `.env` |
| Data not showing | Make sure BOTH servers are running (port 5000 + 5173) |
