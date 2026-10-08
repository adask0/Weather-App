import { useEffect, useState } from "react";
import Search from "./components/Search";
import DayCurve from "./components/DayCurve";
import Week from "./components/Week";
import Icon from "./components/Icon";
import { useForecast } from "./hooks/useForecast";
import {
  dayHours,
  describeCode,
  longDate,
  skyFor,
  toTemp,
  toWind,
  windLabel,
} from "./lib/weather";

const DEFAULT_PLACE = {
  id: 756135,
  name: "Warszawa",
  region: "Mazowieckie, Polska",
  latitude: 52.23,
  longitude: 21.011,
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // brak dostępu do pamięci przeglądarki: aplikacja działa dalej bez zapisu
  }
}

function Toggle({ label, value, options, onChange }) {
  return (
    <div className="toggle" role="group" aria-label={label}>
      {options.map(([key, text]) => (
        <button
          key={key}
          type="button"
          aria-pressed={value === key}
          onClick={() => onChange(key)}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [place, setPlace] = useState(() => load("niebo:place", DEFAULT_PLACE));
  const [tempUnit, setTempUnit] = useState(() => load("niebo:temp", "C"));
  const [windUnit, setWindUnit] = useState(() => load("niebo:wind", "kmh"));
  const [day, setDay] = useState(0);
  const { status, data, retry } = useForecast(place.latitude, place.longitude);

  useEffect(() => save("niebo:place", place), [place]);
  useEffect(() => save("niebo:temp", tempUnit), [tempUnit]);
  useEffect(() => save("niebo:wind", windUnit), [windUnit]);

  const current = data?.current;
  const sky = current
    ? skyFor({
        code: current.weather_code,
        isDay: current.is_day === 1,
        time: current.time,
        sunrise: data.daily.sunrise[0],
        sunset: data.daily.sunset[0],
      })
    : "overcast";

  useEffect(() => {
    document.documentElement.dataset.sky = sky;
  }, [sky]);

  const pickPlace = (next) => {
    setPlace(next);
    setDay(0);
  };

  const now = current ? describeCode(current.weather_code) : null;

  return (
    <div className="page">
      <header className="top">
        <p className="brand">Niebo</p>
        <Search onPick={pickPlace} />
        <div className="units">
          <Toggle
            label="Jednostka temperatury"
            value={tempUnit}
            onChange={setTempUnit}
            options={[
              ["C", "°C"],
              ["F", "°F"],
            ]}
          />
          <Toggle
            label="Jednostka wiatru"
            value={windUnit}
            onChange={setWindUnit}
            options={[
              ["kmh", "km/h"],
              ["ms", "m/s"],
            ]}
          />
        </div>
      </header>

      <main>
        {status === "error" && (
          <div className="state" role="alert">
            <h1>Nie udało się pobrać prognozy dla miejsca {place.name}</h1>
            <p>Serwis pogodowy nie odpowiedział. Sprawdź połączenie z internetem i pobierz prognozę ponownie.</p>
            <button type="button" className="primary" onClick={retry}>
              Pobierz ponownie
            </button>
          </div>
        )}

        {status === "loading" && !data && (
          <div className="state" role="status">
            <h1>{place.name}</h1>
            <p>Pobieram prognozę…</p>
          </div>
        )}

        {data && status !== "error" && (
          <div className={status === "loading" ? "is-refreshing" : undefined}>
            <section className="now" aria-label="Pogoda teraz">
              <div className="now-place">
                <h1>{place.name}</h1>
                {place.region && <p>{place.region}</p>}
                <p className="now-date">
                  {longDate(current.time)}, {current.time.slice(11, 16)}
                </p>
              </div>

              <div className="now-main">
                <p className="now-temp">
                  {toTemp(current.temperature_2m, tempUnit)}
                  <span>°</span>
                </p>
                <p className="now-desc">
                  <Icon kind={now.kind} night={current.is_day !== 1} size={34} />
                  {now.label}
                </p>
              </div>

              <dl className="now-facts">
                <div>
                  <dt>Odczuwalna</dt>
                  <dd>{toTemp(current.apparent_temperature, tempUnit)}°</dd>
                </div>
                <div>
                  <dt>Wiatr</dt>
                  <dd>
                    {toWind(current.wind_speed_10m, windUnit)} {windLabel(windUnit)}
                  </dd>
                </div>
                <div>
                  <dt>Wilgotność</dt>
                  <dd>{current.relative_humidity_2m}%</dd>
                </div>
                <div>
                  <dt>Opad teraz</dt>
                  <dd>{current.precipitation} mm</dd>
                </div>
              </dl>
            </section>

            <DayCurve
              hours={dayHours(data.hourly, day)}
              sunrise={data.daily.sunrise[day]}
              sunset={data.daily.sunset[day]}
              nowTime={day === 0 ? current.time : null}
              tempUnit={tempUnit}
            />

            <Week daily={data.daily} selected={day} onSelect={setDay} tempUnit={tempUnit} />
          </div>
        )}
      </main>

      <footer className="foot">
        <p>
          Dane pogodowe: <a href="https://open-meteo.com/">Open-Meteo</a>. Projekt i kod: Adam
          Trojecki.
        </p>
      </footer>
    </div>
  );
}
