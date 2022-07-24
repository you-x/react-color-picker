import { useState, useEffect } from "react";
import { getGradientType, getDegrees, isUpperCase } from "./utils";
import { low, high, getColors, formatInputValues, Color } from "./formatters";
import { rgb2cmyk } from "./converters";
import { config } from "./constants";
import tc from "tinycolor2";

const { defaultColor, defaultGradient } = config;

export const useColorPicker = (
  value: string,
  onChange: React.Dispatch<React.SetStateAction<string>>
) => {
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
  const selectedPoint = currentColorObj?.index as number;
  const currentLeft = currentColorObj?.left as number;
  const [previousColors, setPreviousColors] = useState<string[]>([]);

  const tiny = tc(currentColor);
  const { r, g, b, a } = tiny.toRgb();
  const { h, s, l } = tiny.toHsl();

  useEffect(() => {
    if (tc(currentColor)?.isValid()) {
      setPreviousColors([currentColor, ...previousColors?.slice(0, 19)]);
    }
  }, [currentColor]);

  const setLinear = () => {
    const remaining = value.split(/,(.+)/)[1];
    onChange(`linear-gradient(90deg, ${remaining}`);
  };

  const setRadial = () => {
    const remaining = value.split(/,(.+)/)[1];
    onChange(`radial-gradient(circle, ${remaining}`);
  };

  const setDegrees = (newDegrees: number) => {
    const remaining = value.split(/,(.+)/)[1];
    onChange(
      `linear-gradient(${formatInputValues(
        newDegrees,
        0,
        360
      )}deg, ${remaining}`
    );
    if (gradientType !== "linear-gradient") {
      console.log(
        "Warning: you are updating degrees when the gradient type is not linear. This will change the gradients type which may be undesired"
      );
    }
  };

  const setSolid = (startingColor: string) => {
    let newValue = startingColor || defaultColor;
    onChange(newValue);
  };

  const setGradient = (startingGradiant: string) => {
    let newValue = startingGradiant || defaultGradient;
    onChange(newValue);
  };

  const createGradientStr = (newColors: Color[]) => {
    let sorted = newColors.sort((a, b) => (a.left ?? 0) - (b.left ?? 0));
    let colorString = sorted?.map((cc) => `${cc?.value} ${cc.left}%`);
    onChange(`${gradientType}(${degreeStr}, ${colorString.join(", ")})`);
  };

  const handleGradient = (newColor: string, left: number = currentLeft) => {
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

  const setR = (newR: number) => {
    let newVal = formatInputValues(newR, 0, 255);
    handleChange(`rgba(${newVal}, ${g}, ${b}, ${a})`);
  };

  const setG = (newG: number) => {
    let newVal = formatInputValues(newG, 0, 255);
    handleChange(`rgba(${r}, ${newVal}, ${b}, ${a})`);
  };

  const setB = (newB: number) => {
    let newVal = formatInputValues(newB, 0, 255);
    handleChange(`rgba(${r}, ${g}, ${newVal}, ${a})`);
  };

  const setA = (newA: number) => {
    let newVal = formatInputValues(newA, 0, 100);
    handleChange(`rgba(${r}, ${g}, ${b}, ${newVal / 100})`);
  };

  const setHue = (newHue: number) => {
    let newVal = formatInputValues(newHue, 0, 360);
    let tinyNew = tc({ h: newVal, s: s, l: l });
    let { r, g, b } = tinyNew.toRgb();
    handleChange(`rgba(${r}, ${g}, ${b}, ${a})`);
  };

  const setSaturation = (newSat: number) => {
    let newVal = formatInputValues(newSat, 0, 100);
    let tinyNew = tc({ h: h, s: newVal / 100, l: l });
    let { r, g, b } = tinyNew.toRgb();
    handleChange(`rgba(${r}, ${g}, ${b}, ${a})`);
  };

  const setLightness = (newLight: number) => {
    let newVal = formatInputValues(newLight, 0, 100);
    let tinyNew = tc({ h: h, s: s, l: newVal / 100 });
    if (tinyNew?.isValid()) {
      let { r, g, b } = tinyNew.toRgb();
      handleChange(`rgba(${r}, ${g}, ${b}, ${a})`);
    } else {
      console.log(
        "The new color was invalid, perhaps the lightness you passed in was a decimal? Please pass the new value between 0 - 100"
      );
    }
  };

  const valueToHSL = () => {
    return tiny.toHslString();
  };

  const valueToHSV = () => {
    return tiny.toHsvString();
  };

  const valueToHex = () => {
    return tiny.toHexString();
  };

  const valueToCmyk = () => {
    let { c, m, y, k } = rgb2cmyk(r, g, b);
    return `cmyk(${c}, ${m}, ${y}, ${k})`;
  };

  const setSelectedPoint = (index: number) => {
    if (isGradient) {
      let newGradStr = colors?.map((cc, i) => ({
        ...cc,
        value: i === index ? high(cc) : low(cc),
      }));
      createGradientStr(newGradStr);
    } else {
      console.log(
        "This function is only relevant when the picker is in gradient mode"
      );
    }
  };

  const addPoint = (left: number) => {
    let newColors = [
      ...colors.map((c) => ({ ...c, value: low(c) })),
      { value: currentColor, left: left },
    ];
    createGradientStr(newColors);
    if (!left) {
      console.log(
        "You did not pass a stop value (left amount) for the new color point so it defaulted to 50"
      );
    }
  };

  const deletePoint = (index: number) => {
    if (colors?.length > 2) {
      let pointToDelete = index || selectedPoint;
      let remaining = colors?.filter((rc, i) => i !== pointToDelete);
      createGradientStr(remaining);
      if (!index) {
        console.log(
          "You did not pass in the index of the point you wanted to delete so the function default to the currently selected point"
        );
      }
    } else {
      console.log(
        "A gradient must have atleast two colors, disable your delete button when necessary"
      );
    }
  };

  const setPointLeft = (left: number) => {
    handleGradient(currentColor, formatInputValues(left, 0, 100));
  };

  const rgbaArr = [r, g, b, a];
  const hslArr = [h, s, l];

  return {
    setLinear,
    setRadial,
    setDegrees,
    setSolid,
    setGradient,
    setR,
    setG,
    setB,
    setA,
    setHue,
    setSaturation,
    setLightness,
    valueToHSL,
    valueToHSV,
    valueToHex,
    valueToCmyk,
    setSelectedPoint,
    addPoint,
    deletePoint,
    selectedPoint,
    isGradient,
    gradientType,
    degrees,
    setPointLeft,
    currentLeft,
    rgbaArr,
    hslArr,
    previousColors,
  };
};
