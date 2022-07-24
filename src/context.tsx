import React, { createContext, useContext, useState, useEffect } from "react";
import {
  computePickerPosition,
  getGradientType,
  computeSquareXY,
  getDegrees,
  getNewHsl,
  getHandleValue,
  isUpperCase,
} from "./utils";
import { low, high, getColors, Color } from "./formatters";
import { config } from "./constants";
import tinycolor, { Instance } from "tinycolor2";

const { squareSize, crossSize } = config;

// @ts-ignore
const pickerContext = createContext<PickerContext>({});

export type PickerContext = {
  x: number;
  y: number;
  s: number;
  l: number;
  r: number;
  g: number;
  b: number;
  hue: number;
  hsvS: number;
  hsvV: number;
  value: string;
  colors: Color[];
  degrees: number;
  opacity: number;
  onChange: (v: string) => void;
  addPoint: (e: React.MouseEvent<HTMLDivElement | HTMLCanvasElement>) => void;
  inputType: string;
  tinyColor: Instance;
  handleHue: (e: React.MouseEvent<HTMLDivElement | HTMLCanvasElement>) => void;
  isGradient: boolean;
  offsetLeft?: number;
  handleColor: (
    e: React.MouseEvent<HTMLDivElement>,
    ctx: CanvasRenderingContext2D
  ) => void;
  currentLeft?: number;
  deletePoint: () => void;
  internalHue: number;
  setInputType: React.Dispatch<React.SetStateAction<string>>;
  gradientType: string;
  handleChange: (v: string) => void;
  currentColor: string;
  selectedColor: number;
  handleOpacity: (e: React.MouseEvent<HTMLDivElement>) => void;
  setInternalHue: React.Dispatch<React.SetStateAction<number>>;
  previousColors: string[];
  handleGradient: (color: string, left?: number) => void;
  setSelectedColor: (v: number) => void;
  previousGraidents: string[];
};

type Props = {
  bounds?: DOMRect;
  value: string;
  onChange: (newColor: string) => void;
  children: React.ReactNode;
};

export const PickerContextWrapper: React.FC<Props> = ({
  children,
  bounds,
  value,
  onChange,
}) => {
  const offsetLeft = bounds?.x;

  const isGradient = value?.includes("gradient");
  const gradientType = getGradientType(value);
  const degrees = getDegrees(value);
  const degreeStr =
    gradientType === "linear-gradient" ? `${degrees}deg` : "circle";
  const colors = getColors(value);
  const indexedColors = colors?.map((c, i) => ({ ...c, index: i }));
  const currentColorObj =
    indexedColors?.filter((c) => isUpperCase(c.value))[0] || indexedColors[0];
  const currentColor = currentColorObj?.value;
  const selectedColor = currentColorObj?.index;
  const currentLeft = currentColorObj?.left;
  const [tinyColor, setTinyColor] = useState(tinycolor(currentColor));
  const [inputType, setInputType] = useState("rgb");

  const { r, g, b, a: opacity } = tinyColor.toRgb();
  const { h, s, l } = tinyColor.toHsl();
  const { s: hsvS, v: hsvV } = tinyColor.toHsv();
  const [internalHue, setInternalHue] = useState<number>(Math.round(h));
  const hue = Math.round(h);
  const [x, y] = computeSquareXY([hue, s, l]);
  const [previousColors, setPreviousColors] = useState<string[]>([]);
  const [previousGraidents, setPreviousGradients] = useState<string[]>([]);

  useEffect(() => {
    setTinyColor(tinycolor(currentColor));
    setInternalHue(hue);
  }, [currentColor, hue]);

  useEffect(() => {
    if (isGradient) {
      setPreviousGradients([value, ...previousGraidents?.slice(0, 4)]);
    } else {
      if (tinycolor(value).isValid()) {
        setPreviousColors([value, ...previousColors?.slice(0, 4)]);
      }
    }
    //eslint-disable-next-line
  }, [value]);

  const createGradientStr = (newColors: Color[]) => {
    let sorted = newColors.sort((a, b) => (a.left ?? 0) - (b.left ?? 0));
    let colorString = sorted?.map((cc) => `${cc?.value} ${cc.left}%`);
    onChange(`${gradientType}(${degreeStr}, ${colorString.join(", ")})`);
  };

  const handleGradient = (newColor: string, left = currentLeft) => {
    let remaining = colors?.filter((c) => !isUpperCase(c.value));
    let newColors = [
      { value: newColor.toUpperCase(), left: left },
      ...remaining,
    ];
    createGradientStr(newColors);
  };

  const handleChange = (newColor: string) => {
    if (isGradient) {
      handleGradient(newColor);
    } else {
      onChange(newColor);
    }
  };

  const handleOpacity = (e: React.MouseEvent<HTMLDivElement>) => {
    let newO = getHandleValue(e) / 100;
    let newColor = `rgba(${r}, ${g}, ${b}, ${newO})`;
    handleChange(newColor);
  };

  const handleHue = (
    e: React.MouseEvent<HTMLDivElement | HTMLCanvasElement>
  ) => {
    let newHue = getHandleValue(e) * 3.6;
    let newHsl = getNewHsl(newHue, s, l, opacity, setInternalHue);
    handleChange(newHsl);
  };

  const handleColor = (
    e: React.MouseEvent<HTMLDivElement>,
    ctx: CanvasRenderingContext2D
  ) => {
    const [x, y] = computePickerPosition(e);
    const x1 = Math.min(x + crossSize / 2, squareSize - 1);
    const y1 = Math.min(y + crossSize / 2, squareSize - 1);
    const [r, g, b] = ctx.getImageData(x1, y1, 1, 1).data;
    let newColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    handleChange(newColor);
  };

  const setSelectedColor = (index: number) => {
    let newGradStr = colors?.map((cc, i) => ({
      ...cc,
      value: i === index ? high(cc) : low(cc),
    }));
    createGradientStr(newGradStr);
  };

  const addPoint = (
    e: React.MouseEvent<HTMLDivElement | HTMLCanvasElement>
  ) => {
    let left = getHandleValue(e);
    let newColors = [
      ...colors.map((c) => ({ ...c, value: low(c) })),
      { value: currentColor, left: left },
    ];
    createGradientStr(newColors);
  };

  const deletePoint = () => {
    if (colors?.length > 2) {
      let remaining = colors?.filter((rc, i) => i !== selectedColor);
      createGradientStr(remaining);
    }
  };

  const pickerState = {
    x,
    y,
    s,
    l,
    r,
    g,
    b,
    hue,
    hsvS,
    hsvV,
    value,
    colors,
    degrees,
    opacity,
    onChange,
    addPoint,
    inputType,
    tinyColor,
    handleHue,
    isGradient,
    offsetLeft,
    handleColor,
    currentLeft,
    deletePoint,
    internalHue,
    setInputType,
    gradientType,
    handleChange,
    currentColor,
    selectedColor,
    handleOpacity,
    setInternalHue,
    previousColors,
    handleGradient,
    setSelectedColor,
    previousGraidents,
  };

  return (
    <pickerContext.Provider value={pickerState}>
      {children}
    </pickerContext.Provider>
  );
};

export const usePicker = (): PickerContext => {
  return useContext(pickerContext);
};
