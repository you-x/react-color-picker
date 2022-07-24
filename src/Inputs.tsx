import React, { useState, useEffect } from "react";
import { rgb2cmyk, cmykToRgb, CMYK } from "./converters";
import { formatInputValues } from "./formatters";
import { usePicker } from "./context";

import tc, { ColorInput } from "tinycolor2";

export const Inputs = () => {
  const [disable, setDisable] = useState("");
  const { handleChange, tinyColor, r, g, b, opacity, inputType } = usePicker();
  const hex = tinyColor.toHex();
  const [newHex, setNewHex] = useState(hex);

  useEffect(() => {
    if (disable !== "hex") {
      setNewHex(hex);
    }
  }, [tinyColor, disable, hex]);

  const handleHex = (e: React.ChangeEvent<HTMLInputElement>) => {
    let tinyHex = tc(e.target.value);
    setNewHex(e.target.value);
    if (tinyHex.isValid()) {
      let { r, g, b } = tinyHex.toRgb();
      let newColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      handleChange(newColor);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        paddingTop: 14,
      }}
    >
      <div style={{ width: 74 }}>
        <input
          className="input-wrap"
          value={newHex}
          onChange={(e) => handleHex(e)}
          onFocus={() => setDisable("hex")}
          onBlur={() => setDisable("")}
        />
        <div className="input-label">HEX</div>
      </div>
      {inputType === "hsl" && <HSLInputs />}
      {inputType === "rgb" && <RGBInputs />}
      {inputType === "hsv" && <HSVInputs />}
      {inputType === "cmyk" && <CMKYInputs />}
      <Input
        value={opacity * 100}
        callback={(newVal) =>
          handleChange(`rgba(${r}, ${g}, ${b}, ${newVal / 100})`)
        }
        label="A"
      />
    </div>
  );
};

const RGBInputs = () => {
  const { handleChange, r, g, b, opacity } = usePicker();

  const handleRgb = ({ r, g, b }: { r: number; g: number; b: number }) => {
    handleChange(`rgba(${r}, ${g}, ${b}, ${opacity})`);
  };

  return (
    <>
      <Input
        value={r}
        callback={(newVal) => handleRgb({ r: newVal, g: g, b: b })}
        label="R"
        max={255}
      />
      <Input
        value={g}
        callback={(newVal) => handleRgb({ r: r, g: newVal, b: b })}
        label="G"
        max={255}
      />
      <Input
        value={b}
        callback={(newVal) => handleRgb({ r: r, g: g, b: newVal })}
        label="B"
        max={255}
      />
    </>
  );
};

const HSLInputs: React.FC = () => {
  const { handleChange, s, l, internalHue, opacity, setInternalHue } =
    usePicker();

  const handleH = (h: number, s: number, l: number) => {
    setInternalHue(h);
    let { r, g, b } = tc({ h: h, s: s, l: l }).toRgb();
    handleChange(`rgba(${r}, ${g}, ${b}, ${opacity})`);
  };

  const handleSl = (value: ColorInput) => {
    let { r, g, b } = tc(value).toRgb();
    handleChange(`rgba(${r}, ${g}, ${b}, ${opacity})`);
  };

  return (
    <>
      <Input
        value={round(internalHue)}
        callback={(newVal) => handleH(newVal, s, l)}
        label="H"
        max={360}
      />
      <Input
        value={round(s * 100)}
        callback={(newVal) => handleSl({ h: internalHue, s: newVal, l: l })}
        label="S"
      />
      <Input
        value={round(l * 100)}
        callback={(newVal) => handleSl({ h: internalHue, s: s, l: newVal })}
        label="L"
      />
    </>
  );
};

const HSVInputs: React.FC = () => {
  const { handleChange, hsvS, hsvV, internalHue, setInternalHue, opacity } =
    usePicker();

  const handleH = (h: number, s: number, v: number) => {
    setInternalHue(h);
    let { r, g, b } = tc({ h: h, s: s, v: v }).toRgb();
    handleChange(`rgba(${r}, ${g}, ${b}, ${opacity})`);
  };

  const handleSV = (value: ColorInput) => {
    let { r, g, b } = tc(value).toRgb();
    handleChange(`rgba(${r}, ${g}, ${b}, ${opacity})`);
  };

  return (
    <>
      <Input
        value={round(internalHue)}
        callback={(newVal) => handleH(newVal, hsvS, hsvV)}
        label="H"
        max={360}
      />
      <Input
        value={round(hsvS * 100)}
        callback={(newVal) => handleSV({ h: internalHue, s: newVal, v: hsvV })}
        label="S"
      />
      <Input
        value={round(hsvV * 100)}
        callback={(newVal) => handleSV({ h: internalHue, s: hsvS, v: newVal })}
        label="V"
      />
    </>
  );
};

const CMKYInputs = () => {
  const { handleChange, r, g, b, opacity } = usePicker();
  const { c, m, k, y } = rgb2cmyk(r, g, b);

  const handleCmyk = (value: CMYK) => {
    let { r, g, b } = cmykToRgb(value);
    handleChange(`rgba(${r}, ${g}, ${b}, ${opacity})`);
  };

  return (
    <>
      <Input
        value={round(c * 100)}
        callback={(newVal) => handleCmyk({ c: newVal, m: m, y: y, k: k })}
        label="C"
      />
      <Input
        value={round(m * 100)}
        callback={(newVal) => handleCmyk({ c: c, m: newVal, y: y, k: k })}
        label="M"
      />
      <Input
        value={round(y * 100)}
        callback={(newVal) => handleCmyk({ c: c, m: m, y: newVal, k: k })}
        label="Y"
      />
      <Input
        value={round(k * 100)}
        callback={(newVal) => handleCmyk({ c: c, m: m, y: y, k: newVal })}
        label="K"
      />
    </>
  );
};

type InputProps = {
  value: string | number;
  label: string;
  callback: (v: number) => void;

  max?: number;
};

export const Input: React.FC<InputProps> = ({
  value,
  callback,
  max = 100,
  label,
}) => {
  const [temp, setTemp] = useState(value);
  const { inputType } = usePicker();

  useEffect(() => {
    setTemp(value);
  }, [value]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = formatInputValues(parseFloat(e.target.value), 0, max);
    setTemp(newVal);
    callback(newVal);
  };

  return (
    <div style={{ width: inputType === "cmyk" ? 40 : 44 }}>
      <input
        className="input-wrap"
        value={temp}
        onChange={(e) => onChange(e)}
      />
      <div className="input-label">{label}</div>
    </div>
  );
};

const round = (val: number) => {
  return Math.round(val);
};
