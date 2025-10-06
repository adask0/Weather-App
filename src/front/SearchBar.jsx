import React from "react";
import "./searchbar.css";
import { useWeather } from "../context/WeatherContext";
import { getCityData, buildEndpoint, fetchWeatherData } from "../services/api";

export default function SearchBar() {
  const { selectedLocation, setSelectedLocation } = useWeather();
  const cities = getCityData();
  const [filteredCities, setFilteredCities] = React.useState("");
  const [searchCity, setSearchCity] = React.useState("");

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
    console.log("Selected city:", city);
    buildEndpoint(city.latitude, city.longitude);
    fetchWeatherData(city.latitude, city.longitude);
    console.log("Endpoint:", buildEndpoint(city.latitude, city.longitude));
  };

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
              {filteredCities.slice(0, 10).map((city) => (
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

        <button className="search-button">Search</button>
      </div>
    </div>
  );
}
