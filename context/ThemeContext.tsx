
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'neon' | 'pastel' | 'pet' | 'system';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('petpal_theme');
    if (saved && ['light', 'dark', 'neon', 'pastel', 'pet', 'system'].includes(saved)) {
      return saved as Theme;
    }
    return 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      // Remove all theme-related classes
      root.classList.remove('dark', 'theme-neon', 'theme-pastel', 'theme-pet');

      let effectiveTheme = theme;
      if (theme === 'system') {
        effectiveTheme = mediaQuery.matches ? 'dark' : 'light';
      }

      // Apply classes based on theme
      // Note: 'neon' is dark-based, 'pastel' and 'pet' are usually light-based but have custom colors.
      if (effectiveTheme === 'dark') {
        root.classList.add('dark');
      } else if (effectiveTheme === 'neon') {
        // Neon inherits dark mode utilities + custom variables
        root.classList.add('dark', 'theme-neon');
      } else if (effectiveTheme === 'pastel') {
        root.classList.add('theme-pastel');
      } else if (effectiveTheme === 'pet') {
        root.classList.add('theme-pet');
      }
      
      // Save persistence
      localStorage.setItem('petpal_theme', theme);
    };

    applyTheme();

    if (theme === 'system') {
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => {
      if (prev === 'dark' || prev === 'neon') return 'light';
      return 'dark';
    });
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
