import { useEffect, useMemo, useRef, useState } from "react";
import { describeCode, minutesOfDay, smoothPath, toTemp } from "../lib/weather";

const W = 960;
const H = 280;
const PAD = { left: 28, right: 28, top: 44, bottom: 70 };
const BAR_BASE = H - 34;
const BAR_MAX = 30;

const xAt = (hourFloat) => PAD.left + (hourFloat / 23) * (W - PAD.left - PAD.right);

// Doba jako jedna linia: temperatura, opad, noc i dzień, znacznik "teraz".
export default function DayCurve({ hours, sunrise, sunset, nowTime, tempUnit }) {
  const nowHour = nowTime ? minutesOfDay(nowTime) / 60 : null;
  const [active, setActive] = useState(() => (nowHour != null ? Math.floor(nowHour) : 13));

  const scrollRef = useRef(null);
  const firstTime = hours[0]?.time;

  useEffect(() => {
    const start = nowHour != null ? Math.floor(nowHour) : 13;
    setActive(start);
    // na wąskim ekranie wykres się przewija: ustaw widok na wybraną godzinę
    const box = scrollRef.current;
    if (box && box.scrollWidth > box.clientWidth) {
      box.scrollLeft = (start / 23) * box.scrollWidth - box.clientWidth / 2;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstTime]);

  const geometry = useMemo(() => {
    const temps = hours.map((h) => h.temp);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const span = Math.max(max - min, 4);
    const yAt = (t) =>
      PAD.top + (1 - (t - min) / span) * (H - PAD.top - PAD.bottom);
    const points = hours.map((h, i) => [xAt(i), yAt(h.temp)]);
    const maxRain = Math.max(1.5, ...hours.map((h) => h.rain));
    return {
      yAt,
      points,
      line: smoothPath(points),
      maxRain,
      minIndex: temps.indexOf(min),
      maxIndex: temps.indexOf(max),
    };
  }, [hours]);

  if (!hours.length) return null;

  const riseX = sunrise ? xAt(minutesOfDay(sunrise) / 60) : PAD.left;
  const setX = sunset ? xAt(minutesOfDay(sunset) / 60) : W - PAD.right;
  const area = `${geometry.line} L${W - PAD.right},${BAR_BASE} L${PAD.left},${BAR_BASE} Z`;
  const picked = hours[Math.min(active, hours.length - 1)];
  const [px, py] = geometry.points[Math.min(active, hours.length - 1)];

  const move = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - box.left) / box.width;
    const hourFloat = ((ratio * W - PAD.left) / (W - PAD.left - PAD.right)) * 23;
    setActive(Math.max(0, Math.min(hours.length - 1, Math.round(hourFloat))));
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") setActive((i) => Math.min(hours.length - 1, i + 1));
    else if (event.key === "ArrowLeft") setActive((i) => Math.max(0, i - 1));
    else return;
    event.preventDefault();
  };

  // etykieta skrajnej temperatury nie może wejść na napis "teraz"
  const extremeX = (i) => {
    let x = xAt(i);
    if (nowHour != null && Math.abs(x - xAt(nowHour)) < 46) {
      x += x >= xAt(nowHour) ? 40 : -40;
    }
    return Math.max(PAD.left + 14, Math.min(W - PAD.right - 14, x));
  };

  const label = (i) => `${toTemp(hours[i].temp, tempUnit)}°`;

  return (
    <section className="curve" aria-label="Przebieg doby godzina po godzinie">
      <p className="curve-readout" aria-live="polite">
        <strong>
          {String(picked.hour).padStart(2, "0")}:00
        </strong>
        <span>{toTemp(picked.temp, tempUnit)}°</span>
        <span>{describeCode(picked.code).label.toLowerCase()}</span>
        <span>
          {picked.rain > 0 ? `opad ${picked.rain.toFixed(1)} mm` : "bez opadu"}
          {picked.chance != null ? `, szansa ${picked.chance}%` : ""}
        </span>
      </p>

      <div className="curve-scroll" ref={scrollRef}>
        <svg
          className="curve-svg"
          viewBox={`0 0 ${W} ${H}`}
          role="slider"
          tabIndex={0}
          aria-label="Godzina"
          aria-valuemin={0}
          aria-valuemax={23}
          aria-valuenow={picked.hour}
          aria-valuetext={`${picked.hour}:00, ${toTemp(picked.temp, tempUnit)} stopni`}
          onPointerMove={move}
          onPointerDown={move}
          onKeyDown={onKeyDown}
        >
          {/* noc przed wschodem i po zachodzie */}
          <rect className="curve-night" x={PAD.left} y={PAD.top - 20} width={Math.max(0, riseX - PAD.left)} height={BAR_BASE - PAD.top + 20} />
          <rect className="curve-night" x={setX} y={PAD.top - 20} width={Math.max(0, W - PAD.right - setX)} height={BAR_BASE - PAD.top + 20} />

          <path className="curve-area" d={area} />

          {hours.map((h, i) =>
            h.rain > 0 ? (
              <rect
                key={h.time}
                className="curve-rain"
                x={xAt(i) - 7}
                width="14"
                rx="3"
                y={BAR_BASE - Math.max(3, (h.rain / geometry.maxRain) * BAR_MAX)}
                height={Math.max(3, (h.rain / geometry.maxRain) * BAR_MAX)}
              />
            ) : null
          )}

          <line className="curve-base" x1={PAD.left} x2={W - PAD.right} y1={BAR_BASE} y2={BAR_BASE} />
          <path className="curve-line" d={geometry.line} />

          {[geometry.maxIndex, geometry.minIndex].map((i, n) => (
            <text
              key={n}
              className="curve-extreme"
              x={extremeX(i)}
              y={geometry.points[i][1] + (n === 0 ? -14 : 26)}
              textAnchor="middle"
            >
              {label(i)}
            </text>
          ))}

          {nowHour != null && (
            <g className="curve-now">
              <line x1={xAt(nowHour)} x2={xAt(nowHour)} y1={PAD.top - 20} y2={BAR_BASE} />
              <text x={xAt(nowHour)} y={PAD.top - 26} textAnchor="middle">
                teraz
              </text>
            </g>
          )}

          <circle className="curve-dot" cx={px} cy={py} r="7" />

          {hours.map((h, i) =>
            i % 3 === 0 ? (
              <text key={h.time} className="curve-hour" x={xAt(i)} y={H - 8} textAnchor="middle">
                {String(h.hour).padStart(2, "0")}
              </text>
            ) : null
          )}
        </svg>
      </div>

      <p className="curve-legend">
        <span className="legend-night">Ciemniejsze tło to noc</span>
        <span className="legend-rain">Słupki to opad w mm</span>
        {sunrise && sunset && (
          <span>
            Wschód {sunrise.slice(11, 16)}, zachód {sunset.slice(11, 16)}
          </span>
        )}
      </p>
    </section>
  );
}
