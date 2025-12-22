
import React, { useEffect, useState, useMemo } from 'react';
import { usePetContext } from '../context/PetContext';
import { GeminiService } from '../services/geminiService';
import { useTranslation } from 'react-i18next';
import { Sun, Cloud, CloudRain, Snowflake, Wind, Sparkles, Clock, CheckCircle2, Trophy, CloudLightning } from 'lucide-react';
import { differenceInSeconds, isSameDay, isAfter } from 'date-fns';

const SmartDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { pets, reminders } = usePetContext();
  const [weather, setWeather] = useState<{ temp: number; code: number; desc: string } | null>(null);
  const [tip, setTip] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [nextReminderId, setNextReminderId] = useState<string | null>(null);

  const petOfTheDay = useMemo(() => {
    if (pets.length === 0) return null;
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    return pets[dayOfYear % pets.length];
  }, [pets]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        navigator.geolocation.getCurrentPosition(
            async (pos) => { await loadWeather(pos.coords.latitude, pos.coords.longitude); },
            async () => { await loadWeather(51.5074, -0.1278); }
        );
      } catch (e) { console.error("Weather error", e); }
    };
    
    const loadWeather = async (lat: number, lon: number) => {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        const code = data.current_weather.weathercode;
        let desc = 'Clear';
        if (code > 0 && code <= 3) desc = 'Partly Cloudy';
        if (code > 3 && code <= 48) desc = 'Foggy';
        if (code > 48 && code <= 67) desc = 'Rainy';
        if (code > 70 && code <= 77) desc = 'Snowy';
        if (code > 80) desc = 'Thunderstorm';
        setWeather({ temp: data.current_weather.temperature, code, desc });
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    if (petOfTheDay && weather) {
        const fetchTip = async () => {
            const advice = await GeminiService.getDailyTip(petOfTheDay, `${weather.desc}, ${weather.temp}°C`);
            setTip(advice);
        };
        fetchTip();
    }
  }, [petOfTheDay, weather]);

  useEffect(() => {
    const updateCountdown = () => {
        const now = new Date();
        const upcoming = reminders
            .filter(r => !r.completed && isAfter(new Date(r.dateTime), now))
            .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())[0];

        if (upcoming) {
            setNextReminderId(upcoming.id);
            const diff = differenceInSeconds(new Date(upcoming.dateTime), now);
            const h = Math.floor(diff / 3600);
            const m = Math.floor((diff % 3600) / 60);
            const s = diff % 60;
            setTimeRemaining(`${h}h ${m}m ${s}s`);
        } else {
            setNextReminderId(null);
            setTimeRemaining(t('widgets.allCaughtUp'));
        }
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(interval);
  }, [reminders, t]);

  const careStats = useMemo(() => {
    const todayReminders = reminders.filter(r => isSameDay(new Date(r.dateTime), new Date()));
    if (todayReminders.length === 0) return { percent: 100, msg: t('dashboard.noTasks') };
    const completed = todayReminders.filter(r => r.completed).length;
    const percent = Math.round((completed / todayReminders.length) * 100);
    let msg = "Let's get started!";
    if (percent > 0) msg = "Off to a good start!";
    if (percent >= 50) msg = "Halfway there!";
    if (percent >= 80) msg = "Almost done!";
    if (percent === 100) msg = "You're a superstar!";
    return { percent, msg, total: todayReminders.length, completed };
  }, [reminders, t]);

  const getWeatherIcon = (code: number) => {
     if (code <= 1) return <Sun className="text-orange-400" size={24} />;
     if (code <= 3) return <Cloud className="text-gray-400" size={24} />;
     if (code <= 67) return <CloudRain className="text-blue-400" size={24} />;
     if (code <= 77) return <Snowflake className="text-cyan-400" size={24} />;
     return <CloudLightning className="text-purple-400" size={24} />;
  };

  const nextReminder = reminders.find(r => r.id === nextReminderId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* 1. Pet of the Day */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy size={60} className="text-brand rotate-12" />
         </div>
         <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
            <Trophy size={12} className="text-yellow-500" /> {t('widgets.petOfDay')}
         </h3>
         {petOfTheDay ? (
             <div className="flex items-center gap-4">
                 <div className="relative">
                    <img 
                        src={petOfTheDay.photoUrl} 
                        alt={petOfTheDay.name} 
                        className="w-16 h-16 rounded-2xl object-cover shadow-md ring-2 ring-brand/20 animate-bounce-gentle"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white p-1 rounded-full border-2 border-white dark:border-gray-800">
                        <Sparkles size={10} />
                    </div>
                 </div>
                 <div>
                    <div className="text-xl font-display font-black text-gray-900 dark:text-white">{petOfTheDay.name}</div>
                    <div className="text-xs font-medium text-gray-500">{petOfTheDay.breed}</div>
                    <div className="text-[10px] text-brand-dim font-bold mt-1 bg-brand/10 px-2 py-0.5 rounded-md inline-block">
                        {t('widgets.starPupil')}
                    </div>
                 </div>
             </div>
         ) : (
            <div className="text-sm text-gray-500">{t('pets.noPets')}</div>
         )}
      </div>

      {/* 2. Next Reminder Countdown */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-5 rounded-3xl shadow-soft relative overflow-hidden border border-gray-700">
         <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
         <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1 relative z-10">
            <Clock size={12} className="text-brand" /> {t('widgets.nextUp')}
         </h3>
         <div className="relative z-10">
            {nextReminder ? (
                <>
                    <div className="text-2xl font-display font-black tracking-tight mb-1 truncate text-glow-soft">
                        {timeRemaining}
                    </div>
                    <div className="text-sm font-medium text-gray-300 truncate opacity-90">
                        {nextReminder.title}
                    </div>
                    <div className="mt-2 h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-brand animate-shimmer w-1/2 rounded-full"></div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-16">
                    <CheckCircle2 size={24} className="text-brand mb-1" />
                    <span className="text-sm font-bold text-gray-300">{t('widgets.allCaughtUp')}</span>
                </div>
            )}
         </div>
      </div>

      {/* 3. Daily Care Score */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 flex items-center gap-4">
         <div className="relative w-20 h-20 flex-shrink-0">
             <svg className="w-full h-full transform -rotate-90">
                 <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-gray-700" />
                 <circle 
                    cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray={226} 
                    strokeDashoffset={226 - (226 * careStats.percent) / 100} 
                    className="text-brand transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                 />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center flex-col">
                 <span className="text-sm font-black text-gray-900 dark:text-white">{careStats.percent}%</span>
             </div>
         </div>
         <div>
             <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{t('widgets.careScore')}</h3>
             <div className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-1">{careStats.msg}</div>
             <div className="text-xs text-gray-500 font-medium">{careStats.completed} / {careStats.total}</div>
         </div>
      </div>

      {/* 4. Weather & AI Tip Combined Card */}
      <div className="glass-panel bg-gradient-to-br from-brand/10 to-blue-400/10 p-5 rounded-3xl shadow-soft border border-gray-100 dark:border-gray-700 flex flex-col justify-between relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-50">
            {weather ? getWeatherIcon(weather.code) : <Wind className="text-gray-400" />}
         </div>
         
         <div className="mb-3 relative z-10">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">{t('widgets.smartInsight')}</h3>
            {weather ? (
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">{weather.temp}°</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">{weather.desc}</span>
                </div>
            ) : (
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            )}
         </div>

         <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 rounded-xl border border-white/50 dark:border-gray-700 relative z-10">
            <div className="flex gap-2">
                <Sparkles size={14} className="text-brand mt-0.5 flex-shrink-0" />
                <p className="text-xs font-medium text-gray-700 dark:text-gray-200 leading-relaxed italic">
                    "{tip || t('widgets.loadingTip')}"
                </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SmartDashboard;
