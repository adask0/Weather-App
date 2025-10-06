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
  const [selectedLocation, setSelectedLocation] = useState({
    name: "Tirana",
    country: "Albania",
    latitude: 41.3275,
    longitude: 19.8187,
  });
  const [weatherData, setWeatherData] = useState(null);

  const [temperature, setTemperature] = useState("Celsius");

  const date = new Date();

  const [selectedDay, setSelectedDay] = useState(
    daysOptions[date.getDay() === 0 ? 6 : date.getDay() - 1]
  );

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
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export const useWeather = () => {
  return useContext(WeatherContext);
};
