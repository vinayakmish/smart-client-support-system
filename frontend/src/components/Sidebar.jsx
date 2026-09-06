import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  IconDashboard,
  IconTicket,
  IconAnalytics,
  IconSun,
  IconMoon,
  IconLogout,
  IconLogo,
} from './Icons';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: IconDashboard },
    { path: '/tickets', label: 'Tickets', icon: IconTicket },
    ...(isAdmin ? [{ path: '/analytics', label: 'Analytics', icon: IconAnalytics }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50';
      case 'agent':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50';
      default:
        return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-60 h-screen flex-shrink-0 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between select-none transition-colors duration-150">
      {/* Top Header & Navigation */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Workspace Brand */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center flex-shrink-0 shadow-sm">
              <IconLogo className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight truncate">
                SupportDesk
              </h1>
              <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider truncate">
                Enterprise
              </p>
            </div>
          </div>
        </div>

        {/* User Account Info */}
        <div className="px-4 py-3 mx-3 my-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium flex items-center justify-center text-xs flex-shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
              {user?.name || 'User'}
            </p>
            <div className="mt-0.5">
              <span
                className={`inline-block px-1.5 py-0.2 text-[9px] font-semibold uppercase rounded tracking-wider ${getRoleBadge(
                  user?.role
                )}`}
              >
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  active
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-current' : 'text-zinc-400 dark:text-zinc-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Pinned Bottom Controls */}
      <div className="p-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1.5 bg-white dark:bg-zinc-950">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 text-xs font-medium transition-colors cursor-pointer"
        >
          <span className="flex items-center space-x-2">
            {darkMode ? <IconSun className="w-3.5 h-3.5 text-amber-500" /> : <IconMoon className="w-3.5 h-3.5 text-zinc-500" />}
            <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
          </span>
          <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
            {darkMode ? 'Light' : 'Dark'}
          </span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-medium transition-colors cursor-pointer"
        >
          <IconLogout className="w-3.5 h-3.5" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
