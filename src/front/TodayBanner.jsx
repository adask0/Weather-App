import React from "react";
import "./todaybanner.css";
import { useLocation } from "../context/WeatherContexts";
import { useTemperature } from "../context/WeatherContexts";
import { getWeatherIcon } from "../services/weatherIconMapper";
import { useWeatherData } from "../hooks/useWeatherData";

export default function TodayBanner() {
  const { selectedLocation } = useLocation();
  const { getTemperature } = useTemperature();
  
  const { data, loading, error } = useWeatherData(
    selectedLocation.latitude,
    selectedLocation.longitude
  );

  if (loading) return <div className="today-banner-container">Loading...</div>;
  if (error) return <div className="today-banner-container">Error loading data</div>;

  return (
    <div className="today-banner-container">
      <div className="today-banner-content">
        <h2>{selectedLocation.name}</h2>
        <p>
          {data
            ? Intl.DateTimeFormat("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(new Date(data?.current_weather?.time))
            : null}
        </p>
      </div>
      <div className="today-banner-temperture">
        <img src={getWeatherIcon(data?.current_weather?.weathercode)} alt="Weather icon" />
        <h1>{getTemperature(data?.current_weather?.temperature)}°</h1>
      </div>
    </div>
  );
}