import React, { useState, useRef, useEffect } from 'react';
import { useTheme, Theme } from '../context/ThemeContext';
import { Palette, Check, Monitor, Moon, Sun, Zap, Sparkles, Heart } from 'lucide-react';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes: { id: Theme; label: string; icon: any; color: string }[] = [
    { id: 'light', label: 'Classic', icon: Sun, color: 'bg-teal-500' },
    { id: 'dark', label: 'Dark', icon: Moon, color: 'bg-gray-800' },
    { id: 'neon', label: 'Neon', icon: Zap, color: 'bg-purple-500' },
    { id: 'pastel', label: 'Pastel', icon: Sparkles, color: 'bg-blue-300' },
    { id: 'pet', label: 'Pet', icon: Heart, color: 'bg-orange-400' },
    { id: 'system', label: 'System', icon: Monitor, color: 'bg-gray-400' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-full bg-surface border border-border text-muted hover:text-brand hover:bg-canvas transition-all shadow-sm group"
        title="Change Theme"
      >
        <Palette size={20} className="group-hover:rotate-12 transition-transform duration-300" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 w-56 bg-surface rounded-2xl shadow-xl border border-border p-2 z-50 animate-fade-in-up origin-top-right">
          <div className="text-xs font-bold text-muted uppercase tracking-wider px-3 py-2">
            Select Theme
          </div>
          <div className="space-y-1">
            {themes.map((t) => {
              const Icon = t.icon;
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-brand/10 text-brand' 
                      : 'text-main hover:bg-canvas'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isActive ? 'bg-brand text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                        <Icon size={14} />
                    </div>
                    {t.label}
                  </div>
                  {isActive && <Check size={16} className="text-brand" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;