import { useState, useEffect } from 'react';
import { fetchWeatherData } from '../services/api';

export const useWeatherData = (latitude, longitude) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const weatherData = await fetchWeatherData(latitude, longitude);
        setData(weatherData);
        setError(null);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    
    if (latitude && longitude) {
      fetchData();
    }
  }, [latitude, longitude]);

  return { data, loading, error };
};