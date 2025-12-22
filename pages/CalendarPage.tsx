
import React, { useState, useEffect } from 'react';
import { usePetContext } from '../context/PetContext';
import { 
  endOfMonth, 
  endOfWeek, 
  eachDayOfInterval, 
  addMonths, 
  format, 
  isSameDay, 
  isSameMonth
} from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import zhCN from 'date-fns/locale/zh-CN';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Cloud, CloudRain, CloudLightning, Sun, Snowflake, AlertTriangle, ThermometerSun } from 'lucide-react';
import { WeatherService, DailyWeather } from '../services/weatherService';

const CalendarPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { reminders } = usePetContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weatherMap, setWeatherMap] = useState<Record<string, DailyWeather>>({});

  const dateLocale = i18n.language === 'zh-CN' ? zhCN : enUS;

  // Manual implementation of startOfMonth
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);

  const monthEnd = endOfMonth(monthStart);
  
  // Manual implementation of startOfWeek (default to Sunday start)
  const startDate = new Date(monthStart);
  startDate.setDate(monthStart.getDate() - monthStart.getDay());
  startDate.setHours(0, 0, 0, 0);

  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  // Map days to localized names manually to ensure consistent UI length or use date-fns
  const weekDays = i18n.language === 'zh-CN' 
    ? ['日', '一', '二', '三', '四', '五', '六'] 
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    // Fetch weather on mount
    const loadWeather = async () => {
        try {
            // Default to London if geo fails, or use browser geolocation
            navigator.geolocation.getCurrentPosition(
                async (pos) => { 
                    const data = await WeatherService.getForecast(pos.coords.latitude, pos.coords.longitude);
                    const map: Record<string, DailyWeather> = {};
                    data.forEach(d => map[d.date] = d);
                    setWeatherMap(map);
                },
                async () => { 
                    const data = await WeatherService.getForecast(51.5074, -0.1278);
                    const map: Record<string, DailyWeather> = {};
                    data.forEach(d => map[d.date] = d);
                    setWeatherMap(map);
                }
            );
        } catch (e) {
            console.error(e);
        }
    };
    loadWeather();
  }, []);

  const getRemindersForDay = (day: Date) => {
    return reminders.filter(r => isSameDay(new Date(r.dateTime), day));
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(addMonths(currentDate, -1));

  const getWeatherIcon = (code: number) => {
    if (code <= 1) return <Sun size={14} className="text-orange-400" />;
    if (code <= 3) return <Cloud size={14} className="text-gray-400" />;
    if (code <= 67) return <CloudRain size={14} className="text-blue-400" />;
    if (code <= 77) return <Snowflake size={14} className="text-cyan-400" />;
    return <CloudLightning size={14} className="text-purple-400" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: dateLocale })}
        </h2>
        <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <ChevronLeft size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
             <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <ChevronRight size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        {weekDays.map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                {day}
            </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-[120px]">
        {days.map(day => {
            const dayReminders = getRemindersForDay(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const dateKey = format(day, 'yyyy-MM-dd');
            const weather = weatherMap[dateKey];
            const isTodayDate = isSameDay(day, new Date());
            
            // Determine bad conditions
            let badCondition = { isBad: false, reason: '' };
            if (weather) {
                const check = WeatherService.isBadCondition(weather.code, weather.tempMax);
                if (check.isBad) {
                    // Translate reason key if possible, else use raw
                    const reasonKey = `calendar.reasons.${check.reason.replace(/\s+/g, '')}`;
                    // Use a safe check if the key exists is handled by i18next usually returning key if missing, 
                    // but here we can assume standard reasons map to keys.
                    // For safety, we check if check.reason maps to our defined keys
                    badCondition = { 
                        isBad: true, 
                        reason: t(reasonKey, { defaultValue: check.reason }) 
                    };
                }
            }

            return (
                <div 
                    key={day.toString()} 
                    className={`border-b border-r border-gray-100 dark:border-gray-700 p-2 transition-colors relative group ${
                        !isCurrentMonth ? 'bg-gray-50/50 dark:bg-gray-900/50 text-gray-400' : 
                        badCondition.isBad ? 'bg-red-50/50 dark:bg-red-900/10' : 'bg-white dark:bg-gray-800'
                    }`}
                >
                    <div className="flex justify-between items-start mb-1">
                         <div className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-all ${
                            isTodayDate 
                            ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                            {format(day, 'd')}
                        </div>

                        {/* Weather Indicator */}
                        {weather && (
                            <div className="flex flex-col items-end" title={`${weather.tempMax}°C - ${badCondition.isBad ? badCondition.reason : t('calendar.goodConditions')}`}>
                                <div className="flex items-center gap-1">
                                    <span className={`text-[10px] font-bold ${badCondition.isBad ? 'text-coral-500' : 'text-gray-400'}`}>
                                        {Math.round(weather.tempMax)}°
                                    </span>
                                    {getWeatherIcon(weather.code)}
                                </div>
                                {badCondition.isBad && (
                                    <div className="mt-0.5">
                                        {badCondition.reason.includes('Heat') || badCondition.reason.includes('高温') ? (
                                             <ThermometerSun size={12} className="text-coral-500 animate-pulse" />
                                        ) : (
                                             <AlertTriangle size={12} className="text-coral-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                   
                    <div className="space-y-1 overflow-y-auto max-h-[75px] no-scrollbar">
                        {dayReminders.map(r => (
                            <div 
                                key={r.id} 
                                className={`text-[10px] truncate px-1.5 py-0.5 rounded-md border-l-2 shadow-sm font-medium ${
                                    r.completed 
                                    ? 'bg-gray-100 text-gray-400 border-gray-300 dark:bg-gray-700 dark:border-gray-600' 
                                    : 'bg-teal-50 text-teal-700 border-teal-500 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-500'
                                }`}
                            >
                                {r.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default CalendarPage;
