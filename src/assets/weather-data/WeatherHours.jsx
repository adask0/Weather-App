import React from "react";
import { useLocation } from "../../context/WeatherContexts";
import { useDay } from "../../context/WeatherContexts";
import { useWeatherData } from "../../hooks/useWeatherData";
import "./weatherhours.css";
import IconFog from "../../assets/images/icon-fog.webp";
import IconSunny from "../../assets/images/icon-sunny.webp";
import IconRain from "../../assets/images/icon-rain.webp";
import IconSnow from "../../assets/images/icon-snow.webp";
import IconStorm from "../../assets/images/icon-storm.webp";
import IconDrizzle from "../../assets/images/icon-drizzle.webp";

export default function WeatherHours() {
  const { selectedLocation } = useLocation();
  const { selectedDay } = useDay();
  
  const { data, loading, error } = useWeatherData(
    selectedLocation.latitude,
    selectedLocation.longitude
  );

  if (loading) return <p className="loading-text">Loading weather data...</p>;
  if (error) return <p className="loading-text">Error loading data</p>;

  const startIndex = (selectedDay.value - 1) * 24;
  const endIndex = startIndex + 24;

  const iconUrl = (index) => {
    if (data.hourly.rain[index] > 0) {
      return IconRain;
    } else if (data.hourly.snowfall[index] > 0) {
      return IconSnow;
    } else if (data.hourly.precipitation[index] > 0) {
      return IconDrizzle;
    } else if (data.hourly.wind_gusts_10m[index] > 15) {
      return IconStorm;
    } else if (data.hourly.visibility[index] < 30000) {
      return IconFog;
    } else {
      return IconSunny;
    }
  };

  return (
    <div className="weather-hours-container">
      <div className="hourly-forecast">
        {data.hourly.time.slice(startIndex, endIndex).map((time, index) => {
          const hour = new Date(time).getHours();
          const apm = hour >= 12 ? "PM" : "AM";
          const temperature = data.hourly.temperature_2m[index + startIndex];
          return (
            <div key={index} className="hour-card">
              <div className="hour">
                <img
                  className="weather-icon"
                  src={iconUrl([index + startIndex])}
                  alt="Weather Icon"
                />
                {hour % 12 || 12}:00 {apm}
              </div>
              <div className="temperature">{temperature}°C</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}