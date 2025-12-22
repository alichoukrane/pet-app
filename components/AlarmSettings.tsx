
import React, { useState, useRef, useEffect } from 'react';
import { usePetContext } from '../context/PetContext';
import { audioService } from '../services/audioService';
import { useTranslation } from 'react-i18next';
import { Bell, BellOff, Volume2, Play, Settings, Music, Check, Smartphone, AlertTriangle } from 'lucide-react';
import { SoundType } from '../types';
import { NotificationService } from '../services/notificationService';

const AlarmSettings: React.FC = () => {
  const { t } = useTranslation();
  const { alarmConfig, updateAlarmConfig } = usePetContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [permState, setPermState] = useState(NotificationService.getPermissionState());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTestSound = () => {
    if (isPlayingTest) {
      audioService.stop();
      setIsPlayingTest(false);
    } else {
      setIsPlayingTest(true);
      audioService.playAlarm(alarmConfig.soundType, alarmConfig.volume);
      // Also vibrate test
      if (alarmConfig.vibrationEnabled && navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
      }
      setTimeout(() => {
        audioService.stop();
        setIsPlayingTest(false);
      }, 4000);
    }
  };

  const handleRequestPerms = async () => {
      const res = await NotificationService.requestPermission();
      setPermState(res);
  };

  const sounds: SoundType[] = ['Reflection', 'Radar', 'Cosmic', 'Circuit', 'Silk', 'Waves', 'Aurora', 'Classic'];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-full transition-all duration-300 ${
          isOpen 
            ? 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' 
            : 'bg-white text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 shadow-sm hover:shadow-md'
        }`}
      >
        {alarmConfig.isMuted ? (
          <BellOff size={22} className="text-gray-400" />
        ) : (
          <Bell size={22} className={`transition-transform duration-300 ${isOpen ? 'rotate-12' : 'group-hover:rotate-12'}`} />
        )}
        {!alarmConfig.isMuted && (
           <span className="absolute top-2 right-2.5 w-2 h-2 bg-coral-500 rounded-full border-2 border-white dark:border-gray-800"></span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-14 w-80 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-5 z-50 animate-fade-in-up origin-top-right backdrop-blur-xl bg-opacity-95 dark:bg-opacity-95">
           <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
              <h3 className="font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 <Settings size={16} className="text-teal-500" /> {t('alarm.reminder')}
              </h3>
              <button 
                 onClick={() => updateAlarmConfig({ isMuted: !alarmConfig.isMuted })}
                 className={`text-xs font-bold px-2 py-1 rounded-lg transition-colors ${
                    alarmConfig.isMuted 
                    ? 'bg-coral-50 text-coral-600 dark:bg-coral-900/30 dark:text-coral-400' 
                    : 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400'
                 }`}
              >
                 {alarmConfig.isMuted ? t('alarm.unmute') : t('alarm.mute')}
              </button>
           </div>

           <div className="space-y-5">

              {/* Permission Warning */}
              {permState !== 'granted' && (
                  <button 
                    onClick={handleRequestPerms}
                    className="w-full text-left p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 flex items-start gap-3 hover:bg-orange-100 transition-colors"
                  >
                      <AlertTriangle size={16} className="text-orange-500 mt-0.5" />
                      <div>
                          <div className="text-xs font-bold text-orange-700 dark:text-orange-400">{t('alarm.enableAlerts')}</div>
                          <div className="text-[10px] text-orange-600/80 dark:text-orange-400/70">{t('alarm.enableAlertsDesc')}</div>
                      </div>
                  </button>
              )}
              
              {/* Sound Selection */}
              <div>
                 <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Music size={12} /> {t('alarm.sound')}
                 </label>
                 <div className="grid grid-cols-2 gap-2">
                    {sounds.map(sound => (
                       <button
                          key={sound}
                          onClick={() => {
                             updateAlarmConfig({ soundType: sound });
                             if (!alarmConfig.isMuted) {
                                audioService.playAlarm(sound, alarmConfig.volume);
                                setTimeout(() => audioService.stop(), 500);
                             }
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-all ${
                             alarmConfig.soundType === sound 
                             ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20' 
                             : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                       >
                          {sound}
                          {alarmConfig.soundType === sound && <Check size={12} />}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Volume Slider */}
              <div>
                 <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Volume2 size={12} /> {t('alarm.volume')} ({Math.round(alarmConfig.volume * 100)}%)
                 </label>
                 <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1"
                    value={alarmConfig.volume}
                    onChange={(e) => updateAlarmConfig({ volume: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                 />
              </div>
              
              {/* Vibration Toggle */}
              <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Smartphone size={12} /> {t('alarm.vibration')}
                 </label>
                 <button 
                    onClick={() => updateAlarmConfig({ vibrationEnabled: !alarmConfig.vibrationEnabled })}
                    className={`w-10 h-5 rounded-full relative transition-colors ${
                        alarmConfig.vibrationEnabled ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                 >
                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${
                        alarmConfig.vibrationEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}></div>
                 </button>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                 <button 
                    onClick={handleTestSound}
                    disabled={alarmConfig.isMuted}
                    className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs uppercase tracking-wide hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-900/30 dark:hover:text-teal-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {isPlayingTest ? t('alarm.stop') : t('alarm.testSound')}
                    {!isPlayingTest && <Play size={12} />}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AlarmSettings;
