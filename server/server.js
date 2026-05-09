const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error.middleware');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/company', require('./routes/company.routes'));
app.use('/api/jobs', require('./routes/job.routes'));
app.use('/api', require('./routes/application.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Job Portal API is running 🚀' });
});

// Debug route to view all registered users (Recruiters & Job Seekers)
app.get('/api/debug/users', async (req, res) => {
  const User = require('./models/User.model');
  const users = await User.find({}).select('-password');
  res.json({ success: true, count: users.length, users });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
