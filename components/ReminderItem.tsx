
import React from 'react';
import { Reminder, Pet } from '../types';
import { Check, Clock, RotateCw, Trash2 } from 'lucide-react';
import { format, isToday, isPast } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface ReminderItemProps {
  reminder: Reminder;
  pet?: Pet;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const ReminderItem: React.FC<ReminderItemProps> = ({ reminder, pet, onToggle, onDelete }) => {
  const { t } = useTranslation();
  const date = new Date(reminder.dateTime);
  const isOverdue = !reminder.completed && isPast(date) && !isToday(date);
  
  const typeColors: Record<string, string> = {
    Food: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400',
    Medication: 'text-coral-600 bg-coral-50 dark:bg-coral-900/20 dark:text-coral-400',
    Walk: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20 dark:text-teal-400',
    Vaccination: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
    Grooming: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400',
  };

  const badgeColor = typeColors[reminder.type] || 'text-muted bg-canvas';

  return (
    <div className={`group flex items-center gap-4 p-4 rounded-3xl border transition-all duration-300 ${
      reminder.completed 
        ? 'bg-canvas border-transparent opacity-60' 
        : 'bg-surface border-border shadow-soft hover:shadow-md'
    }`}>
      <button 
        onClick={() => onToggle(reminder.id)}
        className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          reminder.completed 
          ? 'bg-teal-500 text-white rotate-0' 
          : 'bg-canvas text-muted hover:bg-teal-100 hover:text-teal-600 dark:hover:bg-teal-900/50 dark:hover:text-teal-400 border border-border'
        }`}
        title={reminder.completed ? t('reminder.markIncomplete') : t('reminder.markComplete')}
      >
        <Check size={24} strokeWidth={3} className={`transition-transform duration-300 ${reminder.completed ? 'scale-100' : 'scale-0'}`} />
      </button>

      {/* Pet Avatar Display */}
      {pet && (
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl overflow-hidden border border-border bg-canvas">
           <img 
            src={pet.photoUrl || `https://ui-avatars.com/api/?name=${pet.name}&background=14b8a6&color=fff`} 
            alt={pet.name} 
            className="w-full h-full object-cover"
           />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-lg ${badgeColor}`}>
            {t(`categories.${reminder.type}`)}
          </span>
          {isOverdue && (
             <span className="text-[10px] uppercase tracking-wider font-bold text-coral-500 px-2 py-0.5 bg-coral-50 rounded-lg dark:bg-coral-900/20">{t('reminder.overdue')}</span>
          )}
        </div>
        <h4 className={`text-base font-bold leading-tight truncate transition-colors ${reminder.completed ? 'line-through text-muted' : 'text-main'}`}>
          {reminder.title}
        </h4>
        <div className="flex items-center gap-3 text-xs font-semibold text-muted mt-1">
            {pet && <span className="text-main font-bold hidden sm:inline">{pet.name}</span>}
            <span className="flex items-center gap-1"><Clock size={12}/> {format(date, 'h:mm a')}</span>
            {reminder.recurrence !== 'Once' && (
                <span className="flex items-center gap-1"><RotateCw size={12}/> {t(`recurrence.${reminder.recurrence}`)}</span>
            )}
        </div>
      </div>

      <button 
        onClick={() => onDelete(reminder.id)} 
        className="opacity-0 group-hover:opacity-100 p-2 text-muted hover:text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-900/20 rounded-xl transition-all"
        title={t('reminder.deleteTask')}
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default ReminderItem;
