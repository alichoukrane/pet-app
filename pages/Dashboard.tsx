
import React, { useState, useEffect } from 'react';
import { usePetContext } from '../context/PetContext';
import { isSameDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import ReminderItem from '../components/ReminderItem';
import SmartDashboard from '../components/SmartDashboard';
import { Plus, X, Calendar as CalendarIcon, Clock, Sparkles, Sun, Moon, CloudSun, Coffee } from 'lucide-react';
import { Reminder, ReminderType, Recurrence } from '../types';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { pets, reminders, addReminder, toggleReminder, removeReminder } = usePetContext();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  // Task Modal State
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [selectedPetId, setSelectedPetId] = useState('');
  const [taskType, setTaskType] = useState<ReminderType>('Other');
  const [taskDate, setTaskDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskTime, setTaskTime] = useState('09:00');
  const [taskRecurrence, setTaskRecurrence] = useState<Recurrence>('Once');

  // Dynamic Greeting State
  const [greetingKey, setGreetingKey] = useState('morning');
  const [GreetingIcon, setGreetingIcon] = useState<React.ElementType>(() => Sun);

  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      setGreetingKey('morning');
      setGreetingIcon(() => Coffee);
    } else if (hour >= 12 && hour < 17) {
      setGreetingKey('afternoon');
      setGreetingIcon(() => Sun);
    } else if (hour >= 17 && hour < 22) {
      setGreetingKey('evening');
      setGreetingIcon(() => CloudSun);
    } else {
      setGreetingKey('night');
      setGreetingIcon(() => Moon);
    }
  }, []);

  const todaysReminders = reminders.filter(r => isSameDay(new Date(r.dateTime), new Date()));
  const filteredReminders = todaysReminders.filter(r => {
    if (filter === 'pending') return !r.completed;
    if (filter === 'completed') return r.completed;
    return true;
  });

  filteredReminders.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPetId = selectedPetId || (pets.length > 0 ? pets[0].id : '');
    if (!finalPetId) return;

    const dateTime = new Date(`${taskDate}T${taskTime}`);
    const newReminder: Reminder = {
      id: Date.now().toString(),
      petId: finalPetId,
      title: taskTitle,
      type: taskType,
      dateTime: dateTime.toISOString(),
      recurrence: taskRecurrence,
      completed: false
    };

    addReminder(newReminder);
    setTaskModalOpen(false);
    resetTaskForm();
  };

  const resetTaskForm = () => {
    setTaskTitle('');
    setTaskType('Other');
    setTaskRecurrence('Once');
    setTaskDate(new Date().toISOString().split('T')[0]);
    setTaskTime('09:00');
  };

  const openTaskModal = () => {
    if (pets.length > 0 && !selectedPetId) setSelectedPetId(pets[0].id);
    setTaskModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="relative animate-fade-in-up">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-main drop-shadow-sm flex items-center gap-3 group cursor-default">
            <span className="text-gradient-premium text-glow-soft">
              {t(`dashboard.greeting.${greetingKey}`)}
            </span> 
            <GreetingIcon size={36} className="text-accent animate-bounce-slight" strokeWidth={2.5} />
          </h1>
          <p className="text-muted mt-2 text-lg font-medium leading-relaxed tracking-tight">
             {t('dashboard.subtitle')}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
             <button 
                onClick={openTaskModal}
                className="bg-brand hover:bg-brand-dim text-white px-5 py-3 rounded-2xl font-bold font-display tracking-wide shadow-lg shadow-brand/20 flex items-center gap-2 transition-all active:scale-95 border-b-2 border-brand-dim group"
             >
                <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" /> 
                <span className="text-sm">{t('dashboard.newTask')}</span>
             </button>
        </div>
      </div>

      <SmartDashboard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-main font-display tracking-tight heading-accent">{t('dashboard.schedule')}</h2>
                <div className="flex bg-surface rounded-xl p-1 gap-1 border border-border">
                    {['all', 'pending', 'completed'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                                filter === f 
                                ? 'bg-canvas text-brand shadow-sm border border-border' 
                                : 'text-muted hover:text-main'
                            }`}
                        >
                            {t(`filters.${f}`)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredReminders.length > 0 ? (
                    filteredReminders.map(reminder => (
                        <ReminderItem 
                            key={reminder.id} 
                            reminder={reminder} 
                            pet={pets.find(p => p.id === reminder.petId)}
                            onToggle={toggleReminder}
                            onDelete={removeReminder}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 bg-surface rounded-3xl border border-dashed border-border transition-colors">
                        <div className="bg-canvas p-4 rounded-full mb-4">
                            <CalendarIcon className="text-muted" size={28} />
                        </div>
                        <p className="text-muted font-medium text-base">{t('dashboard.noTasks')}</p>
                        <button onClick={openTaskModal} className="mt-2 text-brand font-bold text-sm hover:underline flex items-center gap-1">
                            <Plus size={16} /> {t('dashboard.addOne')}
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-main font-display tracking-tight">{t('dashboard.myPets')}</h2>
            </div>
            
            <div className="space-y-4">
                {pets.slice(0, 3).map(pet => (
                    <div key={pet.id} className="group flex items-center gap-4 p-3 bg-surface rounded-2xl border border-border hover:border-brand/30 transition-colors shadow-soft hover:shadow-lg cursor-pointer">
                         <img 
                            src={pet.photoUrl} 
                            alt={pet.name} 
                            className="w-12 h-12 rounded-xl object-cover bg-canvas ring-2 ring-transparent group-hover:ring-brand/30 transition-all"
                        />
                        <div>
                            <h4 className="font-bold text-main text-base font-display group-hover:text-brand transition-colors">{pet.name}</h4>
                            <p className="text-[10px] font-bold text-muted uppercase tracking-wider">{pet.breed}</p>
                        </div>
                    </div>
                ))}
                 <button onClick={() => window.location.hash = '#/pets'} className="w-full py-3 border-2 border-dashed border-border rounded-2xl text-muted font-semibold text-sm hover:border-brand hover:text-brand hover:bg-brand/5 transition-all flex items-center justify-center gap-2 group">
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> {t('dashboard.addNewPet')}
                 </button>
            </div>

            {/* AI Banner */}
            <div 
                className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-brand to-blue-600 text-white shadow-lg cursor-pointer group"
                onClick={() => window.location.hash = '#/assistant'}
            >
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={16} className="text-yellow-300" />
                        <span className="font-bold text-[10px] tracking-widest text-white/80 uppercase">{t('dashboard.aiBanner.tag')}</span>
                    </div>
                    <h3 className="font-bold text-xl mb-1 font-display tracking-tight">{t('dashboard.aiBanner.title')}</h3>
                    <p className="text-white/80 text-xs mb-4 font-medium leading-relaxed">{t('dashboard.aiBanner.subtitle')}</p>
                    <span className="inline-block bg-white/20 backdrop-blur-md rounded-lg px-3 py-1.5 text-[10px] font-bold group-hover:bg-white/30 transition-colors">{t('dashboard.aiBanner.button')} →</span>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
            </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface rounded-3xl w-full max-w-lg shadow-2xl border border-border overflow-hidden transform transition-all animate-fade-in-up">
            <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-canvas">
              <h2 className="text-lg font-bold text-main font-display tracking-tight">{t('taskModal.title')}</h2>
              <button onClick={() => setTaskModalOpen(false)} className="text-muted hover:text-main p-2 rounded-full hover:bg-surface transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddTask} className="p-6 space-y-6">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">{t('taskModal.what')}</label>
                <input 
                  required 
                  type="text" 
                  value={taskTitle} 
                  onChange={e => setTaskTitle(e.target.value)} 
                  className="w-full rounded-2xl border-border bg-canvas p-4 focus:ring-2 focus:ring-brand outline-none transition-all text-main placeholder-muted font-semibold border" 
                  placeholder={t('taskModal.placeholder')} 
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Pet Selection */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">{t('taskModal.who')}</label>
                    <select 
                      value={selectedPetId} 
                      onChange={e => setSelectedPetId(e.target.value)} 
                      className="w-full rounded-2xl border-border bg-canvas p-3.5 outline-none text-main focus:ring-2 focus:ring-brand appearance-none font-semibold border"
                    >
                        {pets.length === 0 && <option value="">No pets</option>}
                        {pets.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                {/* Type Selection */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">{t('taskModal.category')}</label>
                    <select 
                      value={taskType} 
                      onChange={e => setTaskType(e.target.value as ReminderType)} 
                      className="w-full rounded-2xl border-border bg-canvas p-3.5 outline-none text-main focus:ring-2 focus:ring-brand font-semibold border"
                    >
                         {Object.keys(t('categories', { returnObjects: true })).map((key) => (
                             <option key={key} value={key}>{t(`categories.${key}`)}</option>
                         ))}
                    </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div>
                     <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-1">
                        <CalendarIcon size={14} className="text-brand"/> {t('taskModal.date')}
                     </label>
                     <input 
                        required 
                        type="date" 
                        value={taskDate} 
                        onChange={e => setTaskDate(e.target.value)} 
                        className="w-full rounded-2xl border-border bg-canvas p-3.5 outline-none text-main focus:ring-2 focus:ring-brand font-semibold border" 
                    />
                </div>
                {/* Time */}
                <div>
                     <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-1">
                        <Clock size={14} className="text-brand"/> {t('taskModal.time')}
                     </label>
                     <input 
                        required 
                        type="time" 
                        value={taskTime} 
                        onChange={e => setTaskTime(e.target.value)} 
                        className="w-full rounded-2xl border-border bg-canvas p-3.5 outline-none text-main focus:ring-2 focus:ring-brand font-semibold border" 
                    />
                </div>
              </div>

              {/* Recurrence */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">{t('taskModal.repeat')}</label>
                <div className="grid grid-cols-4 gap-2">
                    {['Once', 'Daily', 'Weekly', 'Monthly'].map(opt => (
                        <button
                            type="button"
                            key={opt}
                            onClick={() => setTaskRecurrence(opt as Recurrence)}
                            className={`py-2.5 px-1 rounded-xl text-xs font-bold uppercase tracking-wide transition-all border ${
                                taskRecurrence === opt 
                                ? 'bg-brand text-white border-brand shadow-md shadow-brand/20' 
                                : 'bg-canvas text-muted hover:bg-surface border-border'
                            }`}
                        >
                            {t(`recurrence.${opt}`)}
                        </button>
                    ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 flex gap-3">
                 <button 
                    type="button" 
                    onClick={() => setTaskModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl font-bold text-muted hover:bg-canvas transition-colors border border-transparent hover:border-border"
                >
                    {t('taskModal.cancel')}
                </button>
                <button 
                    type="submit" 
                    disabled={pets.length === 0}
                    className="flex-[2] bg-brand hover:bg-brand-dim disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand/30 transition-all active:scale-95 flex justify-center items-center gap-2 border-b-4 border-brand-dim disabled:border-transparent font-display tracking-wide"
                >
                    <Plus size={18} strokeWidth={3} />
                    {pets.length === 0 ? t('taskModal.addPetFirst') : t('taskModal.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
