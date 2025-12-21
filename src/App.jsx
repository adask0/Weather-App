import "./App.css";
import { WeatherProviders } from "./context/WeatherContexts";
import Header from "./front/Header";
import SearchBar from "./front/SearchBar";
import WeatherData from "./front/WeatherData";

function App() {
  return (
    <WeatherProviders>
      <Header />
      <SearchBar />
      <WeatherData />
    </WeatherProviders>
  );
}

export default App;
