
import React from 'react';
import { Trainer } from '../types';
import { Star, MapPin, MessageCircle, CalendarCheck, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TrainerCardProps {
  trainer: Trainer;
  onShowQR: (trainer: Trainer) => void;
}

const TrainerCard: React.FC<TrainerCardProps> = ({ trainer, onShowQR }) => {
  const { t } = useTranslation();
  return (
    <div className="group bg-surface border border-border rounded-2xl p-4 shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
      
      {/* Promo Ribbon */}
      {trainer.isPromo && (
        <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-pulse">
          {t('trainer.promo')}
        </div>
      )}

      <div className="flex gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img 
            src={trainer.avatarUrl} 
            alt={trainer.name} 
            className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 object-cover border border-border"
          />
          <div className="absolute -bottom-1 -right-1 bg-surface rounded-full p-0.5 border border-border shadow-sm">
             <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
             <div>
                <h3 className="font-display font-bold text-lg text-main leading-tight group-hover:text-brand transition-colors">
                  {trainer.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-muted mt-0.5">
                   <MapPin size={10} />
                   <span>{trainer.location}</span>
                </div>
             </div>
             <div className="text-right">
                <div className="font-bold text-brand text-sm">¥{trainer.price}<span className="text-[10px] text-muted font-normal">{t('trainerCard.perHr')}</span></div>
             </div>
          </div>

          <div className="flex items-center gap-1 mt-2">
             <Star size={12} className="text-yellow-400 fill-yellow-400" />
             <span className="text-xs font-bold text-main">{trainer.rating}</span>
             <span className="text-[10px] text-muted">({trainer.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Specialties */}
      <div className="flex flex-wrap gap-1.5 mt-3 mb-3">
        {trainer.specialties.map(tag => (
          <span key={tag} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] font-medium text-muted border border-border">
            {tag}
          </span>
        ))}
      </div>

      {/* Availability Badge */}
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand bg-brand/5 px-2 py-1 rounded-lg mb-3 w-fit">
         <CalendarCheck size={12} />
         {trainer.availability} <span className="opacity-60 font-normal">| {t('trainerCard.available')}</span>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 mt-auto">
         <button 
           onClick={() => onShowQR(trainer)}
           className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-muted hover:bg-green-50 hover:text-green-600 hover:border-green-200 dark:hover:bg-green-900/20 dark:hover:text-green-400 transition-colors"
         >
            <MessageCircle size={14} /> {t('trainer.wechat')}
         </button>
         <button className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-brand text-white text-xs font-bold shadow-md shadow-brand/20 hover:bg-brand-dim active:scale-95 transition-all">
            <Zap size={14} /> {t('trainer.bookNow')}
         </button>
      </div>
    </div>
  );
};

export default TrainerCard;
