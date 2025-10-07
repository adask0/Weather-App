import React from "react";
import "./dailydetails.css";
import { useWeather } from "../context/WeatherContext";
import { fetchWeatherData } from "../services/api";

export default function DailyDetails() {
  const { selectedLocation, selectedDay } = useWeather();
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

  const date = new Date(data.current_weather.time);
  const index = date.getHours();

  return (
    <div className="daily-details">
      <div className="daily-data-content">
        <h4>Feels like</h4>
        <h2>{data ? `${data.hourly.apparent_temperature[index]}°C` : "..."}</h2>
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
