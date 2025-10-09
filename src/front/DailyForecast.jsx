import React from "react";
import { useEffect, useState } from "react";
import "./dailyforecast.css";
import { useWeather } from "../context/WeatherContext";
import { fetchWeatherData } from "../services/api";
import IconFog from "../assets/images/icon-fog.webp";
import IconOvercast from "../assets/images/icon-overcast.webp";
import IconPartlyCloudy from "../assets/images/icon-partly-cloudy.webp";
import IconSunny from "../assets/images/icon-sunny.webp";
import IconRain from "../assets/images/icon-rain.webp";
import IconSnow from "../assets/images/icon-snow.webp";
import IconStorm from "../assets/images/icon-storm.webp";
import IconDrizzle from "../assets/images/icon-drizzle.webp";

export default function DailyForecast() {
  const { selectedLocation, daysOptions, getTemperature } = useWeather();
  const [data, setData] = React.useState(null);
  const [weekdays, setWeekdays] = useState([]);
  const weatherIcons = [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weatherData = await fetchWeatherData(
          selectedLocation.latitude,
          selectedLocation.longitude
        );
        setData(weatherData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    fetchData();
  }, [selectedLocation]);

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
    weatherIcons.length = 0;
    if (!data) return IconSunny;
    const startIndex = index * 24;
    const endIndex = startIndex + 24;
    for (let i = startIndex; i < endIndex; i++) {
      if (data.hourly.rain[i] > 0) {
        weatherIcons.push(1);
      } else if (data.hourly.snowfall[i] > 0) {
        weatherIcons.push(2);
      } else if (data.hourly.precipitation[i] > 0) {
        weatherIcons.push(3);
      } else if (data.hourly.wind_gusts_10m[i] > 15) {
        weatherIcons.push(4);
      } else if (data.hourly.visibility[i] < 30000) {
        weatherIcons.push(5);
      } else {
        weatherIcons.push(0);
      }
    }

    const mostFrequentIcon = weatherIcons
      .sort(
        (a, b) =>
          weatherIcons.filter((v) => v === a).length -
          weatherIcons.filter((v) => v === b).length
      )
      .pop();

    switch (mostFrequentIcon) {
      case 0:
        return IconSunny;
      case 1:
        return IconRain;
      case 2:
        return IconSnow;
      case 3:
        return IconDrizzle;
      case 4:
        return IconStorm;
      case 5:
        return IconFog;
      default:
        return IconSunny;
    }
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
