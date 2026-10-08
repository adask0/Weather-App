import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  dayHours,
  describeCode,
  hourIndex,
  minutesOfDay,
  skyFor,
  smoothPath,
  toTemp,
  toWind,
  weekday,
} from "../lib/weather";
import { fetchForecast, forecastUrl, searchPlaces, searchUrl } from "../lib/api";

describe("kody pogody", () => {
  test("zamienia kod WMO na opis i rodzaj ikony", () => {
    expect(describeCode(0)).toEqual({ label: "Bezchmurnie", kind: "clear" });
    expect(describeCode(63).kind).toBe("rain");
    expect(describeCode(95).kind).toBe("storm");
  });

  test("nieznany kod nie wywraca interfejsu", () => {
    expect(describeCode(999).kind).toBe("cloud");
  });
});

describe("kolor nieba", () => {
  const base = { time: "2026-10-08T13:00", sunrise: "2026-10-08T06:50", sunset: "2026-10-08T17:55" };

  test("pogodny dzień", () => {
    expect(skyFor({ ...base, code: 1, isDay: true })).toBe("day");
  });
  test("noc", () => {
    expect(skyFor({ ...base, time: "2026-10-08T23:00", code: 0, isDay: false })).toBe("night");
  });
  test("okolice zachodu przy czystym niebie", () => {
    expect(skyFor({ ...base, time: "2026-10-08T17:40", code: 0, isDay: true })).toBe("dusk");
  });
  test("deszcz w dzień", () => {
    expect(skyFor({ ...base, code: 63, isDay: true })).toBe("rain");
  });
  test("zachmurzenie przy zachodzie zostaje szare", () => {
    expect(skyFor({ ...base, time: "2026-10-08T17:40", code: 3, isDay: true })).toBe("overcast");
  });
});

describe("jednostki", () => {
  test("temperatura", () => {
    expect(toTemp(21.4, "C")).toBe(21);
    expect(toTemp(0, "F")).toBe(32);
    expect(toTemp(0, "C")).toBe(0);
    expect(toTemp(null, "C")).toBeNull();
  });

  test("wiatr z km/h na m/s", () => {
    expect(toWind(18.7, "kmh")).toBe(19);
    expect(toWind(18, "ms")).toBe(5);
  });
});

describe("czas", () => {
  test("minuty od północy", () => {
    expect(minutesOfDay("2026-10-08T14:15")).toBe(855);
  });

  test("indeks bieżącej godziny", () => {
    const times = ["2026-10-08T13:00", "2026-10-08T14:00", "2026-10-08T15:00"];
    expect(hourIndex(times, "2026-10-08T14:15")).toBe(1);
    expect(hourIndex(times, "2030-01-01T00:00")).toBe(0);
  });

  test("dzień tygodnia nie zależy od strefy czasowej", () => {
    expect(weekday("2026-10-08", "long")).toBe("czwartek");
  });

  test("wycina 24 godziny wybranego dnia", () => {
    const hourly = {
      time: Array.from({ length: 48 }, (_, i) =>
        `2026-10-0${8 + Math.floor(i / 24)}T${String(i % 24).padStart(2, "0")}:00`
      ),
      temperature_2m: Array.from({ length: 48 }, (_, i) => i),
      precipitation: Array.from({ length: 48 }, () => 0),
    };
    const second = dayHours(hourly, 1);
    expect(second).toHaveLength(24);
    expect(second[0]).toMatchObject({ hour: 0, temp: 24, rain: 0 });
  });
});

describe("krzywa", () => {
  test("zaczyna się w pierwszym punkcie i kończy w ostatnim", () => {
    const d = smoothPath([[0, 0], [10, 5], [20, 0]]);
    expect(d.startsWith("M0.0,0.0")).toBe(true);
    expect(d.endsWith("20.0,0.0")).toBe(true);
  });

  test("jeden punkt to brak linii", () => {
    expect(smoothPath([[0, 0]])).toBe("");
  });
});

describe("API", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  test("adres prognozy zawiera współrzędne i lokalną strefę", () => {
    const url = forecastUrl(52.23, 21.011);
    expect(url).toContain("latitude=52.23");
    expect(url).toContain("longitude=21.011");
    expect(url).toContain("timezone=auto");
    expect(url).toContain("wind_speed_unit=kmh");
  });

  test("adres wyszukiwarki koduje polskie znaki", () => {
    expect(searchUrl("Łódź")).toContain("name=%C5%81%C3%B3d%C5%BA");
  });

  test("zwraca dane prognozy", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ current: { temperature_2m: 15 } }) });
    const data = await fetchForecast(52.23, 21.011);
    expect(data.current.temperature_2m).toBe(15);
  });

  test("błąd serwera kończy się wyjątkiem", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 503 });
    await expect(fetchForecast(52.23, 21.011)).rejects.toThrow("503");
  });

  test("wyszukiwarka zwraca pustą listę, gdy nic nie znaleziono", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    expect(await searchPlaces("xyzxyz")).toEqual([]);
  });

  test("wyszukiwarka skleja region i kraj", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [{ id: 1, name: "Kraków", admin1: "Małopolskie", country: "Polska", latitude: 50.06, longitude: 19.94 }],
      }),
    });
    const [place] = await searchPlaces("Krak");
    expect(place.region).toBe("Małopolskie, Polska");
  });
});
