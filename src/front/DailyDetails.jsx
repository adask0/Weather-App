import React from "react";
import "./dailydetails.css";
import { useWeather } from "../context/WeatherContext";
import { fetchWeatherData } from "../services/api";

export default function DailyDetails() {
  const { selectedLocation, selectedDay, getTemperature, temperature } =
    useWeather();
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const weatherData = await fetchWeatherData(
          selectedLocation.latitude,
          selectedLocation.longitude
        );
        console.log("Fetched weather data:", weatherData);
        setData(weatherData);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, [selectedLocation]);

  const getHourlyIndex = () => {
    if (!data || !data.current_weather) return 0;
    const date = new Date(data.current_weather.time);
    return date.getHours();
  };

  const index = getHourlyIndex();

  const todayTemperature = () => {
    if (!data) return "...";
    if (temperature === "Celsius")
      return getTemperature(data.hourly.temperature_2m[index]) + "°C";
    if (temperature === "Fahrenheit")
      return getTemperature(data.hourly.temperature_2m[index]) + "°F";
    if (temperature === "Kelvin")
      return getTemperature(data.hourly.temperature_2m[index]) + "°K";
  };

  return (
    <div className="daily-details">
      <div className="daily-data-content">
        <h4>Feels like</h4>
        <h2>{todayTemperature()}</h2>
      </div>
      <div className="daily-data-content">
        <h4>Humidity</h4>
        <h2>{data ? `${data.hourly.relative_humidity_2m[index]}%` : "..."}</h2>
      </div>
      <div className="daily-data-content">
        <h4>Wind Speed</h4>
        <h2>{data ? `${data.hourly.wind_speed_120m[index]} m/s` : "..."}</h2>
      </div>
      <div className="daily-data-content">
        <h4>Precipitation</h4>
        <h2>{data ? `${data.hourly.precipitation[index]} mm` : "..."}</h2>
      </div>
    </div>
  );
}
