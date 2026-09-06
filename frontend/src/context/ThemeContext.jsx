import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();

  const [darkMode, setDarkMode] = useState(() => {
    const userKey = user?.email ? `darkMode_${user.email}` : 'darkMode_guest';
    const stored = localStorage.getItem(userKey);
    // Default to true (Dark Mode) if user has not set a preference yet
    return stored !== null ? JSON.parse(stored) : true;
  });

  // When user logs in / out / switches, load that specific user's independent theme
  useEffect(() => {
    const currentKey = user?.email ? `darkMode_${user.email}` : 'darkMode_guest';
    const stored = localStorage.getItem(currentKey);
    // Default to true (Dark Mode) for new sessions / users without saved preference
    const userPref = stored !== null ? JSON.parse(stored) : true;
    setDarkMode(userPref);
  }, [user?.email]);

  // Persist preference and update document class
  useEffect(() => {
    const currentKey = user?.email ? `darkMode_${user.email}` : 'darkMode_guest';
    localStorage.setItem(currentKey, JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode, user?.email]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
