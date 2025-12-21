import React from "react";
import { useEffect, useState } from "react";
import "./dailyforecast.css";
import { useLocation } from "../context/WeatherContexts";
import { useTemperature } from "../context/WeatherContexts";
import { useDay } from "../context/WeatherContexts";
import IconFog from "../assets/images/icon-fog.webp";
import { useWeatherData } from "../hooks/useWeatherData";
import IconSunny from "../assets/images/icon-sunny.webp";
import IconRain from "../assets/images/icon-rain.webp";
import IconSnow from "../assets/images/icon-snow.webp";
import IconStorm from "../assets/images/icon-storm.webp";
import IconDrizzle from "../assets/images/icon-drizzle.webp";

export default function DailyForecast() {
  const { selectedLocation } = useLocation();
  const { getTemperature } = useTemperature();
  const { daysOptions } = useDay();
  
  const { data, loading, error } = useWeatherData(
    selectedLocation.latitude,
    selectedLocation.longitude
  );
  const [weekdays, setWeekdays] = useState([]);

  if (loading) return <p>Loading forecast...</p>;
  if (error) return <p>Error loading forecast</p>;

  function generateWeekdays() {
    weekdays.length = 0;
    if (!data || !data.current_weather) return [];
    const d = new Date(data.current_weather.time);
    const weekday = d.getDay();

    for (let i = 0; i < 7; i++) {
      const dayIndex = (weekday + i) % 7;
      weekdays.push(daysOptions[dayIndex].label.slice(0, 3));
    }
    return weekdays;
  }

  function getDailyTemperatures(index) {
    if (!data) return { min: "...", max: "..." };
    const startIndex = index * 24;
    const endIndex = startIndex + 24;
    const dailyTemperatures = data.hourly.temperature_2m.slice(
      startIndex,
      endIndex
    );
    return {
      max: getTemperature(Math.max(...dailyTemperatures)),
      min: getTemperature(Math.min(...dailyTemperatures)),
    };
  }

  const getWeatherIcon = (index) => {
    if (!data) return IconSunny;
  
    const startIndex = index * 24;
    const endIndex = startIndex + 24;
  
    const counters = {
      rain: 0,
      snow: 0,
      drizzle: 0,
      storm: 0,
      fog: 0,
      sunny: 0
    };
  
    for (let i = startIndex; i < endIndex; i++) {
      if (data.hourly.rain[i] > 0) {
        counters.rain++;
      } else if (data.hourly.snowfall[i] > 0) {
        counters.snow++;
      } else if (data.hourly.precipitation[i] > 0) {
        counters.drizzle++;
      } else if (data.hourly.wind_gusts_10m[i] > 15) {
        counters.storm++;
      } else if (data.hourly.visibility[i] < 30000) {
        counters.fog++;
      } else {
        counters.sunny++;
      }
    }
  
    let maxCondition = 'sunny';
    let maxCount = 0;
  
    for (const [condition, count] of Object.entries(counters)) {
      if (count > maxCount) {
        maxCount = count;
        maxCondition = condition;
      }
    }
  
    const iconMap = {
      rain: IconRain,
      snow: IconSnow,
      drizzle: IconDrizzle,
      storm: IconStorm,
      fog: IconFog,
      sunny: IconSunny
    };
  
    return iconMap[maxCondition];
  };

  return (
    <div className="daily-forecast-container">
      <h3>DailyForecast Component</h3>
      <div className="daily-forecast-content">
        {data ? (
          generateWeekdays().map((label, index) => (
            <div key={index} className="daily-forecast-item">
              <div className="daily-forecast-time">{label}</div>
              <div className="daily-forecast-weather">
                <img
                  className="daily-forecast-icon"
                  src={getWeatherIcon(index)}
                  alt="Weather Icon"
                />
              </div>
              <div className="daily-forecast-temp">
                <p>{getDailyTemperatures(index).max}°</p>
                <p>{getDailyTemperatures(index).min}°</p>
              </div>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
