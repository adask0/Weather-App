import React from "react";
import { fetchWeatherData } from "../../services/api";
import { useWeather } from "../../context/WeatherContext";
import { useEffect } from "react";
import "./weatherhours.css";
import IconFog from "../../assets/images/icon-fog.webp";
import IconOvercast from "../../assets/images/icon-overcast.webp";
import IconPartlyCloudy from "../../assets/images/icon-partly-cloudy.webp";
import IconSunny from "../../assets/images/icon-sunny.webp";
import IconRain from "../../assets/images/icon-rain.webp";
import IconSnow from "../../assets/images/icon-snow.webp";
import IconStorm from "../../assets/images/icon-storm.webp";
import IconDrizzle from "../../assets/images/icon-drizzle.webp";

export default function WeatherHours() {
  const { selectedLocation, selectedDay } = useWeather();
  const [data, setData] = React.useState(null);

  const date = new Date();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWeatherData(
          selectedLocation.latitude,
          selectedLocation.longitude
        );
        setData(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, [selectedLocation]);

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
      {data ? (
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
      ) : (
        <p className="loading-text">Loading weather data...</p>
      )}
    </div>
  );
}
