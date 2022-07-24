import { formatInputValues } from "./formatters";
import { config } from "./constants";
import tc from "tinycolor2";

const { squareSize, barSize, crossSize } = config;

export function getHandleValue(
  e: React.MouseEvent<HTMLDivElement | HTMLCanvasElement>
): number {
  const { offsetLeft } = safeBounds(e);
  let pos = e.clientX - offsetLeft - barSize / 2;
  let bounded = formatInputValues(pos, 0, 276);
  return Math.round(bounded / 2.76);
}

export const computeSquareXY = (
  hsl: [number, number, number]
): [number, number] => {
  const s = hsl[1] * 100;
  const l = hsl[2] * 100;
  const t = (s * (l < 50 ? l : 100 - l)) / 100;
  const s1 = Math.round((200 * t) / (l + t)) | 0;
  const b1 = Math.round(t + l);
  const x = (squareSize / 100) * s1 - crossSize / 2;
  const y = squareSize - (squareSize / 100) * b1 - crossSize / 2;
  return [x, y];
};

export function computePickerPosition(e: React.MouseEvent<HTMLDivElement>) {
  const { offsetLeft, offsetTop } = safeBounds(e);
  const getX = () => {
    let xPos = e.clientX - offsetLeft - crossSize / 2;
    return formatInputValues(xPos, -8, 284);
  };
  const getY = () => {
    let yPos = e.clientY - offsetTop - crossSize / 2;
    return formatInputValues(yPos, -8, 284);
  };

  return [getX(), getY()];
}

export const getDegrees = (value: string) => {
  let s1 = value?.split(",")[0];
  return parseInt(s1?.split("(")[1]?.slice(0, -3));
};

export const getGradientType = (value: string) => {
  return value?.split("(")[0];
};

export const getNewHsl = (
  newHue: number,
  s: number,
  l: number,
  o: number,
  setInternalHue: React.Dispatch<React.SetStateAction<number>>
) => {
  setInternalHue(newHue);
  let tiny = tc({ h: newHue, s: s, l: l });
  let { r, g, b } = tiny.toRgb();
  return `rgba(${r}, ${g}, ${b}, ${o})`;
};

export const safeBounds = (
  e: React.MouseEvent<HTMLDivElement | HTMLCanvasElement>
) => {
  let client = (
    (e.target as Element).parentNode as HTMLElement
  ).getBoundingClientRect();

  let className = (e.target as Element).className;
  let adjuster = className === "c-resize ps-rl" ? 15 : 0;
  return { offsetLeft: client?.x + adjuster, offsetTop: client?.y };
};

export const isUpperCase = (str: string): boolean => {
  return str?.[0] === str?.[0]?.toUpperCase();
};
