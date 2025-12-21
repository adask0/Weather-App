import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWeatherData } from '../hooks/useWeatherData';
import { fetchWeatherData, buildEndpoint, getCityData } from '../services/api';
import { WeatherIconMapper, getWeatherIcon } from '../services/weatherIconMapper';
import { vi } from 'vitest';

global.fetch = vi.fn();

// ============= TESTY DLA API =============

describe('API Services', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('buildEndpoint - powinien zbudować poprawny URL', () => {
    const endpoint = buildEndpoint(52.2297, 21.0122);
    
    expect(endpoint).toContain('latitude=52.2297');
    expect(endpoint).toContain('longitude=21.0122');
    expect(endpoint).toContain('api.open-meteo.com');
    expect(endpoint).toContain('hourly=temperature_2m');
  });

  test('buildEndpoint - powinien użyć domyślnych wartości gdy brak parametrów', () => {
    const endpoint = buildEndpoint(null, null);
    
    expect(endpoint).toContain('latitude=41.3275');
    expect(endpoint).toContain('longitude=19.8187');
  });

  test('getCityData - powinien zwrócić listę miast z endpoints', () => {
    const cities = getCityData();
    
    expect(cities.length).toBeGreaterThan(0);
    expect(cities[0]).toHaveProperty('name');
    expect(cities[0]).toHaveProperty('country');
    expect(cities[0]).toHaveProperty('latitude');
    expect(cities[0]).toHaveProperty('longitude');
    expect(cities[0]).toHaveProperty('endpoint');
  });

  test('getCityData - powinien zawierać Warszawę', () => {
    const cities = getCityData();
    const warsaw = cities.find(city => city.name === 'Warsaw');
    
    expect(warsaw).toBeDefined();
    expect(warsaw.country).toBe('Poland');
    expect(warsaw.latitude).toBe(52.2297);
    expect(warsaw.longitude).toBe(21.0122);
  });

  test('fetchWeatherData - powinien pobrać dane pogodowe', async () => {
    const mockData = {
      current_weather: {
        temperature: 15,
        time: '2024-01-01T12:00:00',
        weathercode: 0
      },
      hourly: {
        temperature_2m: [14, 15, 16],
        relative_humidity_2m: [80, 75, 70]
      }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const data = await fetchWeatherData(52.2297, 21.0122);
    
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('fetchWeatherData - powinien rzucić błąd gdy request się nie powiedzie', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    await expect(fetchWeatherData(52.2297, 21.0122))
      .rejects
      .toThrow('Failed to fetch weather data');
  });
});

// ============= TESTY DLA WEATHER ICON MAPPER (Open/Closed) =============

describe('WeatherIconMapper - Open/Closed Principle', () => {
  test('powinien zwrócić poprawną ikonę dla weather code', () => {
    const mapper = new WeatherIconMapper();
    
    const sunnyIcon = mapper.getIcon(0);
    const rainIcon = mapper.getIcon(61);
    const snowIcon = mapper.getIcon(71);
    
    expect(sunnyIcon).toBeDefined();
    expect(rainIcon).toBeDefined();
    expect(snowIcon).toBeDefined();
  });

  test('powinien zwrócić domyślną ikonę dla nieznanych kodów', () => {
    const mapper = new WeatherIconMapper();
    const defaultIcon = mapper.defaultIcon;
    
    const unknownIcon = mapper.getIcon(999);
    
    expect(unknownIcon).toBe(defaultIcon);
  });

  test('powinien pozwolić na rozszerzenie mapowania (Open for extension)', () => {
    const mapper = new WeatherIconMapper();
    const customIcon = '/path/to/custom-icon.png';
    
    mapper.addMapping(200, customIcon);
    
    expect(mapper.getIcon(200)).toBe(customIcon);
  });

  test('powinien pozwolić na zmianę domyślnej ikony', () => {
    const mapper = new WeatherIconMapper();
    const newDefaultIcon = '/path/to/new-default.png';
    
    mapper.setDefaultIcon(newDefaultIcon);
    
    expect(mapper.getIcon(999)).toBe(newDefaultIcon);
  });

  test('powinien akceptować custom mappings w konstruktorze', () => {
    const customMappings = {
      100: '/custom-icon-1.png',
      101: '/custom-icon-2.png'
    };
    
    const mapper = new WeatherIconMapper(customMappings);
    
    expect(mapper.getIcon(100)).toBe('/custom-icon-1.png');
    expect(mapper.getIcon(101)).toBe('/custom-icon-2.png');
  });
});

// ============= TESTY DLA useWeatherData HOOK (DRY) =============

describe('useWeatherData Hook - DRY Principle', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('powinien zwrócić dane, loading i error states', async () => {
    const mockData = {
      current_weather: { temperature: 20 }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const { result } = renderHook(() => useWeatherData(52.2297, 21.0122));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  test('powinien obsłużyć błędy', async () => {
    fetch.mockResolvedValueOnce({
      ok: false
    });

    const { result } = renderHook(() => useWeatherData(52.2297, 21.0122));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBeDefined();
  });

  test('powinien ponownie pobrać dane gdy zmienią się współrzędne', async () => {
    const mockData1 = { current_weather: { temperature: 20 } };
    const mockData2 = { current_weather: { temperature: 25 } };

    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockData1 })
      .mockResolvedValueOnce({ ok: true, json: async () => mockData2 });

    const { result, rerender } = renderHook(
      ({ lat, lon }) => useWeatherData(lat, lon),
      { initialProps: { lat: 52.2297, lon: 21.0122 } }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData1);
    });

    rerender({ lat: 48.8566, lon: 2.3522 });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData2);
    });

    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

// ============= TESTY POMOCNICZE =============

describe('Helper Functions', () => {
  test('getWeatherIcon - helper function powinien działać', () => {
    const icon = getWeatherIcon(0);
    expect(icon).toBeDefined();
  });

  test('getWeatherIcon - powinien zwrócić różne ikony dla różnych kodów', () => {
    const sunnyIcon = getWeatherIcon(0);
    const rainIcon = getWeatherIcon(61);
    
    expect(sunnyIcon).not.toBe(rainIcon);
  });
});

// ============= TESTY INTEGRACYJNE =============

describe('Integration Tests', () => {
  beforeEach(() => {
    fetch.mockClear();
    fetch.mockReset();
  });

  test('getCityData i buildEndpoint - integracja', () => {
    const cities = getCityData();
    const warsaw = cities.find(c => c.name === 'Warsaw');
    
    expect(warsaw.endpoint).toContain('latitude=52.2297');
    expect(warsaw.endpoint).toContain('longitude=21.0122');
  });

  test('pełny flow: wybór miasta -> fetch danych', async () => {
    const mockData = {
      current_weather: { temperature: 15, weathercode: 0 }
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    const cities = getCityData();
    const warsaw = cities.find(c => c.name === 'Warsaw');
    
    const data = await fetchWeatherData(warsaw.latitude, warsaw.longitude);
    
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('latitude=52.2297')
    );
  });
});