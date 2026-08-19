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

    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    if (typeof document !== 'undefined' && document.startViewTransition) {
      const x = e?.clientX ?? window.innerWidth - 60;
      const y = e?.clientY ?? 35;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      ) + 20;

      const transition = document.startViewTransition(() => {
        document.documentElement.setAttribute('data-theme', nextTheme);
        document.documentElement.style.colorScheme = nextTheme;
        localStorage.setItem('app_theme', nextTheme);
        setTheme(nextTheme);
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 480,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
    } else {
      document.documentElement.setAttribute('data-theme', nextTheme);
      document.documentElement.style.colorScheme = nextTheme;
      localStorage.setItem('app_theme', nextTheme);
      setTheme(nextTheme);
    }
  }, [theme]);

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
