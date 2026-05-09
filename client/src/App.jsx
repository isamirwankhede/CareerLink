import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Spinner from './components/Spinner';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Pages
import Home from './pages/user/Home';
import JobDetail from './pages/user/JobDetail';
import Profile from './pages/user/Profile';
import AppliedJobs from './pages/user/AppliedJobs';
import SavedJobs from './pages/user/SavedJobs';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import PostJob from './pages/admin/PostJob';
import ManageJobs from './pages/admin/ManageJobs';
import Applicants from './pages/admin/Applicants';
import CompanySetup from './pages/admin/CompanySetup';

const AppRoutes = () => {
  const { user, initialLoading } = useAuth();

  if (initialLoading) return <Spinner fullScreen />;

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/'} replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/'} replace /> : <Register />}
        />

        {/* User Routes */}
        <Route path="/" element={<ProtectedRoute role="user"><Home /></ProtectedRoute>} />
        <Route path="/job/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute role="user"><Profile /></ProtectedRoute>} />
        <Route path="/applied" element={<ProtectedRoute role="user"><AppliedJobs /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute role="user"><SavedJobs /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/post-job" element={<ProtectedRoute role="admin"><PostJob /></ProtectedRoute>} />
        <Route path="/admin/jobs" element={<ProtectedRoute role="admin"><ManageJobs /></ProtectedRoute>} />
        <Route path="/admin/applicants" element={<ProtectedRoute role="admin"><Applicants /></ProtectedRoute>} />
        <Route path="/admin/company" element={<ProtectedRoute role="admin"><CompanySetup /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/') : '/login'} replace />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          containerStyle={{ top: 80 }}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a2e',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
