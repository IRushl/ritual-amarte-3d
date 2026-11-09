import type { CSSProperties } from "react";
const paths = {
  cube: "M12 3 3 8v9l9 5 9-5V8L12 3Zm0 9L3 8m9 4 9-4m-9 4v10",
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  chair:
    "M6 13V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8M4 10v7h16v-7M6 17v4m12-4v4M4 13h16",
  leaf: "M20 3C8 2 3 8 5 15c7 5 15-1 15-12ZM4 21 16 9",
  info: "M12 11v6m0-10v.1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  reset: "M3 10a9 9 0 1 1 1 8M3 4v6h6",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  layers: "m12 3 10 6-10 6L2 9l10-6ZM2 13l10 6 10-6M2 17l10 6 10-6",
  move: "M12 2v20M2 12h20M8 6l4-4 4 4M8 18l4 4 4-4M6 8l-4 4 4 4m12-8 4 4-4 4",
  mouse:
    "M8 3h8a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Zm4 0v7",
  plus: "M12 4v16M4 12h16",
  minus: "M4 12h16",
  check: "m5 12 4 4L19 6",
};
export type IconName = keyof typeof paths;
export function Icon({
  name,
  size = 20,
  style,
}: {
  name: IconName;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
