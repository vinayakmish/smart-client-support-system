import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { IconLogo, IconSun, IconMoon, IconEye, IconEyeOff } from '../components/Icons';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e, quickEmail, quickPassword) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    const emailToUse = quickEmail || formData.email;
    const passwordToUse = quickPassword || formData.password;

    const result = await login(emailToUse, passwordToUse);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Invalid credentials');
    }
  };

  const handleQuickLogin = (email, password) => {
    setFormData({ email, password });
    handleSubmit(null, email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 relative p-4 transition-colors duration-150">
      {/* Top right theme toggle */}
      <div className="absolute top-5 right-5">
        <button
          onClick={toggleTheme}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-sm transition-all cursor-pointer"
        >
          {darkMode ? <IconSun className="w-4 h-4 text-amber-500" /> : <IconMoon className="w-4 h-4 text-zinc-600" />}
          <span className="text-xs font-medium tracking-wide">
            {darkMode ? 'Light' : 'Dark'}
          </span>
        </button>
      </div>

      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 transition-colors duration-150">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 mb-4 shadow-sm">
            <IconLogo className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Sign in to SupportDesk
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Enterprise Client & Ticket Management Platform
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-300 rounded-lg text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3.5 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 outline-none text-sm transition-all placeholder-zinc-400"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-3.5 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-zinc-100/10 focus:border-zinc-900 dark:focus:border-zinc-100 outline-none text-sm transition-all placeholder-zinc-400 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-sm font-medium rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-2.5">
            Quick demo credentials:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@support.com', 'admin123')}
              className="py-1.5 px-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-md text-xs font-medium transition-all cursor-pointer text-center"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('agent1@support.com', 'agent123')}
              className="py-1.5 px-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-md text-xs font-medium transition-all cursor-pointer text-center"
            >
              Agent
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('client1@example.com', 'client123')}
              className="py-1.5 px-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-md text-xs font-medium transition-all cursor-pointer text-center"
            >
              Client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
