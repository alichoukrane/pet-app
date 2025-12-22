
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Search, Filter, MapPin, QrCode, Copy, ShieldCheck } from 'lucide-react';
import { DEMO_TRAINERS } from '../data/trainers';
import TrainerCard from './TrainerCard';
import { Trainer } from '../types';

interface TrainerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const TrainerDrawer: React.FC<TrainerDrawerProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState(500);
  const [selectedQR, setSelectedQR] = useState<Trainer | null>(null);

  const filteredTrainers = useMemo(() => {
    return DEMO_TRAINERS.filter(t => 
      (t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       t.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      t.price <= priceFilter
    );
  }, [searchTerm, priceFilter]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full md:w-[450px] bg-canvas shadow-2xl transform transition-transform duration-300 ease-out border-l border-border flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-5 border-b border-border bg-surface flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold font-display text-main flex items-center gap-2">
              {t('trainer.title')} <span className="bg-brand/10 text-brand text-[10px] px-2 py-0.5 rounded-full">BETA</span>
            </h2>
            <p className="text-xs text-muted">{t('trainer.subtitle')}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-border bg-gray-50/50 dark:bg-gray-900/50 space-y-3 shrink-0">
           <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input 
                type="text" 
                placeholder={t('trainer.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface border border-border text-sm outline-none focus:ring-2 focus:ring-brand text-main placeholder-muted"
              />
           </div>
           
           <div className="flex items-center gap-4">
              <div className="flex-1">
                 <div className="flex justify-between text-[10px] font-bold text-muted uppercase mb-1.5">
                    <span>{t('trainer.maxPrice')}</span>
                    <span>¥{priceFilter}/hr</span>
                 </div>
                 <input 
                   type="range" 
                   min="100" 
                   max="500" 
                   step="10" 
                   value={priceFilter}
                   onChange={(e) => setPriceFilter(parseInt(e.target.value))}
                   className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand"
                 />
              </div>
              <button className="px-3 py-2 bg-surface border border-border rounded-xl text-xs font-bold text-muted hover:text-main flex items-center gap-1.5">
                 <Filter size={14} /> {t('trainer.more')}
              </button>
           </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-canvas">
           {filteredTrainers.length > 0 ? (
             filteredTrainers.map(trainer => (
               <TrainerCard key={trainer.id} trainer={trainer} onShowQR={setSelectedQR} />
             ))
           ) : (
             <div className="text-center py-10 text-muted text-sm">{t('trainer.noResults')}</div>
           )}
           
           <div className="text-center py-4">
              <p className="text-[10px] text-muted flex items-center justify-center gap-1">
                 <ShieldCheck size={12} /> {t('trainer.demoProfile')}
              </p>
           </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedQR && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
           <div className="bg-surface rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-border relative animate-fade-in-up">
              <button 
                onClick={() => setSelectedQR(null)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-muted"
              >
                <X size={20} />
              </button>

              <div className="text-center">
                 <div className="w-16 h-16 rounded-2xl mx-auto mb-3 overflow-hidden border-2 border-surface shadow-md">
                    <img src={selectedQR.avatarUrl} alt={selectedQR.name} className="w-full h-full object-cover" />
                 </div>
                 <h3 className="text-xl font-bold font-display text-main">{selectedQR.name}</h3>
                 <p className="text-sm text-muted mb-6">{t('trainer.scanWeChat')}</p>
                 
                 <div className="bg-white p-4 rounded-2xl inline-block shadow-inner border border-gray-100 mb-6 group cursor-pointer relative overflow-hidden">
                    <QrCode size={150} className="text-gray-900" />
                    <div className="absolute inset-0 bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white text-xs font-bold px-2 py-1 rounded shadow-sm text-gray-800">Demo QR</span>
                    </div>
                 </div>

                 <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex items-center justify-between border border-border">
                    <div className="text-left">
                       <div className="text-[10px] text-muted uppercase font-bold">Phone (Demo)</div>
                       <div className="text-sm font-mono font-bold text-main">{selectedQR.phone}</div>
                    </div>
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-brand transition-colors">
                       <Copy size={16} />
                    </button>
                 </div>
                 
                 <div className="mt-4 text-[10px] text-muted">
                    {t('trainer.demoContact')}
                 </div>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default TrainerDrawer;
