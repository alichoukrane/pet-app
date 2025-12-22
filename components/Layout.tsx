
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Dog, Calendar, MessageCircle, GraduationCap, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AlarmManager from './AlarmManager';
import SettingsDrawer from './SettingsDrawer';
import TrainerDrawer from './TrainerDrawer';
import Logo from './Logo';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [isTrainerDrawerOpen, setIsTrainerDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navItems = [
    { path: '/', label: t('nav.dashboard'), icon: LayoutDashboard },
    { path: '/pets', label: t('nav.pets'), icon: Dog },
    { path: '/calendar', label: t('nav.calendar'), icon: Calendar },
    { path: '/assistant', label: t('nav.assistant'), icon: MessageCircle },
  ];

  // Helper for specific icon animations based on the path/label
  const getIconAnimationClass = (path: string) => {
    switch (path) {
      case '/': return 'group-hover:rotate-[5deg] origin-center';
      case '/pets': return 'group-hover:animate-bounce-once';
      case '/calendar': return 'group-hover:animate-shake';
      case '/assistant': return 'group-hover:animate-pulse group-hover:text-teal-400 group-hover:drop-shadow-[0_0_8px_rgba(45,212,191,0.6)]';
      case 'trainer': return 'group-hover:text-brand group-hover:scale-110';
      default: return '';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-canvas text-main transition-colors duration-300 font-sans">
      {/* Alarm System */}
      <AlarmManager />

      {/* Drawers */}
      <TrainerDrawer isOpen={isTrainerDrawerOpen} onClose={() => setIsTrainerDrawerOpen(false)} />
      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border shadow-soft z-20 animate-slide-in-left transition-colors duration-300">
        <div className="flex items-center justify-between p-6">
          <Link to="/" className="hover:opacity-80 transition-opacity transform hover:scale-105 duration-300">
            <Logo variant="full" />
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-3 mt-4">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const delayStyle = { animationDelay: `${index * 80 + 100}ms` };

            return (
              <Link
                key={item.path}
                to={item.path}
                style={delayStyle}
                className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium overflow-hidden animate-slide-in-left opacity-0 fill-mode-forwards hover:scale-[1.03] ${
                  isActive
                    ? 'text-brand shadow-md shadow-brand/10'
                    : 'text-muted hover:text-main hover:bg-canvas'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-brand/10 to-transparent border-l-4 border-brand transition-all duration-500 ease-out"></div>
                )}
                {!isActive && (
                   <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-sm"></div>
                )}
                <div className={`relative z-10 p-1.5 rounded-lg transition-colors duration-300 ${isActive ? 'bg-brand/10 text-brand' : 'bg-transparent'} ${getIconAnimationClass(item.path)}`}>
                   <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="transition-all duration-300" />
                   <div className="absolute inset-0 bg-brand/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
                <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'translate-x-1 font-bold' : 'group-hover:translate-x-1'}`}>
                   {item.label}
                </span>
                {!isActive && (
                   <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-brand opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0"></div>
                )}
              </Link>
            );
          })}

          {/* New Sidebar Item: Dog Trainer */}
          <button
            onClick={() => setIsTrainerDrawerOpen(true)}
            style={{ animationDelay: '400ms' }}
            className={`w-full group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium overflow-hidden animate-slide-in-left opacity-0 fill-mode-forwards hover:scale-[1.03] ${
              isTrainerDrawerOpen
                ? 'text-brand shadow-md shadow-brand/10'
                : 'text-muted hover:text-main hover:bg-canvas'
            }`}
          >
             {isTrainerDrawerOpen && (
                <div className="absolute inset-0 bg-gradient-to-r from-brand/10 to-transparent border-l-4 border-brand transition-all duration-500 ease-out"></div>
             )}
             {!isTrainerDrawerOpen && (
                 <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-sm"></div>
             )}
             <div className={`relative z-10 p-1.5 rounded-lg transition-colors duration-300 ${isTrainerDrawerOpen ? 'bg-brand/10 text-brand' : 'bg-transparent'} ${getIconAnimationClass('trainer')}`}>
                <GraduationCap size={20} strokeWidth={isTrainerDrawerOpen ? 2.5 : 2} className="transition-all duration-300" />
             </div>
             <span className={`relative z-10 transition-transform duration-300 ${isTrainerDrawerOpen ? 'translate-x-1 font-bold' : 'group-hover:translate-x-1'}`}>
                {t('nav.trainer')}
             </span>
          </button>
        </nav>

        {/* Bottom Actions */}
        <div className="p-5 border-t border-border flex gap-3 justify-center items-center pb-8 animate-slide-in-left opacity-0 fill-mode-forwards" style={{ animationDelay: '500ms' }}>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="w-full py-3 bg-surface border border-border rounded-2xl flex items-center justify-center gap-2 text-muted hover:text-brand hover:border-brand transition-all shadow-sm group"
            >
               <Settings size={20} className="group-hover:rotate-45 transition-transform duration-500" />
               <span className="font-bold text-sm">Settings</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-surface border-b border-border z-10 shadow-sm transition-colors duration-300">
           <Link to="/">
             <Logo variant="icon" />
           </Link>
           <div className="flex items-center gap-2">
             <button onClick={() => setIsTrainerDrawerOpen(true)} className="p-2 text-muted hover:text-brand rounded-full">
                <GraduationCap size={20} />
             </button>
             <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-muted hover:text-brand rounded-full">
                <Settings size={20} />
             </button>
           </div>
        </header>
        
        <div className="flex-1 overflow-y-auto bg-canvas transition-colors duration-300 scroll-smooth flex flex-col">
          <div className="flex-1 p-4 pb-24 md:p-8">
             <div className="max-w-5xl mx-auto">
                {children}
             </div>
          </div>
          {/* Professional Footer */}
          <Footer />
        </div>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden absolute bottom-0 w-full bg-surface border-t border-border z-10 pb-safe shadow-soft transition-colors duration-300">
          <div className="flex justify-around items-center h-16">
             {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex flex-col items-center justify-center w-full h-full transition-colors relative ${
                    isActive ? 'text-brand' : 'text-muted hover:text-main'
                  }`}
                >
                  {/* Mobile Active Indicator Top */}
                  {isActive && <div className="absolute top-0 w-8 h-1 bg-brand rounded-b-full shadow-[0_0_10px_var(--color-brand-glow)]"></div>}
                  
                  <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-brand/10 -translate-y-1' : ''}`}>
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={`${isActive ? 'animate-bounce-slight' : ''}`} />
                  </div>
                  <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
