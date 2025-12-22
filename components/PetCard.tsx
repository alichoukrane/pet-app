
import React from 'react';
import { Pet } from '../types';
import { differenceInYears, differenceInMonths } from 'date-fns';
import { Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PetCardProps {
  pet: Pet;
  onEdit?: (pet: Pet) => void;
  onDelete?: (id: string) => void;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const birthDate = new Date(pet.dob);
  const years = differenceInYears(new Date(), birthDate);
  const months = differenceInMonths(new Date(), birthDate) % 12;
  const ageDisplay = years > 0 ? `${years}y ${months}m` : `${months}m`;

  return (
    <div className="bg-surface rounded-3xl p-5 shadow-soft hover:shadow-lg transition-all border border-border flex flex-col md:flex-row gap-5 items-start md:items-center group relative overflow-hidden">
      <div className="relative shrink-0">
        <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-canvas shadow-sm transition-transform duration-300 group-hover:scale-105">
          <img 
            src={pet.photoUrl || `https://ui-avatars.com/api/?name=${pet.name}&background=14b8a6&color=fff`} 
            alt={pet.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-surface p-1.5 rounded-full shadow-md text-xl border border-border z-10 text-main">
          {pet.species === 'Dog' ? '🐶' : pet.species === 'Cat' ? '🐱' : '🐾'}
        </div>
      </div>
      
      <div className="flex-1 min-w-0 z-10">
        <h3 className="text-2xl font-bold font-display text-main truncate group-hover:text-brand transition-colors tracking-tight">{pet.name}</h3>
        <p className="text-xs font-bold text-muted mb-2 uppercase tracking-wider">{pet.breed} • {pet.sex}</p>
        
        <div className="flex gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-teal-500/10 text-teal-600 dark:text-teal-400">
              {ageDisplay} {t('petCard.old')}
            </span>
             <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-canvas text-muted border border-border">
              {pet.weight} {t('petCard.kg')}
            </span>
        </div>

        {/* Mini Gallery Preview */}
        {pet.gallery && pet.gallery.length > 0 && (
          <div className="absolute md:static md:mt-2 -bottom-2 left-24 md:left-auto flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out delay-75">
             <div className="text-[10px] font-bold text-muted uppercase tracking-widest flex items-center gap-1 md:hidden">
                <Camera size={10} /> {t('petCard.photos')}
             </div>
             <div className="flex -space-x-2">
               {pet.gallery.slice(0, 3).map((pic, idx) => (
                 <img 
                   key={idx}
                   src={pic}
                   alt="Gallery"
                   className="w-8 h-8 rounded-full border-2 border-surface object-cover shadow-sm"
                 />
               ))}
               {pet.gallery.length > 3 && (
                 <div className="w-8 h-8 rounded-full border-2 border-surface bg-canvas flex items-center justify-center text-[10px] font-bold text-muted">
                    +{pet.gallery.length - 3}
                 </div>
               )}
             </div>
          </div>
        )}
      </div>

      <div className="flex md:flex-col gap-2 w-full md:w-auto mt-2 md:mt-0 z-10 transition-opacity duration-300 md:group-hover:opacity-100 md:opacity-0">
         {onEdit && (
            <button onClick={() => onEdit(pet)} className="flex-1 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted bg-surface border border-border rounded-xl hover:bg-canvas transition-colors">
                {t('petCard.edit')}
            </button>
         )}
         {onDelete && (
             <button onClick={() => onDelete(pet.id)} className="flex-1 px-4 py-2 text-xs font-bold uppercase tracking-wider text-coral-500 bg-coral-50 dark:bg-coral-900/10 rounded-xl hover:bg-coral-100 dark:hover:bg-coral-900/30 transition-colors">
                {t('petCard.delete')}
             </button>
         )}
      </div>
    </div>
  );
};

export default PetCard;
