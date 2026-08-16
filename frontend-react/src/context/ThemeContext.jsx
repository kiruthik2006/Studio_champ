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
      // Calculate origin coordinates from button click or default top-right
      const x = e?.clientX ?? window.innerWidth - 60;
      const y = e?.clientY ?? 35;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transitionType = isCurrentlyDark ? 'dark-to-light' : 'light-to-dark';
      document.documentElement.setAttribute('data-theme-transition', transitionType);

      const transition = document.startViewTransition(() => {
        document.documentElement.setAttribute('data-theme', nextTheme);
        setTheme(nextTheme);
      });

      transition.ready.then(() => {
        if (!isCurrentlyDark) {
          // FORWARD: Turning Dark Mode ON (expanding dark circle outward)
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 550,
              easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        } else {
          // REVERSE: Turning Dark Mode OFF (dark view shrinks/collapses inward)
          document.documentElement.animate(
            {
              clipPath: [
                `circle(${endRadius}px at ${x}px ${y}px)`,
                `circle(0px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 550,
              easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
              pseudoElement: '::view-transition-old(root)',
            }
          );
        }
      });

      transition.finished.finally(() => {
        document.documentElement.removeAttribute('data-theme-transition');
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
