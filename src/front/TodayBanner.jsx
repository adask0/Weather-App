import React, { useEffect } from "react";
import "./todaybanner.css";
import { fetchWeatherData } from "../services/api";
import { useWeather } from "../context/WeatherContext";
import IconFog from "../assets/images/icon-fog.webp";
import IconOvercast from "../assets/images/icon-overcast.webp";
import IconPartlyCloudy from "../assets/images/icon-partly-cloudy.webp";
import IconSunny from "../assets/images/icon-sunny.webp";
import IconRain from "../assets/images/icon-rain.webp";
import IconSnow from "../assets/images/icon-snow.webp";
import IconStorm from "../assets/images/icon-storm.webp";
import IconDrizzle from "../assets/images/icon-drizzle.webp";

export default function TodayBanner() {
  const { selectedLocation, temperature } = useWeather();
  const [data, setData] = React.useState(null);

  console.log("Selected location in TodayBanner:", selectedLocation);

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

  const getWeatherIcon = (weathercode) => {
    switch (weathercode) {
      case (0, 1):
        return IconSunny;
      case 45:
        return IconFog;
      case 3:
        return IconOvercast;
      case 2:
        return IconPartlyCloudy;
      case (63, 65, 80, 81, 82):
        return IconRain;
      case (73, 75, 77, 85, 86):
        return IconSnow;
      case (95, 96, 99):
        return IconStorm;
      case (51, 53, 55):
        return IconDrizzle;
      default:
        return IconSunny;
    }
  };

  const getTemperature = (tempCelsius) => {
    switch (temperature) {
      case "Celsius":
        return tempCelsius;
      case "Fahrenheit":
        return (tempCelsius * 9) / 5 + 32;
      case "Kelvin":
        return tempCelsius + 273.15;
      default:
        return tempCelsius;
    }
  };

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
        <img src={getWeatherIcon(data?.current_weather?.weathercode)} alt="" />
        <h1>{getTemperature(data?.current_weather?.temperature)}°</h1>
      </div>
    </div>
  );
}
