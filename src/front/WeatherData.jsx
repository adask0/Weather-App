import WeatherRight from "../assets/weather-data/WeatherRight";
import DailyDetails from "./DailyDetails";
import DailyForecast from "./DailyForecast";
import TodayBanner from "./TodayBanner";
import "./weatherdata.css";

export default function Header() {
  return (
    <div className="weather-data-container">
      <div className="weather-data-left">
        <TodayBanner />
        <DailyDetails />
        <DailyForecast />
      </div>
      <WeatherRight />
    </div>
  );
}
