import { ColorInput } from "tinycolor2";
import { config } from "./constants";
import { gradientParser } from "./gradientParser";

const { defaultColor, defaultGradient } = config;

export const low = (color: Color) => {
  return color.value.toLowerCase();
};

export const high = (color: Color) => {
  return color.value.toUpperCase();
};

export type Color = {
  value: string;
  index?: number;
  left?: number;
};

export const getColors = (value: string): Color[] => {
  let isGradient = value?.includes("gradient");
  if (isGradient) {
    let isConic = value?.includes("conic");
    let safeValue = !isConic && validate(value) ? value : defaultGradient;
    if (isConic) {
      console.log("Sorry we cant handle conic gradients yet");
    }
    var obj = gradientParser(safeValue);
    return obj?.colorStops;
  } else {
    let safeValue = validate(value) ? value : defaultColor;
    return [{ value: safeValue }];
  }
};

// NOTE: ロジック確認
let validate = (c: string) => {
  let img = document.createElement<"img">("img");
  img.style.cssText = "background: rgb(0, 0, 0)";
  img.style.cssText = "background: " + c;
  if (img.style.background !== "rgb(0, 0, 0)" && img.style.background !== "")
    return true;
  img.style.cssText = "background: rgb(255, 255, 255)";
  img.style.cssText = "background: " + c;
  return (
    img.style.cssText !== "rgb(255, 255, 255)" && img.style.background !== ""
  );
};

export const formatInputValues = (
  value: number,
  min: number,
  max: number
): number => {
  return isNaN(value) ? min : value < min ? min : value > max ? max : value;
};
