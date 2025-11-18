import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/tickets', label: 'Tickets', icon: '🎫' },
    ...(isAdmin ? [{ path: '/analytics', label: 'Analytics', icon: '📈' }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Support System
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {user?.name} ({user?.role})
        </p>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              isActive(item.path)
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <span>{darkMode ? '☀️' : '🌙'}</span>
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

