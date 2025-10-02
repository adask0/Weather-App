import WeatherRight from "../assets/weather-data/WeatherRight";

export default function Header() {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ flex: 1 }}></div>
      <WeatherRight />
    </div>
  );
}
