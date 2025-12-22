import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'full', className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon: Stylized Paw with Heart/Check integration */}
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="text-teal-500"
      >
        {/* Main Pad (Heart-ish shape) */}
        <path 
          d="M16 29C22 25 26 20 26 15.5C26 13.5 24.5 12 22.5 12C21 12 19.5 13 19 14C18.5 13 17 12 15.5 12C13.5 12 12 13.5 12 15.5C12 20 16 25 22 29Z" 
          fill="currentColor"
          className="text-teal-500" 
        />
        {/* Simplified Main Pad with Checkmark Negative Space concept or just pure geometric friendly shape */}
        <path 
          d="M16 30C10 24 6 19 6 14C6 9.58 9.58 6 14 6C16.5 6 18.5 7.5 20 9.5C21.5 7.5 23.5 6 26 6C30.42 6 34 9.58 34 14C34 19 30 24 24 30" 
          fill="none"
        />
        
        {/* Redrawing a solid geometric paw */}
        <path 
          fillRule="evenodd" 
          clipRule="evenodd" 
          d="M8.5 11C9.88071 11 11 9.88071 11 8.5C11 7.11929 9.88071 6 8.5 6C7.11929 6 6 7.11929 6 8.5C6 9.88071 7.11929 11 8.5 11ZM16 8C17.3807 8 18.5 6.88071 18.5 5.5C18.5 4.11929 17.3807 3 16 3C14.6193 3 13.5 4.11929 13.5 5.5C13.5 6.88071 14.6193 8 16 8ZM23.5 11C24.8807 11 26 9.88071 26 8.5C26 7.11929 24.8807 6 23.5 6C22.1193 6 21 7.11929 21 8.5C21 9.88071 22.1193 11 23.5 11ZM10.708 15.501C10.155 13.435 11.411 11.833 13.513 11.924L18.487 11.924C20.589 11.833 21.845 13.435 21.292 15.501L19.462 22.333C18.989 24.099 17.525 25.432 15.703 25.432H16.297C14.475 25.432 13.011 24.099 12.538 22.333L10.708 15.501Z" 
          fill="currentColor"
        />
        
        {/* Accent Checkmark floating */}
        <circle cx="26" cy="26" r="6" className="text-white dark:text-gray-900" fill="currentColor"/>
        <circle cx="26" cy="26" r="4.5" className="text-coral-500" fill="currentColor"/>
        <path d="M24.5 26L25.5 27L27.5 25" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      {variant === 'full' && (
        <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Pet<span className="text-teal-500">Pal</span>
        </span>
      )}
    </div>
  );
};

export default Logo;