import { useContext, createContext, useState, useEffect } from "react";
import { useLocation } from "react-router";

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useState({
    name: "Tirana",
    country: "Albania",
    latitude: 41.3275,
    longitude: 19.8187,
  });
  const [weatherData, setWeatherData] = useState(null);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        setWeatherData,
        selectedLocation,
        setSelectedLocation,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export const useWeather = () => {
  return useContext(WeatherContext);
};
