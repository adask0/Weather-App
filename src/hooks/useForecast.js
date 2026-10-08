import { useCallback, useEffect, useState } from "react";
import { fetchForecast } from "../lib/api";

// Jedno pobranie prognozy na miejsce. Stany: loading, ready, error.
export function useForecast(latitude, longitude) {
  const [state, setState] = useState({ status: "loading", data: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, status: "loading", error: null }));
    fetchForecast(latitude, longitude, controller.signal)
      .then((data) => setState({ status: "ready", data, error: null }))
      .catch((error) => {
        if (error.name === "AbortError") return;
        setState({ status: "error", data: null, error });
      });
    return () => controller.abort();
  }, [latitude, longitude, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
