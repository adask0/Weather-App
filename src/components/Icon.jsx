// Własne ikony pogody rysowane kreską, w kolorze tekstu.
const cloud = "M7 18.5h9.5a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 6.6 9.9 4.3 4.3 0 0 0 7 18.5Z";
const smallCloud = "M9 19h8a3.2 3.2 0 0 0 .4-6.4 4.4 4.4 0 0 0-8.4-.6A3.5 3.5 0 0 0 9 19Z";

function Sun({ cx = 12, cy = 12, r = 4 }) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    return (
      <line
        key={i}
        x1={cx + Math.cos(a) * (r + 2.2)}
        y1={cy + Math.sin(a) * (r + 2.2)}
        x2={cx + Math.cos(a) * (r + 4.2)}
        y2={cy + Math.sin(a) * (r + 4.2)}
      />
    );
  });
  return (
    <g className="icon-sun">
      <circle cx={cx} cy={cy} r={r} />
      {rays}
    </g>
  );
}

const Moon = () => <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5Z" />;

const drops = (xs, long) =>
  xs.map((x) => <line key={x} x1={x} y1="20" x2={x - 1} y2={long ? 23.5 : 22} />);

const shapes = {
  clear: (night) => (night ? <Moon /> : <Sun />),
  partly: (night) => (
    <>
      {night ? (
        <path d="M13.5 3.5a4.5 4.5 0 0 0 5 5 4.5 4.5 0 1 1-5-5Z" />
      ) : (
        <Sun cx={8} cy={8} r={2.6} />
      )}
      <path d={smallCloud} />
    </>
  ),
  cloud: () => <path d={cloud} />,
  fog: () => (
    <>
      <path d="M7 14.5a4.3 4.3 0 0 1-.4-8.6 5.5 5.5 0 0 1 10.5.65 4 4 0 0 1 .9 7.95" />
      <line x1="5" y1="18" x2="19" y2="18" />
      <line x1="7" y1="21.5" x2="17" y2="21.5" />
    </>
  ),
  drizzle: () => (
    <>
      <path d={cloud} transform="translate(0 -3)" />
      {drops([9, 14], false)}
    </>
  ),
  rain: () => (
    <>
      <path d={cloud} transform="translate(0 -3)" />
      {drops([8, 12, 16], true)}
    </>
  ),
  snow: () => (
    <>
      <path d={cloud} transform="translate(0 -3)" />
      {[8, 12, 16].map((x) => (
        <circle key={x} cx={x} cy="21" r="0.6" fill="currentColor" />
      ))}
    </>
  ),
  storm: () => (
    <>
      <path d={cloud} transform="translate(0 -3)" />
      <path d="M12.5 17.5 10 21h3l-1.5 3" />
    </>
  ),
};

export default function Icon({ kind, night = false, size = 24, label }) {
  const draw = shapes[kind] ?? shapes.cloud;
  return (
    <svg
      className={`icon icon-${kind}`}
      width={size}
      height={size}
      viewBox="0 0 24 25"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {draw(night)}
    </svg>
  );
}
