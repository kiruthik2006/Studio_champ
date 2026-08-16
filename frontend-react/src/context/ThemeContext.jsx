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

    const isCurrentlyDark = theme === 'dark';
    const nextTheme = isCurrentlyDark ? 'light' : 'dark';

    // 1. Subtly fade out aurora to 0%
    setAuroraVisible(false);

    // 2. Once aurora is 0% (200ms), execute the circular ripple view transition
    setTimeout(() => {
      if (document.startViewTransition) {
        const x = e?.clientX ?? window.innerWidth - 60;
        const y = e?.clientY ?? 35;
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
          localStorage.setItem('app_theme', nextTheme);
          setTheme(nextTheme);
        });

        transition.finished.finally(() => {
          requestAnimationFrame(() => {
            document.documentElement.removeAttribute('data-theme-transition');

            // 3. Slowly bring the aurora back in on the new theme
            setTimeout(() => {
              setAuroraVisible(true);

              // 4. Release cooldown after aurora fade-in completes
              setTimeout(() => {
                isLockedRef.current = false;
                setIsTransitioning(false);
              }, 400);
            }, 60);
          });
        });
      } else {
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('app_theme', nextTheme);
        setTheme(nextTheme);

        setTimeout(() => {
          setAuroraVisible(true);
          setTimeout(() => {
            isLockedRef.current = false;
            setIsTransitioning(false);
          }, 400);
        }, 60);
      }
    }, 200);
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
