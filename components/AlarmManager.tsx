
import React, { useEffect, useState, useRef } from 'react';
import { usePetContext } from '../context/PetContext';
import { Reminder } from '../types';
import { differenceInMinutes } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Bell, Volume2, VolumeX, Check, X, Clock, AlertTriangle, Smartphone } from 'lucide-react';
import { audioService } from '../services/audioService';
import { NotificationService } from '../services/notificationService';

const AlarmManager: React.FC = () => {
  const { t } = useTranslation();
  const { reminders, toggleReminder, snoozeReminder, alarmConfig, updateAlarmConfig } = usePetContext();
  const [activeAlarm, setActiveAlarm] = useState<Reminder | null>(null);
  const [showCriticalConfirm, setShowCriticalConfirm] = useState(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');
  const processedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Unlock Audio Context on first interaction
    const unlockAudio = () => {
      audioService.unlock();
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
    
    // Check Notification permissions
    setPermissionState(NotificationService.getPermissionState());
  }, []);

  // Check for alarms
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      
      // DND Check
      if (alarmConfig.dndEnabled) {
          const start = new Date();
          const [sh, sm] = alarmConfig.dndStart.split(':').map(Number);
          start.setHours(sh, sm, 0);

          const end = new Date();
          const [eh, em] = alarmConfig.dndEnd.split(':').map(Number);
          end.setHours(eh, em, 0);
          
          // Handle crossover midnight (e.g. 22:00 to 07:00)
          if (end < start) {
              if (now >= start || now < end) return; // In DND
          } else {
              if (now >= start && now < end) return; // In DND
          }
      }

      reminders.forEach(reminder => {
        if (reminder.completed) return;
        
        const alarmKey = `${reminder.id}-${reminder.dateTime}`;
        if (processedRef.current.has(alarmKey)) return;

        const reminderTime = new Date(reminder.dateTime);
        const diff = differenceInMinutes(now, reminderTime);

        // Trigger if time matches (within same minute) or is slightly past (up to 1 min)
        if (diff === 0 && !activeAlarm) {
           triggerAlarm(reminder, alarmKey);
        }
      });
    };

    const interval = setInterval(checkAlarms, 4000); 
    return () => clearInterval(interval);
  }, [reminders, activeAlarm, alarmConfig]);

  // Sync with other tabs
  useEffect(() => {
      if (activeAlarm) {
          const currentReminder = reminders.find(r => r.id === activeAlarm.id);
          if (!currentReminder || currentReminder.completed) {
              stopAlarm(false); // Close silently
          }
      }
  }, [reminders]);

  const triggerAlarm = (reminder: Reminder, key: string) => {
    setActiveAlarm(reminder);
    processedRef.current.add(key);
    
    // 1. Play Sound
    if (!alarmConfig.isMuted) {
      audioService.playAlarm(alarmConfig.soundType, alarmConfig.volume);
    }

    // 2. Vibrate (Mobile)
    if (alarmConfig.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate([500, 200, 500, 200, 1000]);
    }

    // 3. System Notification
    if (document.hidden) {
       NotificationService.showLocalNotification(
           `Reminder: ${reminder.title}`, 
           `It's time for ${reminder.title}. Click to open app.`
       );
    }
  };

  const stopAlarm = (userInitiated = true) => {
    audioService.stop();
    setActiveAlarm(null);
    setShowCriticalConfirm(false);
    if (navigator.vibrate) navigator.vibrate(0);
  };

  const handleSnooze = (minutes: number) => {
    if (activeAlarm) {
        snoozeReminder(activeAlarm.id, minutes);
        stopAlarm();
    }
  };

  const handleCompleteRequest = () => {
     if (activeAlarm?.type === 'Medication') {
         setShowCriticalConfirm(true);
     } else {
         confirmComplete();
     }
  };

  const confirmComplete = () => {
    if (activeAlarm) {
        toggleReminder(activeAlarm.id);
        stopAlarm();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    updateAlarmConfig({ volume: newVol });
    if (activeAlarm && !alarmConfig.isMuted) {
      audioService.playAlarm(alarmConfig.soundType, newVol);
    }
  };

  const toggleMute = () => {
    const newMutedState = !alarmConfig.isMuted;
    updateAlarmConfig({ isMuted: newMutedState });
    
    if (!newMutedState && activeAlarm) {
      audioService.playAlarm(alarmConfig.soundType, alarmConfig.volume);
    } else {
      audioService.stop();
    }
  };

  if (!activeAlarm) return null;

  const petImage = `https://ui-avatars.com/api/?name=${activeAlarm.petId}&background=0EA5A4&color=fff&size=128`;
  const isCritical = activeAlarm.type === 'Medication';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/90 backdrop-blur-xl animate-in fade-in duration-500 perspective-1000 font-sans">
        <div className="relative w-full max-w-md transform transition-all duration-500 hover:rotate-x-2 preserve-3d">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[80px] -z-10 animate-pulse-slow ${isCritical ? 'bg-red-500/30' : 'bg-teal-500/20'}`}></div>

            <div className={`bg-gray-800/90 backdrop-blur-md rounded-[2rem] border shadow-2xl overflow-hidden relative ${isCritical ? 'border-red-500/30' : 'border-white/10'}`}>
                
                <div className={`h-2 w-full bg-gradient-to-r shadow-[0_0_15px_rgba(14,165,164,0.6)] ${isCritical ? 'from-red-500 via-orange-500 to-red-500' : 'from-teal-400 via-purple-500 to-coral-500'}`}></div>

                {showCriticalConfirm ? (
                    <div className="p-8 text-center animate-fade-in-up">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} className="text-red-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{t('alarm.criticalTitle')}</h3>
                        <p className="text-gray-300 mb-6">{t('alarm.criticalBody')}</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowCriticalConfirm(false)} className="flex-1 py-3 bg-gray-700 text-white rounded-xl font-bold">{t('taskModal.cancel')}</button>
                            <button onClick={confirmComplete} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/30">{t('alarm.confirm')}</button>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 flex flex-col items-center text-center">
                        <div className="relative mb-6">
                            <div className={`absolute inset-0 rounded-full border-2 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] ${isCritical ? 'border-red-500/40' : 'border-teal-500/30'}`}></div>
                            <div className="w-24 h-24 rounded-full bg-gray-900 p-1.5 shadow-[0_0_30px_rgba(14,165,164,0.4)] border-2 border-white/10 relative z-10 animate-bounce-gentle">
                                <img src={petImage} alt="Pet" className="w-full h-full rounded-full object-cover" />
                            </div>
                        </div>

                        <div className="space-y-2 mb-6">
                            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold tracking-[0.2em] uppercase shadow-[0_0_10px_rgba(14,165,164,0.2)] ${isCritical ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-teal-500/10 border border-teal-500/30 text-teal-400'}`}>
                                {activeAlarm.type} {t('alarm.reminder')}
                            </span>
                            <h2 className="text-3xl font-black font-display tracking-tight text-white drop-shadow-md">
                                {activeAlarm.title}
                            </h2>
                            <div className="flex items-center justify-center gap-2 text-purple-300 font-display text-lg tracking-widest text-shadow-glow">
                                <Clock size={18} />
                                <span>{new Date(activeAlarm.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full mb-6">
                            <button 
                                onClick={handleCompleteRequest}
                                className={`col-span-2 text-white p-4 rounded-2xl font-bold font-display tracking-wide text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 border-t border-white/20 ${
                                    isCritical 
                                    ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 shadow-[0_4px_20px_rgba(239,68,68,0.4)]' 
                                    : 'bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 shadow-[0_4px_20px_rgba(14,165,164,0.4)]'
                                }`}
                            >
                                <Check size={24} strokeWidth={3} />
                                {t('alarm.markCompleted')}
                            </button>

                            <button 
                                onClick={() => handleSnooze(alarmConfig.snoozeDuration)}
                                className="bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white p-3 rounded-2xl font-semibold backdrop-blur-sm transition-colors flex flex-col items-center justify-center gap-1 border border-white/5"
                            >
                                <Clock size={20} className="opacity-70"/>
                                {t('alarm.snooze')} {alarmConfig.snoozeDuration}{t('alarm.minutes')}
                            </button>
                            
                            <button 
                                onClick={() => stopAlarm(true)}
                                className="bg-gray-700/50 hover:bg-coral-500/20 text-gray-300 hover:text-coral-400 p-3 rounded-2xl font-semibold backdrop-blur-sm transition-colors flex flex-col items-center justify-center gap-1 border border-white/5 hover:border-coral-500/30"
                            >
                                <X size={20} className="opacity-70"/>
                                {t('alarm.dismiss')}
                            </button>
                        </div>
                        
                        <div className="w-full flex items-center justify-between gap-4 pt-4 border-t border-white/5">
                            <div className="flex gap-2">
                                <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors">
                                    {alarmConfig.isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                </button>
                                <input 
                                    type="range" min="0" max="1" step="0.1" 
                                    value={alarmConfig.volume}
                                    onChange={handleVolumeChange}
                                    className="w-16 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        
        <style>{`
            .perspective-1000 { perspective: 1000px; }
            .preserve-3d { transform-style: preserve-3d; }
            .hover\\:rotate-x-2:hover { transform: rotateX(2deg) rotateY(2deg); }
            .text-shadow-glow { text-shadow: 0 0 10px rgba(167, 139, 250, 0.5); }
        `}</style>
    </div>
  );
};

export default AlarmManager;
