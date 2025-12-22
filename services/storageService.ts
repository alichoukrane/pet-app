
import { Pet, Reminder, CareLog } from '../types';

const STORAGE_KEYS = {
  PETS: 'petpal_pets',
  REMINDERS: 'petpal_reminders',
  LOGS: 'petpal_logs',
};

// Seed data for first run
const SEED_PETS: Pet[] = [
  {
    id: '1',
    name: 'Luna',
    species: 'Dog',
    breed: 'Golden Retriever',
    sex: 'Female',
    dob: '2021-05-15',
    weight: 24,
    notes: 'Loves peanut butter.',
    // Specific Golden Retriever image
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&h=400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=150&h=150&q=80',
      'https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=150&h=150&q=80',
      'https://images.unsplash.com/photo-1615751072497-5f5169febe17?auto=format&fit=crop&w=150&h=150&q=80'
    ]
  },
  {
    id: '2',
    name: 'Milo',
    species: 'Cat',
    breed: 'Tabby',
    sex: 'Male',
    dob: '2022-08-20',
    weight: 5,
    notes: 'Needs scratching post.',
    // Specific Tabby Cat image
    photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&h=400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=150&h=150&q=80',
      'https://images.unsplash.com/photo-1495360019602-e0019216adfe?auto=format&fit=crop&w=150&h=150&q=80',
      'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=150&h=150&q=80'
    ]
  }
];

const SEED_REMINDERS: Reminder[] = [
  {
    id: 'r1',
    petId: '1',
    title: 'Morning Walk',
    type: 'Walk',
    dateTime: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
    recurrence: 'Daily',
    completed: false
  },
  {
    id: 'r2',
    petId: '1',
    title: 'Heartworm Meds',
    type: 'Medication',
    dateTime: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    recurrence: 'Monthly',
    completed: false
  },
  {
    id: 'r3',
    petId: '2',
    title: 'Evening Feed',
    type: 'Food',
    dateTime: new Date(new Date().setHours(18, 0, 0, 0)).toISOString(),
    recurrence: 'Daily',
    completed: false
  }
];

export const StorageService = {
  getPets: (): Pet[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PETS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(SEED_PETS));
      return SEED_PETS;
    }
    return JSON.parse(data);
  },

  savePet: (pet: Pet): void => {
    const pets = StorageService.getPets();
    const index = pets.findIndex(p => p.id === pet.id);
    if (index >= 0) {
      pets[index] = pet;
    } else {
      pets.push(pet);
    }
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
  },

  deletePet: (id: string): void => {
    const pets = StorageService.getPets().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
    // Also cleanup reminders
    const reminders = StorageService.getReminders().filter(r => r.petId !== id);
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  },

  getReminders: (): Reminder[] => {
    const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(SEED_REMINDERS));
      return SEED_REMINDERS;
    }
    return JSON.parse(data);
  },

  saveReminder: (reminder: Reminder): void => {
    const reminders = StorageService.getReminders();
    const index = reminders.findIndex(r => r.id === reminder.id);
    if (index >= 0) {
      reminders[index] = reminder;
    } else {
      reminders.push(reminder);
    }
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  },

  deleteReminder: (id: string): void => {
    const reminders = StorageService.getReminders().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  },

  toggleReminderComplete: (id: string): Reminder | undefined => {
    const reminders = StorageService.getReminders();
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      reminder.completed = !reminder.completed;
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    }
    return reminder;
  }
};
