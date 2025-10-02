import { fetchWeatherApi } from "openmeteo";

const params = {
  latitude: 52.52,
  longitude: 13.41,
  hourly: [
    "temperature_2m",
    "relative_humidity_2m",
    "precipitation",
    "apparent_temperature",
    "wind_speed_120m",
    "rain",
    "snowfall",
    "surface_pressure",
    "visibility",
    "wind_gusts_10m",
    "is_day",
  ],
  current: [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "wind_speed_10m",
    "rain",
    "snowfall",
    "surface_pressure",
  ],
};
const url = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(url, params);

const response = responses[0];

const latitude = response.latitude();
const longitude = response.longitude();
const elevation = response.elevation();
const utcOffsetSeconds = response.utcOffsetSeconds();

console.log(
  `\nCoordinates: ${latitude}°N ${longitude}°E`,
  `\nElevation: ${elevation}m asl`,
  `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`
);

const current = response.current()!;
const hourly = response.hourly()!;

const weatherData = {
  current: {
    time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
    temperature_2m: current.variables(0)!.value(),
    relative_humidity_2m: current.variables(1)!.value(),
    apparent_temperature: current.variables(2)!.value(),
    wind_speed_10m: current.variables(3)!.value(),
    rain: current.variables(4)!.value(),
    snowfall: current.variables(5)!.value(),
    surface_pressure: current.variables(6)!.value(),
  },
  hourly: {
    time: [
      ...Array(
        (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval()
      ),
    ].map(
      (_, i) =>
        new Date(
          (Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) *
            1000
        )
    ),
    temperature_2m: hourly.variables(0)!.valuesArray(),
    relative_humidity_2m: hourly.variables(1)!.valuesArray(),
    precipitation: hourly.variables(2)!.valuesArray(),
    apparent_temperature: hourly.variables(3)!.valuesArray(),
    wind_speed_120m: hourly.variables(4)!.valuesArray(),
    rain: hourly.variables(5)!.valuesArray(),
    snowfall: hourly.variables(6)!.valuesArray(),
    surface_pressure: hourly.variables(7)!.valuesArray(),
    visibility: hourly.variables(8)!.valuesArray(),
    wind_gusts_10m: hourly.variables(9)!.valuesArray(),
    is_day: hourly.variables(10)!.valuesArray(),
  },
};

console.log(
  `\nCurrent time: ${weatherData.current.time}`,
  `\nCurrent temperature_2m: ${weatherData.current.temperature_2m}`,
  `\nCurrent relative_humidity_2m: ${weatherData.current.relative_humidity_2m}`,
  `\nCurrent apparent_temperature: ${weatherData.current.apparent_temperature}`,
  `\nCurrent wind_speed_10m: ${weatherData.current.wind_speed_10m}`,
  `\nCurrent rain: ${weatherData.current.rain}`,
  `\nCurrent snowfall: ${weatherData.current.snowfall}`,
  `\nCurrent surface_pressure: ${weatherData.current.surface_pressure}`
);
console.log("\nHourly data", weatherData.hourly);
