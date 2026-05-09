# 🎯 CareerLink (MERN Job Portal) — Interview Preparation Guide

This document is designed to help you confidently explain your project in a technical interview. It covers the architecture, data flow, and exactly how to answer the most common questions interviewers will ask.

---

## 🏗️ 1. Architecture & Workflow Explanation

When an interviewer asks: *"Can you walk me through the architecture and data flow of your project?"*

**How to answer:**
"CareerLink is a full-stack web application built on the MERN stack. The architecture follows a standard client-server model separated into three main layers:"

1. **The Client Layer (React & Vite):** 
   - Handles the User Interface and client-side routing using `react-router-dom`.
   - Uses `AuthContext` (React Context API) to manage global authentication state across the app.
   - Makes HTTP requests to the backend using `Axios`. Axios is configured with an interceptor that automatically attaches a JWT (JSON Web Token) to the headers of every outgoing request.

2. **The Server Layer (Node.js & Express):**
   - Acts as a REST API. It receives requests, validates data, enforces role-based access control (RBAC), and interacts with the database.
   - Uses custom middleware for security: `protect` (verifies the JWT) and `authorize` (checks if the user is an 'admin' or 'user').

3. **The Database Layer (MongoDB & Mongoose):**
   - A NoSQL database that stores our highly relational data using Mongoose Object Data Modeling (ODM).

---

## 🔄 2. Core Workflows Explained

### Authentication Workflow (How Login Works)
1. User enters credentials on the frontend.
2. React sends a `POST /api/auth/login` request.
3. Express finds the user in MongoDB and compares the hashed password using `bcryptjs`.
4. If successful, Express signs a JWT (containing the user ID) using `jsonwebtoken`.
5. The JWT is sent back to the frontend and stored in the browser's `localStorage` (and optionally a cookie).
6. The React `AuthContext` reads the token, decodes the user role, and unlocks protected routes.

### Job Application Workflow
1. A **Recruiter (Admin)** creates a Company profile, then posts a Job. The Job document in MongoDB stores the `companyId` and `createdBy` (Admin's user ID).
2. A **Job Seeker (User)** clicks "Apply" and submits a Cover Letter and Resume Link.
3. React sends a `POST /api/apply/:jobId` request.
4. Express creates a new `Application` document containing `userId`, `jobId`, `coverLetter`, `resumeLink`, and defaults the status to `pending`.
5. The Recruiter views their dashboard, which fetches all applications tied to their jobs. They update the status to `accepted`, which triggers a `PUT` request to update the Application document.

---

## 🗄️ 3. Database Relationships

Interviewers love asking about how your data connects in NoSQL.

- **One-to-Many:** One `User` (Admin) can create Many `Companies`. One `Company` can have Many `Jobs`. One `Job` has Many `Applications`.
- **References (`ref`):** Instead of nesting all data inside one massive document, we use Mongoose `ObjectId` references. For example, an `Application` schema stores `userId` and `jobId`. When the frontend needs the job details of an application, the backend uses `.populate('jobId')` to dynamically join the Job data into the response.

---

## 🗣️ 4. Top Interview Questions & How to Answer Them

### 🔒 Security & Authentication
**Q: How did you secure the application and handle authentication?**
**A:** "I implemented stateless authentication using JSON Web Tokens (JWT). When a user logs in, the server generates a JWT containing their ID and signs it with a secret key. The frontend stores this token and sends it in the `Authorization: Bearer` header via an Axios interceptor. On the backend, a custom `protect` middleware verifies the token signature before allowing access to private routes. Passwords are never stored in plain text; they are hashed using `bcryptjs` before saving to MongoDB."

**Q: How do you handle authorization (Roles)?**
**A:** "I implemented Role-Based Access Control (RBAC). The User schema has a `role` field ('user' or 'admin'). I wrote an `authorize(...roles)` middleware in Express. If a route is strictly for recruiters (like creating a job), the route is wrapped in `authorize('admin')`. If a Job Seeker tries to access it, the middleware blocks the request with a 403 Forbidden error."

### ⚛️ Frontend & React
**Q: Why did you use Context API instead of Redux?**
**A:** "For CareerLink, the only truly global state that needs to be accessed by almost every component is the Authentication state (user info, token, loading state). Context API is built directly into React and is perfect for low-frequency updates like auth state. Redux would have added unnecessary boilerplate and complexity for an app of this scale."

**Q: How do you handle private/protected routes in React?**
**A:** "I created a `ProtectedRoute` component that wraps sensitive routes. It checks the `AuthContext`. If `isAuthenticated` is false, it returns a `<Navigate to="/login" />` component. I also added role checks, so if a Job Seeker tries to access `/admin/dashboard`, the `ProtectedRoute` kicks them back to the home page."

### 🗄️ Backend & Database
**Q: MongoDB is a NoSQL database. How do you handle relationships between Jobs, Companies, and Users?**
**A:** "I used normalized data models with Mongoose references. Rather than embedding an entire Company inside a Job document (which would cause data duplication if a company updates its name), the Job document stores a `companyId` Reference. When fetching jobs, I use Mongoose's `.populate('companyId')` method to join the data at query time, simulating a relational database join."

**Q: What happens if a user applies for the exact same job twice?**
**A:** "To prevent duplicate applications, the backend application controller first queries the `Application` collection to check if a document already exists with both the current `userId` and the specific `jobId`. If it finds a match, it returns a 400 error saying 'You have already applied for this job', preventing database clutter."

### 🚀 General / Problem Solving
**Q: What was the hardest bug you faced while building this and how did you fix it?**
**A:** *(You can use the bugs we fixed as an example!)*
"One tricky issue was an overlapping UI bug and variable shadowing. When a user checked if a job was saved, the `id` parameter in the `.some()` array method was accidentally shadowing the `id` coming from React Router's URL params. This caused the app to compare the wrong IDs, so jobs weren't showing up as 'Saved'. I debugged it by tracing the variables, realized the scope conflict, and renamed the callback parameter to `sid`, which immediately fixed the logic." 

**Q: How would you scale this app if it got 100,000 users?**
**A:** "First, I would add **pagination** to the Jobs API so we aren't sending thousands of jobs to the client at once. Second, I would add **caching** (like Redis) for the `getAllJobs` endpoint since job listings are read frequently but updated less often. Finally, I would implement **file uploading** via AWS S3 or Cloudinary for resumes instead of just storing URL strings."
