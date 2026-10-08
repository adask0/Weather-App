// Czyste funkcje: zamiana danych z Open-Meteo na to, co pokazuje interfejs.

// Kody pogody WMO -> opis po polsku i rodzaj ikony.
const CODES = [
  [[0], "Bezchmurnie", "clear"],
  [[1], "Przeważnie pogodnie", "clear"],
  [[2], "Częściowe zachmurzenie", "partly"],
  [[3], "Pochmurno", "cloud"],
  [[45, 48], "Mgła", "fog"],
  [[51, 53, 55, 56, 57], "Mżawka", "drizzle"],
  [[61, 63, 80, 81, 66], "Deszcz", "rain"],
  [[65, 82, 67], "Ulewny deszcz", "rain"],
  [[71, 73, 75, 77, 85, 86], "Śnieg", "snow"],
  [[95, 96, 99], "Burza", "storm"],
];

export function describeCode(code) {
  const hit = CODES.find(([codes]) => codes.includes(code));
  return hit ? { label: hit[1], kind: hit[2] } : { label: "Brak danych", kind: "cloud" };
}

// "2026-10-08T14:15" -> 855 (minuty od północy). Czasy z API są już lokalne.
export function minutesOfDay(iso) {
  const [h, m] = iso.slice(11, 16).split(":").map(Number);
  return h * 60 + m;
}

// Kolor nieba dla całej strony: zależy od pory dnia i pogody w wybranym miejscu.
export function skyFor({ code, isDay, time, sunrise, sunset }) {
  const { kind } = describeCode(code);
  if (time && sunrise && sunset) {
    const now = minutesOfDay(time);
    const nearSun =
      Math.abs(now - minutesOfDay(sunrise)) <= 40 ||
      Math.abs(now - minutesOfDay(sunset)) <= 40;
    if (nearSun && (kind === "clear" || kind === "partly")) return "dusk";
  }
  if (!isDay) return "night";
  if (kind === "clear" || kind === "partly") return "day";
  if (kind === "cloud" || kind === "fog") return "overcast";
  return "rain";
}

export function toTemp(celsius, unit) {
  if (celsius == null) return null;
  return Math.round(unit === "F" ? (celsius * 9) / 5 + 32 : celsius);
}

// API zwraca km/h.
export function toWind(kmh, unit) {
  if (kmh == null) return null;
  return unit === "ms" ? Math.round((kmh / 3.6) * 10) / 10 : Math.round(kmh);
}

export const windLabel = (unit) => (unit === "ms" ? "m/s" : "km/h");

// Indeks bieżącej godziny w tablicy hourly.
export function hourIndex(hourlyTimes, currentTime) {
  const key = currentTime.slice(0, 13);
  const i = hourlyTimes.findIndex((t) => t.slice(0, 13) === key);
  return i === -1 ? 0 : i;
}

// 24 godziny wybranego dnia jako lista obiektów.
export function dayHours(hourly, dayIndex) {
  const start = dayIndex * 24;
  return hourly.time.slice(start, start + 24).map((time, i) => ({
    time,
    hour: Number(time.slice(11, 13)),
    temp: hourly.temperature_2m[start + i],
    rain: hourly.precipitation?.[start + i] ?? 0,
    chance: hourly.precipitation_probability?.[start + i] ?? null,
    code: hourly.weather_code?.[start + i],
    isDay: hourly.is_day?.[start + i] === 1,
  }));
}

// Nazwa dnia tygodnia z daty "YYYY-MM-DD", bez przesunięć strefy czasowej.
export function weekday(dateIso, style = "short") {
  const [y, m, d] = dateIso.split("-").map(Number);
  return new Intl.DateTimeFormat("pl-PL", { weekday: style, timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d))
  );
}

export function longDate(dateIso) {
  const [y, m, d] = dateIso.slice(0, 10).split("-").map(Number);
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

// Gładka krzywa przez punkty (Catmull-Rom zamieniony na krzywe Béziera).
export function smoothPath(points) {
  if (points.length < 2) return "";
  let d = `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}
