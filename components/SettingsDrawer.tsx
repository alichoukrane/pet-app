
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { usePetContext } from '../context/PetContext';
import { useTheme } from '../context/ThemeContext';
import { audioService } from '../services/audioService';
import { NotificationService } from '../services/notificationService';
import { StorageService } from '../services/storageService';
import { 
  X, User, Shield, Bell, Smartphone, Moon, Sun, Monitor, 
  Palette, Globe, Lock, Download, Trash2, Beaker, 
  Volume2, Play, Music, Check, Camera, Upload, MapPin, 
  RefreshCw, Mail, FileText, CreditCard, Users, 
  AlertTriangle, Zap, ChevronRight, Plus, LogOut, CheckCircle, Image as ImageIcon,
  Database, Eye, File, AlertCircle
} from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PetDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string;
  uploadedAt: string;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { alarmConfig, updateAlarmConfig } = usePetContext();
  const { theme, setTheme } = useTheme();
  
  // Local State for settings
  const [activeTab, setActiveTab] = useState('account');
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [fontSize, setFontSize] = useState('100%');
  const [accentColor, setAccentColor] = useState('#0EA5A4');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // --- Account State ---
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem('petpal_profile') || '{}') || {
    firstName: 'Demo', lastName: 'User', email: 'user@example.com', phone: '+1 555 0123', 
    country: 'United States', timezone: 'UTC-5', address: '123 Pet Lane, San Francisco, CA', 
    emergencyContact: 'Dr. Smith (Vet) - 555-9999', photoUrl: '', language: 'en'
  });

  // --- Documents State ---
  const [documents, setDocuments] = useState<PetDocument[]>(() => {
    try {
        const saved = localStorage.getItem('petpal_documents');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Failed to load documents", e);
        return [];
    }
  });
  const [viewingDoc, setViewingDoc] = useState<PetDocument | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [devices, setDevices] = useState([
    { id: 1, name: 'iPhone 15 Pro', location: 'Hangzhou, China', lastActive: 'Now', current: true, icon: Smartphone },
    { id: 2, name: 'MacBook Air', location: 'Hangzhou, China', lastActive: '2 days ago', current: false, icon: Monitor }
  ]);

  const [family, setFamily] = useState([
    { id: 1, name: 'Mohamed Idaissa', email: 'midaissa3@gmail.com', role: 'Admin', photo: 'https://ui-avatars.com/api/?name=Mohamed+Idaissa&background=FF5947&color=fff' }
  ]);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const [security, setSecurity] = useState({
    lastPasswordChange: '2023-10-15',
    loginAlerts: true,
    recoveryCodes: true,
    twoFactor: false
  });

  const [comms, setComms] = useState({
    emailNotify: true,
    pushNotify: true,
    weeklyReport: true,
    aiTone: 'Friendly'
  });

  const [beta, setBeta] = useState({
    newDash: false,
    smartHealth: true,
    expReminders: false
  });
  
  // Load settings
  useEffect(() => {
    const savedSize = localStorage.getItem('petpal_fontsize') || '100%';
    const savedAccent = localStorage.getItem('petpal_accent') || '#0EA5A4';
    setFontSize(savedSize);
    setAccentColor(savedAccent);
    document.documentElement.style.fontSize = savedSize;
    document.documentElement.style.setProperty('--color-brand', savedAccent);
  }, []);

  // Save profile changes
  useEffect(() => {
    localStorage.setItem('petpal_profile', JSON.stringify(profile));
  }, [profile]);

  // Save documents changes
  useEffect(() => {
    try {
        localStorage.setItem('petpal_documents', JSON.stringify(documents));
    } catch (e) {
        console.error("Storage quota exceeded", e);
        alert("Storage full! Please delete some documents before adding more.");
    }
  }, [documents]);

  const handleProfileChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleLanguageChange = (lang: string) => {
      i18n.changeLanguage(lang);
      setProfile(prev => ({ ...prev, language: lang }));
      localStorage.setItem('petpal_language', lang);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert("File is too large. Please select an image under 5MB.");
            return;
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfile(prev => ({ ...prev, photoUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
    }
  };

  const generateRandomAvatar = () => {
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    const newUrl = `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=${randomColor}&color=fff&size=200`;
    setProfile(prev => ({ ...prev, photoUrl: newUrl }));
  };

  const handleRemoveDevice = (id: number) => {
    setDevices(prev => prev.filter(d => d.id !== id));
  };

  const handleAddFamily = () => {
    if(!newMemberEmail) return;
    const name = newMemberEmail.split('@')[0];
    setFamily(prev => [...prev, {
        id: Date.now(),
        name: name,
        email: newMemberEmail,
        role: 'View',
        photo: `https://ui-avatars.com/api/?name=${name}&background=random`
    }]);
    setNewMemberEmail('');
  };

  // --- Document Logic ---
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const processDocFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
        // 2MB limit per doc to be safe with localStorage
        if (file.size > 2 * 1024 * 1024) {
            alert(`File ${file.name} is too large (max 2MB).`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setDocuments(prev => [...prev, {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: file.name,
                type: file.type,
                size: file.size,
                uploadedAt: new Date().toISOString(),
                data: result
            }]);
        };
        reader.readAsDataURL(file);
    });
  };

  const handleDocDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processDocFiles(e.dataTransfer.files);
  };

  const confirmDeleteDocument = () => {
    if (documentToDelete) {
        setDocuments(prev => prev.filter(d => d.id !== documentToDelete));
        setDocumentToDelete(null);
    }
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    localStorage.setItem('petpal_fontsize', size);
    document.documentElement.style.fontSize = size;
  };

  const handleAccentChange = (color: string) => {
    setAccentColor(color);
    localStorage.setItem('petpal_accent', color);
    document.documentElement.style.setProperty('--color-brand', color);
  };

  const handleTestSound = () => {
    if (isPlayingTest) {
      audioService.stop();
      setIsPlayingTest(false);
    } else {
      setIsPlayingTest(true);
      audioService.playAlarm(alarmConfig.soundType, alarmConfig.volume);
      if (alarmConfig.vibrationEnabled && navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
      }
      setTimeout(() => {
        audioService.stop();
        setIsPlayingTest(false);
      }, 4000);
    }
  };

  const exportData = () => {
    const data = {
        pets: StorageService.getPets(),
        reminders: StorageService.getReminders(),
        config: alarmConfig,
        profile: profile,
        documents: documents,
        exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `petpal-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  };

  const clearData = () => {
      if(confirm(t('settings.data.confirmClear'))) {
          localStorage.clear();
          window.location.reload();
      }
  };

  const tabs = [
      { id: 'account', label: t('settings.tabs.account'), icon: User },
      { id: 'alarm', label: t('settings.tabs.alarm'), icon: Bell },
      { id: 'appearance', label: t('settings.tabs.appearance'), icon: Palette },
      { id: 'language', label: t('settings.tabs.language'), icon: Globe },
      { id: 'data', label: t('settings.tabs.data'), icon: Database },
      { id: 'labs', label: t('settings.tabs.labs'), icon: Beaker },
  ];

  const sounds = ['Reflection', 'Radar', 'Cosmic', 'Circuit', 'Silk', 'Waves', 'Aurora', 'Classic'];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={`fixed inset-y-0 right-0 z-[70] w-full md:w-[600px] bg-canvas shadow-2xl transform transition-transform duration-300 ease-out border-l border-border flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-5 border-b border-border bg-surface flex justify-between items-center shrink-0">
          <h2 className="text-2xl font-bold font-display text-main">{t('settings.title')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-muted transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Tabs (Desktop) */}
            <div className="hidden md:flex flex-col w-20 md:w-48 border-r border-border bg-gray-50/50 dark:bg-gray-900/50 p-2 space-y-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-2 md:px-4 py-3 rounded-xl text-[10px] md:text-sm font-bold transition-all ${
                            activeTab === tab.id 
                            ? 'bg-brand text-white shadow-md shadow-brand/20' 
                            : 'text-muted hover:bg-surface hover:text-main'
                        }`}
                    >
                        <tab.icon size={20} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Mobile Tab Bar */}
            <div className="md:hidden flex overflow-x-auto border-b border-border bg-surface p-2 space-x-2 shrink-0 no-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'bg-brand text-white' 
                            : 'bg-gray-100 dark:bg-gray-800 text-muted'
                        }`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-canvas scroll-smooth">
                
                {/* === ACCOUNT TAB === */}
                {activeTab === 'account' && (
                    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto pb-10">
                        
                        {/* 1. Extended Profile Header */}
                        <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-brand to-accent opacity-10"></div>
                             <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 pt-4">
                                 <div className="relative group">
                                     <div className="w-24 h-24 rounded-full border-4 border-surface shadow-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                        <img 
                                          src={profile.photoUrl || `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=0EA5A4&color=fff`} 
                                          alt="Profile" 
                                          className="w-full h-full object-cover"
                                        />
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={handleFileChange} 
                                            accept="image/*" 
                                            className="hidden" 
                                        />
                                     </div>
                                     <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 bg-brand text-white p-2 rounded-full shadow-lg hover:bg-brand-dim transition-colors"
                                        title="Upload Photo"
                                      >
                                         <Camera size={14} />
                                     </button>
                                 </div>
                                 <div className="flex-1 text-center md:text-left mb-2">
                                     <h3 className="text-2xl font-bold text-main">{profile.firstName} {profile.lastName}</h3>
                                     <p className="text-muted text-sm mb-2">{profile.email}</p>
                                     <div className="flex items-center justify-center md:justify-start gap-2">
                                         <span className="px-2 py-0.5 rounded-md bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-wider border border-brand/20">Pro Member</span>
                                         <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-muted text-[10px] font-bold border border-border flex items-center gap-1"><MapPin size={8} /> {profile.country}</span>
                                     </div>
                                 </div>
                                 <div className="flex gap-2">
                                     <button onClick={generateRandomAvatar} className="p-2 text-muted hover:text-main bg-canvas rounded-xl border border-border" title="Auto-Generate Avatar"><RefreshCw size={18} /></button>
                                     <button onClick={() => setProfile(p => ({...p, photoUrl: ''}))} className="p-2 text-red-400 hover:text-red-500 bg-canvas rounded-xl border border-border" title="Remove Photo"><Trash2 size={18} /></button>
                                 </div>
                             </div>
                        </div>

                        {/* 2. Personal Information Form */}
                        <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
                            <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                                <User size={14} /> Personal Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-main">First Name</label>
                                    <input type="text" value={profile.firstName} onChange={e => handleProfileChange('firstName', e.target.value)} className="w-full bg-canvas border border-border rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-brand outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-main">Last Name</label>
                                    <input type="text" value={profile.lastName} onChange={e => handleProfileChange('lastName', e.target.value)} className="w-full bg-canvas border border-border rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-brand outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-main">Email</label>
                                    <input type="email" value={profile.email} onChange={e => handleProfileChange('email', e.target.value)} className="w-full bg-canvas border border-border rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-brand outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-main">Phone</label>
                                    <input type="tel" value={profile.phone} onChange={e => handleProfileChange('phone', e.target.value)} className="w-full bg-canvas border border-border rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-brand outline-none" />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs font-bold text-main">Address</label>
                                    <input type="text" value={profile.address} onChange={e => handleProfileChange('address', e.target.value)} className="w-full bg-canvas border border-border rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-brand outline-none" />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs font-bold text-main text-red-500 flex items-center gap-1"><AlertTriangle size={10} /> Emergency Contact (Vet/Partner)</label>
                                    <input type="text" value={profile.emergencyContact} onChange={e => handleProfileChange('emergencyContact', e.target.value)} className="w-full bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-2.5 text-sm font-medium focus:ring-2 focus:ring-red-500 outline-none text-red-800 dark:text-red-300" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-main">Timezone</label>
                                    <select value={profile.timezone} onChange={e => handleProfileChange('timezone', e.target.value)} className="w-full bg-canvas border border-border rounded-xl p-2.5 text-sm font-medium outline-none">
                                        <option value="UTC-8">Pacific Time (US)</option>
                                        <option value="UTC-5">Eastern Time (US)</option>
                                        <option value="UTC+0">GMT (London)</option>
                                        <option value="UTC+8">China Standard Time</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 3. Security & Devices */}
                        <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
                             <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Shield size={14} /> Security & Login
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b border-border">
                                    <div>
                                        <div className="text-sm font-bold text-main">Password</div>
                                        <div className="text-xs text-muted">Last changed {security.lastPasswordChange}</div>
                                    </div>
                                    <button className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-bold text-main hover:bg-gray-200 dark:hover:bg-gray-700">Update</button>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-border">
                                    <div>
                                        <div className="text-sm font-bold text-main">Two-Factor Authentication</div>
                                        <div className="text-xs text-muted">Add an extra layer of security</div>
                                    </div>
                                    <button 
                                        onClick={() => setSecurity(s => ({...s, twoFactor: !s.twoFactor}))}
                                        className={`w-10 h-5 rounded-full relative transition-colors ${security.twoFactor ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-600'}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${security.twoFactor ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                     <div className="text-sm font-bold text-main flex items-center gap-2"><Lock size={14}/> Recovery Codes</div>
                                     <button className="text-brand text-xs font-bold hover:underline">Download</button>
                                </div>
                                
                                {/* Device List */}
                                <div className="bg-canvas rounded-xl p-4 mt-2">
                                    <h5 className="text-xs font-bold text-muted uppercase mb-3">Active Devices</h5>
                                    <div className="space-y-3">
                                        {devices.map(dev => (
                                            <div key={dev.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-muted">
                                                        <dev.icon size={14} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-main flex items-center gap-2">
                                                            {dev.name} {dev.current && <span className="text-[10px] text-green-500 bg-green-100 dark:bg-green-900/30 px-1.5 rounded">Current</span>}
                                                        </div>
                                                        <div className="text-[10px] text-muted">{dev.location} • {dev.lastActive}</div>
                                                    </div>
                                                </div>
                                                {!dev.current && (
                                                    <button onClick={() => handleRemoveDevice(dev.id)} className="text-xs font-bold text-red-400 hover:text-red-500">Log Out</button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-4 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 py-2 rounded-lg border border-transparent hover:border-red-100 transition-colors">
                                        Log Out All Other Devices
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 4. Family & Caretakers */}
                        <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
                             <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Users size={14} /> Family Sharing
                            </h4>
                            <div className="space-y-4">
                                {family.map(member => (
                                    <div key={member.id} className="flex items-center justify-between p-3 bg-canvas rounded-xl border border-border">
                                        <div className="flex items-center gap-3">
                                            <img src={member.photo} alt={member.name} className="w-8 h-8 rounded-full" />
                                            <div>
                                                <div className="text-sm font-bold text-main">{member.name}</div>
                                                <div className="text-[10px] text-muted">{member.email} • <span className="text-brand">{member.role}</span></div>
                                            </div>
                                        </div>
                                        {member.role !== 'Admin' && <button className="text-muted hover:text-red-500"><X size={16} /></button>}
                                    </div>
                                ))}
                                
                                <div className="flex gap-2">
                                    <input 
                                        type="email" 
                                        placeholder="Enter email to invite..." 
                                        value={newMemberEmail}
                                        onChange={e => setNewMemberEmail(e.target.value)}
                                        className="flex-1 bg-canvas border border-border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
                                    />
                                    <button onClick={handleAddFamily} disabled={!newMemberEmail} className="bg-brand text-white px-4 rounded-xl font-bold text-sm hover:bg-brand-dim disabled:opacity-50">Invite</button>
                                </div>
                            </div>
                        </div>

                        {/* 5. Documents */}
                        <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
                            <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                                <FileText size={14} /> Pet Documents
                            </h4>
                            
                            {/* Upload Area */}
                            <div 
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDocDrop}
                                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer group ${isDragging ? 'border-brand bg-brand/5' : 'border-border hover:bg-canvas hover:border-brand/50'}`}
                            >
                                <input 
                                    type="file" 
                                    multiple 
                                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                                    onChange={(e) => processDocFiles(e.target.files)}
                                    className="hidden" 
                                    id="doc-upload"
                                />
                                <label htmlFor="doc-upload" className="cursor-pointer block w-full h-full">
                                    <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center transition-colors ${isDragging ? 'bg-brand text-white' : 'bg-gray-100 dark:bg-gray-800 text-muted group-hover:text-brand'}`}>
                                        <Upload size={20} />
                                    </div>
                                    <p className="text-sm font-bold text-main">Click or Drag to Upload</p>
                                    <p className="text-xs text-muted mt-1">PDF, JPG, PNG (Max 2MB)</p>
                                </label>
                            </div>

                            {/* Document List */}
                            {documents.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {documents.map(doc => (
                                        <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl bg-canvas border border-border group hover:border-brand/30 transition-colors animate-fade-in">
                                            {/* Icon/Thumbnail */}
                                            <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center overflow-hidden shrink-0">
                                                {doc.type.includes('image') ? (
                                                    <img src={doc.data} alt="thumb" className="w-full h-full object-cover" />
                                                ) : (
                                                    <FileText size={20} className="text-red-500" />
                                                )}
                                            </div>
                                            
                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-bold text-main truncate" title={doc.name}>{doc.name}</div>
                                                <div className="text-[10px] text-muted flex items-center gap-2">
                                                    <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{formatBytes(doc.size)}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-1">
                                                <button 
                                                    onClick={() => setViewingDoc(doc)} 
                                                    className="p-2 text-muted hover:text-brand hover:bg-surface rounded-lg transition-colors"
                                                    title="View Document"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button 
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setDocumentToDelete(doc.id);
                                                    }}
                                                    className="p-2 text-muted hover:text-coral-500 hover:bg-coral-50 dark:hover:bg-coral-900/20 rounded-lg transition-colors"
                                                    title="Delete Document"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 6. Communication Prefs */}
                        <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
                             <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Mail size={14} /> Communication
                            </h4>
                            <div className="space-y-3">
                                {[
                                    { label: 'Email Notifications', key: 'emailNotify' },
                                    { label: 'Push Notifications', key: 'pushNotify' },
                                    { label: 'Weekly Health Summary', key: 'weeklyReport' },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-main">{item.label}</span>
                                        <button 
                                            // @ts-ignore
                                            onClick={() => setComms(c => ({...c, [item.key]: !c[item.key]}))}
                                            // @ts-ignore
                                            className={`w-10 h-5 rounded-full relative transition-colors ${comms[item.key] ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-600'}`}
                                        >
                                            {/* @ts-ignore */}
                                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${comms[item.key] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                        </button>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-sm font-medium text-main">AI Assistant Tone</span>
                                    <select value={comms.aiTone} onChange={(e) => setComms(c => ({...c, aiTone: e.target.value}))} className="bg-canvas border border-border rounded-lg text-xs font-bold p-1">
                                        <option>Friendly</option>
                                        <option>Professional</option>
                                        <option>Funny</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                         {/* 7. Subscription & Billing */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                             <div className="relative z-10 flex justify-between items-start mb-6">
                                 <div>
                                     <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                                        <CreditCard size={14} /> Current Plan
                                     </h4>
                                     <div className="text-3xl font-display font-black text-white">PRO</div>
                                     <p className="text-xs text-gray-400">Next billing date: Oct 24, 2025</p>
                                 </div>
                                 <div className="bg-brand text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg shadow-brand/20">ACTIVE</div>
                             </div>
                             
                             <div className="space-y-2 mb-6">
                                 <div className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle size={14} className="text-brand"/> Unlimited Pets</div>
                                 <div className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle size={14} className="text-brand"/> AI Health Analysis</div>
                                 <div className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle size={14} className="text-brand"/> Family Sharing</div>
                             </div>

                             <div className="flex gap-3">
                                 <button className="flex-1 bg-white text-gray-900 py-2 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">Upgrade Plan</button>
                                 <button className="flex-1 bg-gray-700 text-white py-2 rounded-xl font-bold text-sm hover:bg-gray-600 transition-colors">Billing History</button>
                             </div>
                        </div>

                         {/* Footer Info */}
                         <div className="text-center text-[10px] text-muted space-y-1">
                             <p>PetPal v2.4.0 (Build 2025.10)</p>
                             <p>Made with ❤️ for pets everywhere.</p>
                         </div>
                    </div>
                )}

                {/* ALARM & REMINDERS (Preserved functionality) */}
                {activeTab === 'alarm' && (
                    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
                         <div className="bg-surface p-6 rounded-3xl border border-border shadow-sm space-y-6">
                            <div>
                                <label className="text-xs font-bold text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Music size={14} /> {t('alarm.sound')}
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {sounds.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => updateAlarmConfig({ soundType: s as any })}
                                            className={`px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-all border ${
                                                alarmConfig.soundType === s
                                                ? 'bg-brand text-white border-brand shadow-md'
                                                : 'bg-canvas text-muted border-border hover:border-brand/50'
                                            }`}
                                        >
                                            {s}
                                            {alarmConfig.soundType === s && <Check size={12} />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                                            <Volume2 size={14} /> {t('alarm.volume')}
                                        </label>
                                        <span className="text-xs font-bold text-brand">{Math.round(alarmConfig.volume * 100)}%</span>
                                    </div>
                                    <input 
                                        type="range" min="0" max="1" step="0.1" 
                                        value={alarmConfig.volume}
                                        onChange={(e) => updateAlarmConfig({ volume: parseFloat(e.target.value) })}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand"
                                    />
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-main">{t('settings.alarm.fadeIn')}</span>
                                    <button 
                                        onClick={() => updateAlarmConfig({ fadeIn: !alarmConfig.fadeIn })}
                                        className={`w-12 h-6 rounded-full relative transition-colors ${alarmConfig.fadeIn ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-600'}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${alarmConfig.fadeIn ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-main">{t('settings.alarm.vibration')}</span>
                                    <button 
                                        onClick={() => updateAlarmConfig({ vibrationEnabled: !alarmConfig.vibrationEnabled })}
                                        className={`w-12 h-6 rounded-full relative transition-colors ${alarmConfig.vibrationEnabled ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-600'}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${alarmConfig.vibrationEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleTestSound}
                                className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-main font-bold text-sm hover:bg-brand hover:text-white transition-colors flex items-center justify-center gap-2"
                            >
                                {isPlayingTest ? <X size={16}/> : <Play size={16}/>}
                                {isPlayingTest ? t('alarm.stop') : t('alarm.testSound')}
                            </button>
                         </div>

                         {/* DND */}
                         <div className="bg-surface p-6 rounded-3xl border border-border shadow-sm space-y-4">
                             <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                     <Moon size={18} className="text-brand" />
                                     <span className="font-bold text-main">{t('settings.alarm.dnd')}</span>
                                 </div>
                                 <button 
                                    onClick={() => updateAlarmConfig({ dndEnabled: !alarmConfig.dndEnabled })}
                                    className={`w-12 h-6 rounded-full relative transition-colors ${alarmConfig.dndEnabled ? 'bg-brand' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${alarmConfig.dndEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                             </div>
                             {alarmConfig.dndEnabled && (
                                 <div className="grid grid-cols-2 gap-4 pt-2">
                                     <div>
                                         <label className="text-xs text-muted font-bold mb-1 block">Start</label>
                                         <input 
                                            type="time" 
                                            value={alarmConfig.dndStart}
                                            onChange={(e) => updateAlarmConfig({ dndStart: e.target.value })}
                                            className="w-full bg-canvas border border-border rounded-xl p-2 text-sm font-bold text-main"
                                         />
                                     </div>
                                     <div>
                                         <label className="text-xs text-muted font-bold mb-1 block">End</label>
                                         <input 
                                            type="time" 
                                            value={alarmConfig.dndEnd}
                                            onChange={(e) => updateAlarmConfig({ dndEnd: e.target.value })}
                                            className="w-full bg-canvas border border-border rounded-xl p-2 text-sm font-bold text-main"
                                         />
                                     </div>
                                 </div>
                             )}
                         </div>
                    </div>
                )}

                {/* APPEARANCE */}
                {activeTab === 'appearance' && (
                    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
                        <div className="bg-surface p-6 rounded-3xl border border-border shadow-sm space-y-6">
                            <div>
                                <label className="text-xs font-bold text-muted uppercase tracking-wider mb-3 block">
                                    {t('settings.appearance.theme')}
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'light', icon: Sun, label: 'Light' },
                                        { id: 'dark', icon: Moon, label: 'Dark' },
                                        { id: 'system', icon: Monitor, label: 'System' },
                                        { id: 'neon', icon: Smartphone, label: 'Neon' },
                                        { id: 'pastel', icon: Palette, label: 'Pastel' },
                                        { id: 'pet', icon: User, label: 'Pet' }
                                    ].map(tObj => (
                                        <button
                                            key={tObj.id}
                                            onClick={() => setTheme(tObj.id as any)}
                                            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all ${
                                                theme === tObj.id 
                                                ? 'bg-brand/10 border-brand text-brand' 
                                                : 'bg-canvas border-border text-muted hover:border-brand/30'
                                            }`}
                                        >
                                            <tObj.icon size={20} />
                                            <span className="text-xs font-bold">{tObj.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-muted uppercase tracking-wider mb-3 block">
                                    {t('settings.appearance.accent')}
                                </label>
                                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                    {['#0EA5A4', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#EF4444'].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => handleAccentChange(color)}
                                            className={`w-10 h-10 rounded-full flex-shrink-0 border-2 transition-transform hover:scale-110 ${accentColor === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: color }}
                                        >
                                            {accentColor === color && <Check size={16} className="text-white mx-auto" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-muted uppercase tracking-wider mb-3 block">
                                    {t('settings.appearance.density')}
                                </label>
                                <div className="flex bg-canvas p-1 rounded-xl border border-border">
                                    {['90%', '100%', '110%'].map((size, idx) => {
                                        const labels = ['Compact', 'Normal', 'Spacious'];
                                        return (
                                            <button
                                                key={size}
                                                onClick={() => handleFontSizeChange(size)}
                                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                                                    fontSize === size ? 'bg-surface text-brand shadow-sm' : 'text-muted'
                                                }`}
                                            >
                                                {labels[idx]}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* LANGUAGE */}
                {activeTab === 'language' && (
                    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
                        <div className="bg-surface p-6 rounded-3xl border border-border shadow-sm space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Globe size={14} /> Language & Region
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { code: 'en', label: 'English (US)', native: 'English', flag: '🇺🇸' },
                                        { code: 'zh-CN', label: 'Simplified Chinese', native: '简体中文', flag: '🇨🇳' }
                                    ].map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => handleLanguageChange(lang.code)}
                                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                                i18n.language === lang.code
                                                ? 'bg-brand/10 border-brand text-brand ring-1 ring-brand'
                                                : 'bg-canvas border-border hover:border-brand/50 text-main'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{lang.flag}</span>
                                                <div className="text-left">
                                                    <div className="text-sm font-bold">{lang.native}</div>
                                                    <div className="text-xs opacity-70">{lang.label}</div>
                                                </div>
                                            </div>
                                            {i18n.language === lang.code && (
                                                <div className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center">
                                                    <Check size={14} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Globe size={14} /> Regional Settings
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-canvas rounded-xl border border-border">
                                        <span className="text-sm font-medium text-main">Auto-detect Region</span>
                                        <button className="w-10 h-5 rounded-full relative bg-brand">
                                            <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full translate-x-5"></div>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-canvas rounded-xl border border-border">
                                        <span className="text-sm font-medium text-main">Weight Units</span>
                                        <select className="bg-transparent text-sm font-bold text-brand outline-none">
                                            <option>Metric (kg)</option>
                                            <option>Imperial (lbs)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* DATA & PRIVACY */}
                {activeTab === 'data' && (
                    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
                        <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm space-y-4">
                             <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Database size={14} /> {t('settings.tabs.data')}
                             </h4>
                             <div className="flex items-center justify-between">
                                 <div>
                                     <h4 className="font-bold text-main">{t('settings.data.export')}</h4>
                                     <p className="text-xs text-muted">{t('settings.data.exportDesc')}</p>
                                 </div>
                                 <button onClick={exportData} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-main hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                     <Download size={20} />
                                 </button>
                             </div>
                             
                             <div className="border-t border-border pt-4">
                                 <h4 className="font-bold text-red-500 mb-2 flex items-center gap-2"><AlertTriangle size={16}/> Danger Zone</h4>
                                 <div className="flex gap-3">
                                     <button onClick={clearData} className="flex-1 py-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl text-red-500 font-bold hover:bg-red-100 transition-colors text-sm">
                                         Clear Local Data
                                     </button>
                                     <button className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors text-sm shadow-lg shadow-red-500/20">
                                         Delete Account
                                     </button>
                                 </div>
                             </div>
                         </div>
                    </div>
                )}

                {/* LABS */}
                {activeTab === 'labs' && (
                    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
                        <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm">
                             <h4 className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Beaker size={14} /> Beta Features (Labs)
                            </h4>
                            <p className="text-xs text-muted mb-4">
                                Try out experimental features before they are released. These features may change or break.
                            </p>
                            <div className="space-y-3">
                                {[
                                    { label: 'New Dashboard UI', key: 'newDash' },
                                    { label: 'Smart Health Analysis', key: 'smartHealth' },
                                    { label: 'Experimental Reminders', key: 'expReminders' },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between p-3 bg-canvas rounded-xl border border-border">
                                        <span className="text-sm font-medium text-main">{item.label}</span>
                                        <button 
                                            // @ts-ignore
                                            onClick={() => setBeta(c => ({...c, [item.key]: !c[item.key]}))}
                                            // @ts-ignore
                                            className={`w-10 h-5 rounded-full relative transition-colors ${beta[item.key] ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                        >
                                            {/* @ts-ignore */}
                                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${beta[item.key] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {viewingDoc && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setViewingDoc(null)}>
              <div className="bg-surface w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-border flex justify-between items-center bg-canvas">
                      <div className="flex items-center gap-2">
                          {viewingDoc.type.includes('image') ? <ImageIcon size={18} className="text-brand"/> : <FileText size={18} className="text-red-500"/>}
                          <span className="font-bold text-main truncate max-w-[200px]">{viewingDoc.name}</span>
                      </div>
                      <button onClick={() => setViewingDoc(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                          <X size={20} />
                      </button>
                  </div>
                  <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
                      {viewingDoc.type.includes('image') ? (
                          <img src={viewingDoc.data} alt="Full view" className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg" />
                      ) : (
                          <iframe src={viewingDoc.data} className="w-full h-[75vh] rounded-lg border border-border bg-white" title="PDF Viewer" />
                      )}
                  </div>
                  <div className="p-3 border-t border-border bg-surface flex justify-end">
                      <a href={viewingDoc.data} download={viewingDoc.name} className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl font-bold text-sm hover:bg-brand-dim">
                          <Download size={16} /> Download
                      </a>
                  </div>
              </div>
          </div>
      )}

      {/* Delete Confirmation Modal */}
      {documentToDelete && (
          <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-surface rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-border animate-fade-in-up transform scale-100">
                  <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 text-red-500">
                          <Trash2 size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-main mb-2">Delete Document?</h3>
                      <p className="text-sm text-muted mb-6">
                          Are you sure you want to delete <span className="font-bold text-main">{documents.find(d => d.id === documentToDelete)?.name}</span>? 
                          <br/>This action cannot be undone.
                      </p>
                      <div className="flex gap-3 w-full">
                          <button 
                              onClick={() => setDocumentToDelete(null)}
                              className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-main rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={confirmDeleteDocument}
                              className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 transition-all active:scale-95"
                          >
                              Delete
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </>
  );
};

export default SettingsDrawer;
