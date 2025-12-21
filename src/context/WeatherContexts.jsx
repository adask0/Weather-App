import React, { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(() => {
    if (localStorage.getItem("selectedCity")) {
      return JSON.parse(localStorage.getItem("selectedCity"));
    }
    return {
      name: "Warsaw",
      country: "Poland",
      latitude: 52.2297,
      longitude: 21.0122,
    };
  });

  const saveSelectedLocation = (location) => {
    setSelectedLocation(location);
    localStorage.setItem("selectedCity", JSON.stringify(location));
  };

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        saveSelectedLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within LocationProvider");
  }
  return context;
};

const TemperatureContext = createContext();

export const TemperatureProvider = ({ children }) => {
  const [temperature, setTemperature] = useState("Celsius");

  const getTemperature = (tempCelsius) => {
    if (!tempCelsius) return "...";
    switch (temperature) {
      case "Celsius":
        return Math.round(tempCelsius);
      case "Fahrenheit":
        return Math.round(((tempCelsius * 9) / 5 + 32) * 100) / 100;
      case "Kelvin":
        return Math.round((tempCelsius + 273.15) * 100) / 100;
      default:
        return Math.round(tempCelsius);
    }
  };

  const getTemperatureUnit = () => {
    const units = {
      Celsius: "°C",
      Fahrenheit: "°F",
      Kelvin: "°K",
    };
    return units[temperature] || "°C";
  };

  return (
    <TemperatureContext.Provider
      value={{
        temperature,
        setTemperature,
        getTemperature,
        getTemperatureUnit,
      }}
    >
      {children}
    </TemperatureContext.Provider>
  );
};

export const useTemperature = () => {
  const context = useContext(TemperatureContext);
  if (!context) {
    throw new Error("useTemperature must be used within TemperatureProvider");
  }
  return context;
};

const DayContext = createContext();

export const DayProvider = ({ children }) => {
  const daysOptions = [
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
    { value: 7, label: "Sunday" },
  ];

  const date = new Date();
  const [selectedDay, setSelectedDay] = useState(
    daysOptions[date.getDay() === 0 ? 6 : date.getDay() - 1]
  );

  return (
    <DayContext.Provider
      value={{
        selectedDay,
        setSelectedDay,
        daysOptions,
      }}
    >
      {children}
    </DayContext.Provider>
  );
};

export const useDay = () => {
  const context = useContext(DayContext);
  if (!context) {
    throw new Error("useDay must be used within DayProvider");
  }
  return context;
};

export const WeatherProviders = ({ children }) => {
  return (
    <LocationProvider>
      <TemperatureProvider>
        <DayProvider>{children}</DayProvider>
      </TemperatureProvider>
    </LocationProvider>
  );
};