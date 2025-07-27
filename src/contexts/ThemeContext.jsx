import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSystemTheme, setIsSystemTheme] = useState(true);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('work-calculator_theme');
    
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setIsDarkMode(savedTheme === 'dark');
      setIsSystemTheme(false);
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemPrefersDark);
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        if (isSystemTheme) {
          setIsDarkMode(e.matches);
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [isSystemTheme]);

  // Update document class and save preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    if (!isSystemTheme) {
      localStorage.setItem('work-calculator_theme', isDarkMode ? 'dark' : 'light');
    } else {
      localStorage.removeItem('work-calculator_theme');
    }
  }, [isDarkMode, isSystemTheme]);

  const toggleTheme = () => {
    if (isSystemTheme) {
      // If we're currently using system theme, switch to manual mode with the opposite of current
      setIsDarkMode(!isDarkMode);
      setIsSystemTheme(false);
    } else {
      // If we're in manual mode, toggle between light and dark
      setIsDarkMode(!isDarkMode);
    }
  };

  const useSystemTheme = () => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(systemPrefersDark);
    setIsSystemTheme(true);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, isSystemTheme, toggleTheme, useSystemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
