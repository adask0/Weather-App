import React from "react";
import "./dailydetails.css";
import { useLocation } from "../context/WeatherContexts";
import { useTemperature } from "../context/WeatherContexts";
import { useWeatherData } from "../hooks/useWeatherData";

export default function DailyDetails() {
  const { selectedLocation } = useLocation();
  const { getTemperature, getTemperatureUnit } = useTemperature();
  
  const { data, loading, error } = useWeatherData(
    selectedLocation.latitude,
    selectedLocation.longitude
  );

  if (loading) return <div className="daily-details">Loading...</div>;
  if (error) return <div className="daily-details">Error loading data</div>;

  const getHourlyIndex = () => {
    if (!data || !data.current_weather) return 0;
    const date = new Date(data.current_weather.time);
    return date.getHours();
  };

  const index = getHourlyIndex();

  const todayTemperature = () => {
    if (!data) return "...";
    const temp = getTemperature(data.hourly.temperature_2m[index]);
    return `${temp}${getTemperatureUnit()}`;
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