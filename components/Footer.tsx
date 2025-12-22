
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  QrCode, 
  X, 
  ChevronRight, 
  Globe,
  Instagram
} from 'lucide-react';
import Logo from './Logo';

// Custom Social Icons for realism
const SocialIcons = {
  TikTok: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  ),
  WeChat: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M8 12.55c3.55 0 6.63-2.52 6.63-5.63S11.55 1.29 8 1.29 1.37 3.81 1.37 6.92c0 1.8.96 3.4 2.45 4.43l-.6 2.14 2.53-1.42c.71.2 1.48.33 2.25.48zm10.37-2.6c-2.43 0-4.52 1.5-4.52 3.8 0 2.3 2.1 3.8 4.53 3.8.53 0 1.05-.08 1.54-.23l1.73.97-.4-1.46c1-1.03 1.63-2.3 1.63-3.66-.02-1.72-2.1-3.22-4.5-3.22z"/>
    </svg>
  ),
  Xiaohongshu: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19.5 4a2 2 0 0 0-2-2h-11a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V4zm-3 9s-1.5 1-3 1-3-1-3-1 1.5-3 3-3 3 3 3 3zm-3-5a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
    </svg>
  ),
  Bilibili: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18.7 6.2c.4 0 .7.3.7.6v9.4c0 .4-.3.7-.7.7H5.3c-.4 0-.7-.3-.7-.7V6.8c0-.4.3-.7.7-.7h13.4zM8 2h2l1 2h2l1-2h2c2.2 0 4 1.8 4 4v10c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4V6c0-2.2 1.8-4 4-4zm2 10.5c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5zm6 0c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5z"/>
    </svg>
  )
};

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [isWeChatOpen, setIsWeChatOpen] = useState(false);

  const links = {
    company: [
      { label: t('footer.links.about'), href: '#' },
      { label: t('footer.links.careers'), href: '#' },
      { label: t('footer.links.partners'), href: '#' },
      { label: t('footer.links.services'), href: '#' },
    ],
    support: [
      { label: t('footer.links.help'), href: '#' },
      { label: t('footer.links.contact'), href: '#' },
      { label: t('footer.links.safety'), href: '#' },
      { label: t('footer.links.report'), href: '#' },
    ],
    legal: [
      { label: t('footer.links.privacy'), href: '#' },
      { label: t('footer.links.terms'), href: '#' },
      { label: t('footer.links.cookies'), href: '#' },
      { label: t('footer.links.compliance'), href: '#' },
    ]
  };

  return (
    <footer className="relative mt-auto bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-brand to-accent opacity-60"></div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Identity */}
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
               <Logo />
               <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider w-fit rounded-full border border-green-200 dark:border-green-800">
                  <ShieldCheck size={14} /> {t('footer.verified')}
               </div>
            </div>
            
            <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
               <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="mt-1 text-brand shrink-0" />
                  <p className="leading-relaxed">
                    {t('footer.address')}
                  </p>
               </div>
               <div className="flex items-center gap-2.5">
                  <Clock size={16} className="text-brand shrink-0" />
                  <p>{t('footer.hours')}</p>
               </div>
               <div className="flex items-center gap-2.5 group cursor-pointer">
                  <Phone size={16} className="text-brand shrink-0" />
                  <p className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">+86 137-5623-8801</p>
               </div>
               <div className="flex items-center gap-2.5 group cursor-pointer">
                  <Mail size={16} className="text-brand shrink-0" />
                  <p className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">support@petpaltech.com</p>
               </div>
            </div>

            {/* Social Row */}
            <div className="flex gap-2">
                <button 
                  onClick={() => setIsWeChatOpen(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-green-500 text-white hover:bg-green-600 hover:scale-110 transition-all shadow-sm"
                  title="WeChat"
                >
                    <SocialIcons.WeChat />
                </button>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-xl bg-pink-500 text-white hover:bg-pink-600 hover:scale-110 transition-all shadow-sm">
                    <Instagram size={20} />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-xl bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600 hover:scale-110 transition-all shadow-sm">
                    <SocialIcons.TikTok />
                </a>
                <a href="https://xiaohongshu.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500 text-white hover:bg-red-600 hover:scale-110 transition-all shadow-sm">
                    <SocialIcons.Xiaohongshu />
                </a>
                <a href="https://bilibili.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-400 text-white hover:bg-blue-500 hover:scale-110 transition-all shadow-sm">
                    <SocialIcons.Bilibili />
                </a>
            </div>
          </div>

          {/* Column 2: Company */}
          <div>
            <h3 className="font-display font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                {t('footer.company')}
            </h3>
            <ul className="space-y-3">
               {links.company.map((link) => (
                 <li key={link.label}>
                    <a href={link.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand flex items-center gap-1 group transition-colors">
                        <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                        {link.label}
                    </a>
                 </li>
               ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="font-display font-bold text-gray-900 dark:text-white mb-6">
                {t('footer.support')}
            </h3>
            <ul className="space-y-3">
               {links.support.map((link) => (
                 <li key={link.label}>
                    <a href={link.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand flex items-center gap-1 group transition-colors">
                        <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                        {link.label}
                    </a>
                 </li>
               ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="font-display font-bold text-gray-900 dark:text-white mb-6">
                {t('footer.legal')}
            </h3>
            <ul className="space-y-3">
               {links.legal.map((link) => (
                 <li key={link.label}>
                    <a href={link.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-brand flex items-center gap-1 group transition-colors">
                        <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                        {link.label}
                    </a>
                 </li>
               ))}
            </ul>
            
            <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                    <Globe size={16} className="text-brand" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{t('footer.language')}</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-tight">
                    {t('footer.region')}
                </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
             <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-center md:text-left">
                <p>{t('footer.copyright')}</p>
                <div className="hidden md:block w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                <p className="font-mono hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors">{t('footer.icp')}</p>
             </div>
             <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <ShieldCheck size={12} className="text-brand" />
                <span>{t('footer.security')}</span>
             </div>
        </div>
      </div>

      {/* WeChat Modal */}
      {isWeChatOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
             <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative animate-fade-in-up border border-gray-100 dark:border-gray-700">
                <button 
                  onClick={() => setIsWeChatOpen(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 transition-colors"
                >
                    <X size={20} />
                </button>
                
                <div className="text-center pt-2">
                   <div className="w-16 h-16 rounded-2xl bg-green-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                       <SocialIcons.WeChat />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{t('footer.wechatModal.title')}</h3>
                   <p className="text-sm text-gray-500 mb-6">{t('footer.wechatModal.subtitle')}</p>

                   <div className="bg-white p-4 rounded-2xl inline-block shadow-inner border border-gray-100 mb-6 relative group overflow-hidden">
                        <QrCode size={180} className="text-gray-900" />
                        {/* Logo overlay in QR center */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-md">
                           <Logo variant="icon" className="scale-75" />
                        </div>
                   </div>

                   <p className="text-xs text-gray-400">
                      {t('footer.wechatModal.scan')}
                   </p>
                </div>
             </div>
          </div>
      )}
    </footer>
  );
};

export default Footer;
