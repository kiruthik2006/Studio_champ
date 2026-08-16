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
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback((e) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
      e.preventDefault();
    }

    // Cooldown Guard
    if (isLockedRef.current) return;
    isLockedRef.current = true;
    setIsTransitioning(true);

    // 1. Subtly lower aurora opacity all the way to 0%
    setAuroraVisible(false);

    // 2. After aurora is completely faded out (220ms), switch theme
    setTimeout(() => {
      setTheme((prevTheme) => {
        const nextTheme = prevTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('app_theme', nextTheme);
        return nextTheme;
      });

      // 3. After switch completes (70ms), slowly bring the aurora back in
      setTimeout(() => {
        setAuroraVisible(true);

        // 4. End cooldown after aurora fade-in completes (450ms)
        setTimeout(() => {
          isLockedRef.current = false;
          setIsTransitioning(false);
        }, 450);
      }, 70);
    }, 220);
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
