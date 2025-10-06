import WeatherRight from "../assets/weather-data/WeatherRight";
import TodayBanner from "./TodayBanner";

export default function Header() {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
      <div style={{ flex: 1 }}>
        <TodayBanner />
      </div>
      <WeatherRight />
    </div>
  );
}
