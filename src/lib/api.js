// Open-Meteo: darmowe API pogodowe, bez klucza.

export function forecastUrl(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,is_day",
    hourly: "temperature_2m,precipitation_probability,precipitation,weather_code,is_day",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset",
    timezone: "auto",
    forecast_days: "7",
    wind_speed_unit: "kmh",
  });
  return `https://api.open-meteo.com/v1/forecast?${params}`;
}

export function searchUrl(query) {
  const params = new URLSearchParams({
    name: query,
    count: "6",
    language: "pl",
    format: "json",
  });
  return `https://geocoding-api.open-meteo.com/v1/search?${params}`;
}

async function getJson(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Serwer pogody odpowiedział kodem ${response.status}`);
  return response.json();
}

export function fetchForecast(latitude, longitude, signal) {
  return getJson(forecastUrl(latitude, longitude), signal);
}

export async function searchPlaces(query, signal) {
  const data = await getJson(searchUrl(query), signal);
  return (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    region: [r.admin1, r.country].filter(Boolean).join(", "),
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}
