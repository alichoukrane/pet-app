
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Pet, Reminder, AlarmConfig } from '../types';
import { StorageService } from '../services/storageService';

interface PetContextType {
  pets: Pet[];
  reminders: Reminder[];
  alarmConfig: AlarmConfig;
  refreshData: () => void;
  addPet: (pet: Pet) => void;
  updatePet: (pet: Pet) => void;
  removePet: (id: string) => void;
  addReminder: (reminder: Reminder) => void;
  toggleReminder: (id: string) => void;
  removeReminder: (id: string) => void;
  updateAlarmConfig: (config: Partial<AlarmConfig>) => void;
  snoozeReminder: (id: string, minutes: number) => void;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [alarmConfig, setAlarmConfig] = useState<AlarmConfig>(() => {
    const saved = localStorage.getItem('petpal_alarm_config');
    return saved ? JSON.parse(saved) : { 
      volume: 0.5, 
      soundType: 'Reflection', 
      isMuted: false, 
      vibrationEnabled: true,
      fadeIn: true,
      snoozeDuration: 10,
      autoSnooze: false,
      dndEnabled: false,
      dndStart: "22:00",
      dndEnd: "07:00"
    };
  });

  const refreshData = () => {
    setPets(StorageService.getPets());
    setReminders(StorageService.getReminders());
  };

  useEffect(() => {
    refreshData();
    
    // Cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'petpal_reminders' || e.key === 'petpal_pets') {
        refreshData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('petpal_alarm_config', JSON.stringify(alarmConfig));
  }, [alarmConfig]);

  const addPet = (pet: Pet) => {
    StorageService.savePet(pet);
    refreshData();
  };

  const updatePet = (pet: Pet) => {
    StorageService.savePet(pet);
    refreshData();
  };

  const removePet = (id: string) => {
    StorageService.deletePet(id);
    refreshData();
  };

  const addReminder = (reminder: Reminder) => {
    StorageService.saveReminder(reminder);
    refreshData();
  };

  const toggleReminder = (id: string) => {
    StorageService.toggleReminderComplete(id);
    refreshData();
  };

  const removeReminder = (id: string) => {
    StorageService.deleteReminder(id);
    refreshData();
  };

  const snoozeReminder = (id: string, minutes: number) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
        const newTime = new Date(new Date().getTime() + minutes * 60000);
        const updatedReminder: Reminder = {
            ...reminder,
            dateTime: newTime.toISOString(),
            notes: (reminder.notes || '') + ' (Snoozed)',
        };
        StorageService.saveReminder(updatedReminder);
        refreshData();
    }
  };

  const updateAlarmConfig = (config: Partial<AlarmConfig>) => {
    setAlarmConfig(prev => ({ ...prev, ...config }));
  };

  return (
    <PetContext.Provider value={{ 
      pets, 
      reminders, 
      alarmConfig,
      refreshData, 
      addPet, 
      updatePet,
      removePet, 
      addReminder, 
      toggleReminder, 
      removeReminder, 
      updateAlarmConfig, 
      snoozeReminder
    }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePetContext = () => {
  const context = useContext(PetContext);
  if (!context) throw new Error("usePetContext must be used within PetProvider");
  return context;
};
    