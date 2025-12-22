
export interface DailyWeather {
  date: string; // YYYY-MM-DD
  code: number;
  tempMax: number;
}

export const WeatherService = {
  async getForecast(lat: number, lon: number): Promise<DailyWeather[]> {
    try {
      // Fetch 16 days forecast (max for free tier)
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max&timezone=auto&forecast_days=16`);
      const data = await res.json();
      
      if (!data.daily) return [];

      return data.daily.time.map((time: string, index: number) => ({
        date: time,
        code: data.daily.weathercode[index],
        tempMax: data.daily.temperature_2m_max[index]
      }));
    } catch (error) {
      console.error("Failed to fetch forecast", error);
      return [];
    }
  },
  
  isBadCondition(code: number, temp: number): { isBad: boolean; reason?: string } {
    // Extreme Heat
    if (temp >= 30) return { isBad: true, reason: 'High Heat' };
    // Extreme Cold
    if (temp <= -5) return { isBad: true, reason: 'Freezing' };
    
    // Rain/Drizzle
    if (code >= 51 && code <= 67) return { isBad: true, reason: 'Rain' };
    // Snow
    if (code >= 71 && code <= 77) return { isBad: true, reason: 'Snow' };
    // Showers
    if (code >= 80 && code <= 82) return { isBad: true, reason: 'Showers' };
    // Thunderstorm
    if (code >= 95) return { isBad: true, reason: 'Storm' };

    return { isBad: false };
  }
};
