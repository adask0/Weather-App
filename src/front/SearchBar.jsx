import React from "react";
import "./searchbar.css";
import { useEffect } from "react";
import { useWeather } from "../context/WeatherContext";
import { getCityData, buildEndpoint, fetchWeatherData } from "../services/api";

export default function SearchBar() {
  const { selectedLocation, setSelectedLocation, saveSelectedLocation } =
    useWeather();
  const cities = getCityData();
  const [filteredCities, setFilteredCities] = React.useState("");
  const [searchCity, setSearchCity] = React.useState("");
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCitySearch = (e) => {
    setSearchCity(e.target.value);
    if (e.target.value) {
      const filteredCities = cities.filter((city) =>
        city.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredCities(filteredCities);
    } else {
      setFilteredCities(cities);
    }
  };

  const handleCityPick = (city) => {
    setSelectedLocation(city);
    setFilteredCities("");
    setSearchCity(city.name);
    buildEndpoint(city.latitude, city.longitude);
    fetchWeatherData(city.latitude, city.longitude);
    saveSelectedLocation(city);
  };

  useEffect(() => {
    const closeSuggestions = (e) => {
      if (!e.target.classList.contains("search-input")) {
        setFilteredCities([]);
      }
    };
    document.addEventListener("click", closeSuggestions);
    return () => {
      document.removeEventListener("click", closeSuggestions);
    };
  }, []);

  return (
    <div className="search-bar-container">
      <h1>How's the sky looking today?</h1>
      <div className="search-bar">
        <div className="search-bar-results">
          {" "}
          <input
            type="text"
            value={searchCity}
            onChange={handleCitySearch}
            placeholder="Search for a place..."
            className="search-input"
          />
          {filteredCities.length > 0 && (
            <div className="city-suggestions">
              {!isMobile
                ? filteredCities.slice(0, 10).map((city) => (
                    <div
                      key={city.name}
                      onClick={() => handleCityPick(city)}
                      className="city-suggestion"
                    >
                      {city.name}, {city.country}
                    </div>
                  ))
                : filteredCities.slice(0, 5).map((city) => (
                    <div
                      key={city.name}
                      onClick={() => handleCityPick(city)}
                      className="city-suggestion"
                    >
                      {city.name}, {city.country}
                    </div>
                  ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
