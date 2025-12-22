
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  direction?: 'up' | 'down';
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ direction = 'down' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  ];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('petpal_language', code);
    setIsOpen(false);
  };

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const DROPDOWN_WIDTH = 176; // Approx w-44 (11rem)
      
      const left = rect.left + (rect.width / 2) - (DROPDOWN_WIDTH / 2);
      let top = 0;

      if (direction === 'up') {
        // Position above the button with a 12px gap
        top = rect.top - 12; 
      } else {
        // Position below with a 12px gap
        top = rect.bottom + 12;
      }
      
      // Basic boundary check to prevent left overflow
      const safeLeft = Math.max(10, Math.min(left, window.innerWidth - DROPDOWN_WIDTH - 10));
      
      setPosition({ top, left: safeLeft });
    }
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen(!isOpen);
  };

  // Close when scrolling or resizing to keep UI clean and attached
  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => setIsOpen(false);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [isOpen]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is on button
      if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
        return;
      }
      // Check if click is inside dropdown portal
      const dropdown = document.getElementById('language-dropdown-portal');
      if (dropdown && dropdown.contains(event.target as Node)) {
        return;
      }
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <button 
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`p-2.5 rounded-full border transition-all shadow-sm group relative z-10 ${
            isOpen 
            ? 'bg-brand text-white border-brand' 
            : 'bg-surface border-border text-muted hover:text-brand hover:bg-canvas'
        }`}
        title="Change Language"
      >
        <Globe size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'group-hover:rotate-12'}`} />
      </button>

      {isOpen && createPortal(
        <div 
          id="language-dropdown-portal"
          className="fixed z-[9999] w-44 bg-surface rounded-2xl shadow-xl border border-border p-2 animate-fade-in"
          style={{
            top: position.top,
            left: position.left,
            transform: direction === 'up' ? 'translateY(-100%)' : 'none'
          }}
        >
          <div className="space-y-1">
            {languages.map((lang) => {
              const isActive = i18n.language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-brand/10 text-brand' 
                      : 'text-main hover:bg-canvas'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{lang.flag}</span>
                    {lang.label}
                  </div>
                  {isActive && <Check size={16} className="text-brand" />}
                </button>
              );
            })}
          </div>
          
          {/* Decorative Arrow */}
          <div className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-surface border-border transform rotate-45 ${
               direction === 'up' ? '-bottom-1.5 border-b border-r' : '-top-1.5 border-t border-l'
          }`}></div>
        </div>,
        document.body
      )}
    </>
  );
};

export default LanguageSwitcher;
