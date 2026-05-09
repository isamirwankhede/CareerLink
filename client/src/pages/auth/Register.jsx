import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Briefcase, User, Shield, Mail, Lock, UserCircle } from 'lucide-react';
import Spinner from '../../components/Spinner';

const InputWrapper = ({ label, error, children }) => (
  <div>
    <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const Register = () => {
  const [role, setRole] = useState('user');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await register({ name: form.name, email: form.email, password: form.password, role });
    if (result.success) {
      navigate(result.user.role === 'admin' ? '/admin/dashboard' : '/');
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-violet-500 rounded-2xl shadow-glow mb-4">
            <Briefcase size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Create account</h1>
          <p className="text-gray-400 mt-2">Join thousands of professionals</p>
        </div>

        {/* Role Toggle */}
        <div className="glass rounded-2xl p-1 flex mb-6">
          {[
            { key: 'user', label: 'Job Seeker', icon: <User size={15} /> },
            { key: 'admin', label: 'Recruiter', icon: <Shield size={15} /> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setRole(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                role === key
                  ? 'bg-gradient-to-r from-primary-600 to-violet-600 text-white shadow-glow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
          <InputWrapper label="Full Name" error={errors.name}>
            <div className="relative">
              <UserCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="input-field pl-9"
              />
            </div>
          </InputWrapper>

          <InputWrapper label="Email" error={errors.email}>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="input-field pl-9"
              />
            </div>
          </InputWrapper>

          <InputWrapper label="Password" error={errors.password}>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 characters"
                className="input-field pl-9 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </InputWrapper>

          <InputWrapper label="Confirm Password" error={errors.confirmPassword}>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Repeat password"
                className="input-field pl-9"
              />
            </div>
          </InputWrapper>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
            {loading && <Spinner size="sm" />}
            {loading ? 'Creating account...' : `Register as ${role === 'admin' ? 'Recruiter' : 'Job Seeker'}`}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
