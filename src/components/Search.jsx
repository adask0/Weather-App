import { useEffect, useId, useRef, useState } from "react";
import { searchPlaces } from "../lib/api";

// Wyszukiwarka miejsc z podpowiedziami (obsługa klawiatury: strzałki, Enter, Esc).
export default function Search({ onPick }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | empty | error
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [locating, setLocating] = useState(false);
  const [notice, setNotice] = useState("");
  const listId = useId();
  const boxRef = useRef(null);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setStatus("idle");
      return;
    }
    const controller = new AbortController();
    setStatus("loading");
    const timer = setTimeout(() => {
      searchPlaces(term, controller.signal)
        .then((places) => {
          setResults(places);
          setActive(0);
          setStatus(places.length ? "idle" : "empty");
        })
        .catch((error) => {
          if (error.name !== "AbortError") setStatus("error");
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const close = (event) => {
      if (!boxRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  const pick = (place) => {
    onPick(place);
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") return setOpen(false);
    if (!results.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === "Enter" && open) {
      event.preventDefault();
      pick(results[active]);
    }
  };

  const locate = () => {
    if (!navigator.geolocation) {
      setNotice("Ta przeglądarka nie udostępnia lokalizacji.");
      return;
    }
    setLocating(true);
    setNotice("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        pick({
          id: "here",
          name: "Twoja lokalizacja",
          region: "",
          latitude: Number(coords.latitude.toFixed(3)),
          longitude: Number(coords.longitude.toFixed(3)),
        });
      },
      () => {
        setLocating(false);
        setNotice("Nie udało się ustalić lokalizacji. Wpisz nazwę miejsca.");
      },
      { timeout: 8000 }
    );
  };

  const showList = open && query.trim().length >= 2;

  return (
    <div className="search" ref={boxRef}>
      <div className="search-row">
        <label className="visually-hidden" htmlFor={`${listId}-input`}>
          Szukaj miejsca
        </label>
        <input
          id={`${listId}-input`}
          className="search-input"
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={
            showList && results[active] ? `${listId}-${results[active].id}` : undefined
          }
          autoComplete="off"
          placeholder="Szukaj miasta lub wsi"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        <button type="button" className="locate" onClick={locate} disabled={locating}>
          {locating ? "Szukam…" : "Użyj mojej lokalizacji"}
        </button>
      </div>

      {showList && (
        <ul className="search-list" id={listId} role="listbox">
          {results.map((place, i) => (
            <li
              key={place.id}
              id={`${listId}-${place.id}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? "is-active" : undefined}
              onPointerEnter={() => setActive(i)}
              onClick={() => pick(place)}
            >
              <span>{place.name}</span>
              <span className="search-region">{place.region}</span>
            </li>
          ))}
          {status === "loading" && !results.length && (
            <li className="search-note">Szukam…</li>
          )}
          {status === "empty" && (
            <li className="search-note">
              Nie znam takiego miejsca. Sprawdź pisownię albo wpisz większą miejscowość obok.
            </li>
          )}
          {status === "error" && (
            <li className="search-note">Wyszukiwarka nie odpowiada. Spróbuj za chwilę.</li>
          )}
        </ul>
      )}
      {notice && (
        <p className="search-notice" role="status">
          {notice}
        </p>
      )}
    </div>
  );
}
