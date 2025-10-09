import { useContext, createContext, useState, useEffect } from "react";
import { useLocation } from "react-router";

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const daysOptions = [
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
    { value: 7, label: "Sunday" },
  ];
  const [selectedLocation, setSelectedLocation] = useState(() => {
    if (localStorage.getItem("selectedCity")) {
      return JSON.parse(localStorage.getItem("selectedCity"));
    } else {
      return {
        name: "Warsaw",
        country: "Poland",
        latitude: 52.2297,
        longitude: 21.0122,
      };
    }
  });

  const [weatherData, setWeatherData] = useState(null);

  const [temperature, setTemperature] = useState("Celsius");

  const date = new Date();

  const [selectedDay, setSelectedDay] = useState(
    daysOptions[date.getDay() === 0 ? 6 : date.getDay() - 1]
  );

  const getTemperature = (tempCelsius) => {
    switch (temperature) {
      case "Celsius":
        return tempCelsius;
      case "Fahrenheit":
        return Math.round(((tempCelsius * 9) / 5 + 32) * 100) / 100;
      case "Kelvin":
        return Math.round((tempCelsius + 273.15) * 100) / 100;
      default:
        return tempCelsius;
    }
  };

  const saveSelectedLocation = (location) => {
    setSelectedLocation(location);
    localStorage.setItem("selectedCity", JSON.stringify(location));
  };

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        setWeatherData,
        selectedLocation,
        setSelectedLocation,
        temperature,
        setTemperature,
        selectedDay,
        setSelectedDay,
        daysOptions,
        getTemperature,
        saveSelectedLocation,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export const useWeather = () => {
  return useContext(WeatherContext);
};
