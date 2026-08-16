import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('app_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // default dark theme
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback((e) => {
    const isCurrentlyDark = theme === 'dark';
    const nextTheme = isCurrentlyDark ? 'light' : 'dark';

    // Check if View Transitions API is supported
    if (document.startViewTransition) {
      const x = e?.clientX ?? window.innerWidth - 60;
      const y = e?.clientY ?? 35;
      // Generous radius ensures circle completely clears the furthest screen corner
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      ) + 30;

      const transitionType = isCurrentlyDark ? 'dark-to-light' : 'light-to-dark';
      document.documentElement.style.setProperty('--clip-x', `${x}px`);
      document.documentElement.style.setProperty('--clip-y', `${y}px`);
      document.documentElement.style.setProperty('--clip-radius', `${endRadius}px`);
      document.documentElement.setAttribute('data-theme-transition', transitionType);

      const transition = document.startViewTransition(() => {
        document.documentElement.setAttribute('data-theme', nextTheme);
        setTheme(nextTheme);
      });

      transition.finished.finally(() => {
        requestAnimationFrame(() => {
          document.documentElement.removeAttribute('data-theme-transition');
        });
      });
    } else {
      // Fallback smooth transition
      document.documentElement.classList.add('theme-transitioning');
      document.documentElement.setAttribute('data-theme', nextTheme);
      setTheme(nextTheme);
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 500);
    }
  }, [theme]);

  const isLight = theme === 'light';

  return (
    <ThemeContext.Provider value={{ theme, isLight, toggleTheme, setTheme }}>
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
