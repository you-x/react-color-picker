import React, { useState, useRef, Ref } from "react";
import { usePicker } from "./context";
import { getHandleValue } from "./utils";
import { usePaintSat, usePaintLight, usePaintBright } from "./usePaintHue";
import tinycolor from "tinycolor2";

type Props = {
  openAdvanced: boolean;
};

export const AdvancedControls: React.FC<Props> = ({ openAdvanced }) => {
  const { tinyColor, hue, l, handleChange, s, opacity } = usePicker();
  const { v, s: vs } = tinyColor.toHsv();
  const satRef = useRef(null);
  const lightRef = useRef(null);
  const brightRef = useRef(null);
  usePaintSat(satRef, hue, l * 100);
  usePaintLight(lightRef, hue, s * 100);
  usePaintBright(brightRef, hue, s * 100);

  const satDesat = (value: number) => {
    const { r, g, b } = tinycolor({ h: hue, s: value / 100, l: l }).toRgb();
    handleChange(`rgba(${r},${g},${b},${opacity})`);
  };

  const setLight = (value: number) => {
    const { r, g, b } = tinycolor({ h: hue, s: s, l: value / 100 }).toRgb();
    handleChange(`rgba(${r},${g},${b},${opacity})`);
  };

  const setBright = (value: number) => {
    const { r, g, b } = tinycolor({ h: hue, s: vs * 100, v: value }).toRgb();
    handleChange(`rgba(${r},${g},${b},${opacity})`);
  };

  return (
    <div
      style={{
        height: openAdvanced ? 154 : 0,
        width: "100%",
        transition: "all 120ms linear",
      }}
    >
      <div style={{ paddingTop: 11, display: openAdvanced ? "" : "none" }}>
        <div
          style={{
            textAlign: "center",
            color: "#323136",
            fontSize: 12,
            fontWeight: 500,
            marginTop: 3,
            marginBottom: -2,
          }}
        >
          Saturation
        </div>
        <AdvBar left={s * 276} reffy={satRef} callback={satDesat} />
        <div
          style={{
            textAlign: "center",
            color: "#323136",
            fontSize: 12,
            fontWeight: 500,
            marginTop: 8,
            marginBottom: -2,
          }}
        >
          Lightness
        </div>
        <AdvBar left={l * 276} reffy={lightRef} callback={setLight} />
        <div
          style={{
            textAlign: "center",
            color: "#323136",
            fontSize: 12,
            fontWeight: 500,
            marginTop: 8,
            marginBottom: -2,
          }}
        >
          Brightness
        </div>
        <AdvBar left={v * 276} reffy={brightRef} callback={setBright} />
      </div>
    </div>
  );
};

type AdvBarProps = {
  left: number;
  reffy: Ref<HTMLCanvasElement>;
  callback(value: number): void;
};

const AdvBar: React.FC<AdvBarProps> = ({ left, callback, reffy }) => {
  const [dragging, setDragging] = useState(false);

  const stopDragging = () => {
    setDragging(false);
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging) {
      callback(getHandleValue(e));
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging) {
      callback(getHandleValue(e));
    }
  };

  return (
    <div
      className="bar-wrap"
      onMouseEnter={stopDragging}
      onMouseLeave={stopDragging}
    >
      <div className="ps-rl bar-wrap-inner" onMouseUp={stopDragging}>
        <div
          className="c-resize ps-rl"
          onMouseMove={handleMove}
          style={{ width: 294, height: 14, borderRadius: 10 }}
        >
          <div
            style={{ left: left, top: -0.5 }}
            className="handle"
            onMouseDown={() => setDragging(true)}
          />
          <canvas
            ref={reffy}
            width="294px"
            height="14px"
            style={{ position: "relative", borderRadius: 14 }}
            onClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
};
