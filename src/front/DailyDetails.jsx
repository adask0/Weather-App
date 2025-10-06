import React from "react";
import "./dailydetails.css";
import { useWeather } from "../../context/WeatherContext";
import { fetchWeatherData } from "../../services/api";

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
        setData(weatherData);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, [selectedLocation]);

  return (
    <div className="daily-details">{data && <p>{data.daily.summary}</p>}</div>
  );
}
