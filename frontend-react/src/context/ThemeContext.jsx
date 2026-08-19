import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('app_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // default dark theme
  });

  const [auroraVisible, setAuroraVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isLockedRef = useRef(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback((e) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
      e.preventDefault();
    }

    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const isLight = theme === 'light';

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isLight,
        toggleTheme,
        setTheme,
        auroraVisible,
        isTransitioning,
      }}
    >
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
