
export type Species = 'Dog' | 'Cat' | 'Bird' | 'Fish' | 'Rabbit' | 'Reptile' | 'Other';
export type Sex = 'Male' | 'Female' | 'Unknown';

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  sex: Sex;
  dob: string; // ISO date string
  weight: number; // kg
  microchipId?: string;
  notes?: string;
  photoUrl?: string;
  gallery?: string[];
}

export type ReminderType = 'Food' | 'Medication' | 'Vaccination' | 'Grooming' | 'Walk' | 'Vet' | 'Other';
export type Recurrence = 'Once' | 'Daily' | 'Weekly' | 'Monthly';

export interface Reminder {
  id: string;
  petId: string;
  title: string;
  type: ReminderType;
  dateTime: string; // ISO date time string
  recurrence: Recurrence;
  completed: boolean;
  notes?: string;
}

export interface CareLog {
  id: string;
  petId: string;
  reminderId?: string;
  type: ReminderType;
  date: string;
  notes?: string;
}

// iPhone-style premium sound names
export type SoundType = 'Reflection' | 'Radar' | 'Cosmic' | 'Circuit' | 'Silk' | 'Waves' | 'Aurora' | 'Classic';

// 12 Premium Studio Tones
export type PremiumSoundType = 
  | 'Daybreak' 
  | 'Velvet' 
  | 'Horizon' 
  | 'Drift' 
  | 'Orbit' 
  | 'Quantum' 
  | 'Amber' 
  | 'Hearth' 
  | 'Solar' 
  | 'Pulse' 
  | 'Signal' 
  | 'Echo';

export interface AlarmConfig {
  volume: number;
  soundType: SoundType | PremiumSoundType;
  isMuted: boolean;
  vibrationEnabled: boolean;
  // Advanced Settings
  fadeIn: boolean;
  snoozeDuration: number; // minutes
  autoSnooze: boolean;
  dndEnabled: boolean;
  dndStart: string; // "22:00"
  dndEnd: string; // "07:00"
}

export interface Trainer {
  id: string;
  name: string;
  avatarUrl: string;
  phone: string;
  wechatUrl: string; // Placeholder link
  price: number; // Hourly rate in CNY
  rating: number;
  reviewCount: number;
  specialties: string[];
  availability: string;
  isPromo?: boolean;
  location: string;
}
