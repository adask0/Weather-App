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

export const getCityData = () => {
    const cities = [
        // Europe - (major capitals / most European countries)
        { name: 'Tirana', country: 'Albania', latitude: 41.3275, longitude: 19.8187 },
        { name: 'Andorra la Vella', country: 'Andorra', latitude: 42.5063, longitude: 1.5218 },
        { name: 'Yerevan', country: 'Armenia', latitude: 40.1792, longitude: 44.4991 },
        { name: 'Vienna', country: 'Austria', latitude: 48.2082, longitude: 16.3738 },
        { name: 'Baku', country: 'Azerbaijan', latitude: 40.4093, longitude: 49.8671 },
        { name: 'Minsk', country: 'Belarus', latitude: 53.9045, longitude: 27.5615 },
        { name: 'Brussels', country: 'Belgium', latitude: 50.8503, longitude: 4.3517 },
        { name: 'Sarajevo', country: 'Bosnia and Herzegovina', latitude: 43.8563, longitude: 18.4131 },
        { name: 'Sofia', country: 'Bulgaria', latitude: 42.6977, longitude: 23.3219 },
        { name: 'Zagreb', country: 'Croatia', latitude: 45.8150, longitude: 15.9819 },
        { name: 'Nicosia', country: 'Cyprus', latitude: 35.1856, longitude: 33.3823 },
        { name: 'Prague', country: 'Czechia', latitude: 50.0755, longitude: 14.4378 },
        { name: 'Copenhagen', country: 'Denmark', latitude: 55.6761, longitude: 12.5683 },
        { name: 'Tallinn', country: 'Estonia', latitude: 59.4370, longitude: 24.7536 },
        { name: 'Helsinki', country: 'Finland', latitude: 60.1699, longitude: 24.9384 },
        { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522 },
        { name: 'Tbilisi', country: 'Georgia', latitude: 41.7151, longitude: 44.8271 },
        { name: 'Berlin', country: 'Germany', latitude: 52.5200, longitude: 13.4050 },
        { name: 'Athens', country: 'Greece', latitude: 37.9838, longitude: 23.7275 },
        { name: 'Budapest', country: 'Hungary', latitude: 47.4979, longitude: 19.0402 },
        { name: 'Reykjavik', country: 'Iceland', latitude: 64.1466, longitude: -21.9426 },
        { name: 'Dublin', country: 'Ireland', latitude: 53.3498, longitude: -6.2603 },
        { name: 'Rome', country: 'Italy', latitude: 41.9028, longitude: 12.4964 },
        { name: 'Pristina', country: 'Kosovo', latitude: 42.6629, longitude: 21.1655 },
        { name: 'Riga', country: 'Latvia', latitude: 56.9496, longitude: 24.1052 },
        { name: 'Vaduz', country: 'Liechtenstein', latitude: 47.1410, longitude: 9.5209 },
        { name: 'Vilnius', country: 'Lithuania', latitude: 54.6872, longitude: 25.2797 },
        { name: 'Luxembourg', country: 'Luxembourg', latitude: 49.6116, longitude: 6.1319 },
        { name: 'Valletta', country: 'Malta', latitude: 35.8989, longitude: 14.5146 },
        { name: 'Chisinau', country: 'Moldova', latitude: 47.0105, longitude: 28.8638 },
        { name: 'Monaco', country: 'Monaco', latitude: 43.7384, longitude: 7.4246 },
        { name: 'Podgorica', country: 'Montenegro', latitude: 42.4411, longitude: 19.2636 },
        { name: 'Amsterdam', country: 'Netherlands', latitude: 52.3676, longitude: 4.9041 },
        { name: 'Skopje', country: 'North Macedonia', latitude: 41.9973, longitude: 21.4280 },
        { name: 'Oslo', country: 'Norway', latitude: 59.9139, longitude: 10.7522 },
        { name: 'Warsaw', country: 'Poland', latitude: 52.2297, longitude: 21.0122 },
        { name: 'Lisbon', country: 'Portugal', latitude: 38.7223, longitude: -9.1393 },
        { name: 'Bucharest', country: 'Romania', latitude: 44.4268, longitude: 26.1025 },
        { name: 'Moscow', country: 'Russia', latitude: 55.7558, longitude: 37.6173 },
        { name: 'San Marino', country: 'San Marino', latitude: 43.9424, longitude: 12.4578 },
        { name: 'Belgrade', country: 'Serbia', latitude: 44.7866, longitude: 20.4489 },
        { name: 'Bratislava', country: 'Slovakia', latitude: 48.1486, longitude: 17.1077 },
        { name: 'Ljubljana', country: 'Slovenia', latitude: 46.0569, longitude: 14.5058 },
        { name: 'Madrid', country: 'Spain', latitude: 40.4168, longitude: -3.7038 },
        { name: 'Stockholm', country: 'Sweden', latitude: 59.3293, longitude: 18.0686 },
        { name: 'Bern', country: 'Switzerland', latitude: 46.9479, longitude: 7.4474 },
        { name: 'Ankara', country: 'Turkey', latitude: 39.9334, longitude: 32.8597 },
        { name: 'Kyiv', country: 'Ukraine', latitude: 50.4501, longitude: 30.5234 },
        { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },

        // North America (USA, Canada, Mexico)
        { name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060 },
        { name: 'Los Angeles', country: 'United States', latitude: 34.0522, longitude: -118.2437 },
        { name: 'Chicago', country: 'United States', latitude: 41.8781, longitude: -87.6298 },
        { name: 'Washington', country: 'United States', latitude: 38.9072, longitude: -77.0369 },
        { name: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832 },
        { name: 'Ottawa', country: 'Canada', latitude: 45.4215, longitude: -75.6972 },
        { name: 'Mexico City', country: 'Mexico', latitude: 19.4326, longitude: -99.1332 },

        // South America (capitals + 3 Brazilian cities as requested)
        { name: 'Brasília', country: 'Brazil', latitude: -15.7939, longitude: -47.8828 },
        { name: 'São Paulo', country: 'Brazil', latitude: -23.5505, longitude: -46.6333 },
        { name: 'Rio de Janeiro', country: 'Brazil', latitude: -22.9068, longitude: -43.1729 },
        { name: 'Buenos Aires', country: 'Argentina', latitude: -34.6037, longitude: -58.3816 },
        { name: 'La Paz', country: 'Bolivia', latitude: -16.4897, longitude: -68.1193 },
        { name: 'Santiago', country: 'Chile', latitude: -33.4489, longitude: -70.6693 },
        { name: 'Bogotá', country: 'Colombia', latitude: 4.7110, longitude: -74.0721 },
        { name: 'Quito', country: 'Ecuador', latitude: -0.1807, longitude: -78.4678 },
        { name: 'Georgetown', country: 'Guyana', latitude: 6.8013, longitude: -58.1551 },
        { name: 'Asunción', country: 'Paraguay', latitude: -25.2637, longitude: -57.5759 },
        { name: 'Lima', country: 'Peru', latitude: -12.0464, longitude: -77.0428 },
        { name: 'Paramaribo', country: 'Suriname', latitude: 5.8520, longitude: -55.2038 },
        { name: 'Montevideo', country: 'Uruguay', latitude: -34.9011, longitude: -56.1645 },
        { name: 'Caracas', country: 'Venezuela', latitude: 10.4806, longitude: -66.9036 },

        // Asia (about half, varied selection across the continent)
        { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
        { name: 'Beijing', country: 'China', latitude: 39.9042, longitude: 116.4074 },
        { name: 'New Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090 },
        { name: 'Islamabad', country: 'Pakistan', latitude: 33.6844, longitude: 73.0479 },
        { name: 'Dhaka', country: 'Bangladesh', latitude: 23.8103, longitude: 90.4125 },
        { name: 'Kathmandu', country: 'Nepal', latitude: 27.7172, longitude: 85.3240 },
        { name: 'Thimphu', country: 'Bhutan', latitude: 27.4728, longitude: 89.6390 },
        { name: 'Colombo', country: 'Sri Lanka', latitude: 6.9271, longitude: 79.8612 },
        { name: 'Naypyidaw', country: 'Myanmar', latitude: 19.7633, longitude: 96.0785 },
        { name: 'Bangkok', country: 'Thailand', latitude: 13.7563, longitude: 100.5018 },
        { name: 'Hanoi', country: 'Vietnam', latitude: 21.0278, longitude: 105.8342 },
        { name: 'Phnom Penh', country: 'Cambodia', latitude: 11.5564, longitude: 104.9282 },
        { name: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.1390, longitude: 101.6869 },
        { name: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
        { name: 'Jakarta', country: 'Indonesia', latitude: -6.2088, longitude: 106.8456 },
        { name: 'Manila', country: 'Philippines', latitude: 14.5995, longitude: 120.9842 },
        { name: 'Riyadh', country: 'Saudi Arabia', latitude: 24.7136, longitude: 46.6753 },
        { name: 'Tehran', country: 'Iran', latitude: 35.6892, longitude: 51.3890 },
        { name: 'Baghdad', country: 'Iraq', latitude: 33.3152, longitude: 44.3661 },
        { name: 'Kabul', country: 'Afghanistan', latitude: 34.5553, longitude: 69.2075 },
        { name: 'Jerusalem', country: 'Israel', latitude: 31.7683, longitude: 35.2137 },
        { name: 'Amman', country: 'Jordan', latitude: 31.9454, longitude: 35.9284 },
        { name: 'Beirut', country: 'Lebanon', latitude: 33.8938, longitude: 35.5018 },
        { name: 'Muscat', country: 'Oman', latitude: 23.5880, longitude: 58.3829 },

        // Africa
        { name: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357 },
        { name: 'Pretoria', country: 'South Africa', latitude: -25.7479, longitude: 28.2293 },

        // Oceania
        { name: 'Canberra', country: 'Australia', latitude: -35.2809, longitude: 149.1300 },
        { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093 },
        { name: 'Melbourne', country: 'Australia', latitude: -37.8136, longitude: 144.9631 },
        { name: 'Wellington', country: 'New Zealand', latitude: -41.2865, longitude: 174.7762 },
    ].map((c) => ({
        ...c,
        endpoint: buildEndpoint(c.latitude, c.longitude),
    }));

    return cities;
};
