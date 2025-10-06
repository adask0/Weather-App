import "./App.css";
import { WeatherProvider } from "./context/WeatherContext";
import Header from "./front/Header";
import SearchBar from "./front/SearchBar";
import WeatherData from "./front/WeatherData";

function App() {
  return (
    <WeatherProvider>
      <Header />
      <SearchBar />
      <WeatherData />
    </WeatherProvider>
  );
}

export default App;
