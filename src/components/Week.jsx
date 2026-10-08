import Icon from "./Icon";
import { describeCode, toTemp, weekday } from "../lib/weather";

// Siedem dni. Pasek pokazuje, gdzie zakres temperatur dnia leży na tle całego tygodnia.
export default function Week({ daily, selected, onSelect, tempUnit }) {
  const low = Math.min(...daily.temperature_2m_min);
  const high = Math.max(...daily.temperature_2m_max);
  const span = Math.max(high - low, 1);

  return (
    <ol className="week" aria-label="Prognoza na 7 dni">
      {daily.time.map((date, i) => {
        const { label, kind } = describeCode(daily.weather_code[i]);
        const min = daily.temperature_2m_min[i];
        const max = daily.temperature_2m_max[i];
        return (
          <li key={date}>
            <button
              type="button"
              className="week-day"
              aria-pressed={i === selected}
              onClick={() => onSelect(i)}
            >
              <span className="week-name">{i === 0 ? "Dziś" : weekday(date, "long")}</span>
              <Icon kind={kind} size={26} label={label} />
              <span className="week-range" aria-hidden="true">
                <span
                  style={{
                    left: `${((min - low) / span) * 100}%`,
                    right: `${((high - max) / span) * 100}%`,
                  }}
                />
              </span>
              <span className="week-temps">
                <span className="visually-hidden">od </span>
                <span className="week-min">{toTemp(min, tempUnit)}°</span>
                <span className="visually-hidden"> do </span>
                <span>{toTemp(max, tempUnit)}°</span>
              </span>
              <span className="week-rain">
                {daily.precipitation_sum[i] > 0
                  ? `${daily.precipitation_sum[i].toFixed(1)} mm`
                  : "sucho"}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
