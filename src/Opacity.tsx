import React, { useState } from "react";
import { usePicker } from "./context";

export const Opacity: React.FC = () => {
  const { handleOpacity, opacity, tinyColor } = usePicker();
  const [dragging, setDragging] = useState(false);
  const { r, g, b } = tinyColor.toRgb();
  const bg = `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(${r},${g},${b},.5) 100%)`;

  const stopDragging = () => {
    setDragging(false);
  };

  const handleDown = () => {
    setDragging(true);
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging) {
      handleOpacity(e);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) {
      handleOpacity(e);
    }
  };

  return (
    <div
      className="bar-wrap"
      onMouseEnter={stopDragging}
      onMouseLeave={stopDragging}
      style={{ marginTop: 6 }}
    >
      <div className="bar-wrap-inner" onMouseUp={stopDragging}>
        <div
          className="c-resize ps-rl"
          style={{ width: "294px" }}
          onMouseDown={handleDown}
          onMouseMove={handleMove}
        >
          <div style={{ left: 276 * opacity, top: -2 }} className="handle" />
          <div
            className="opacity-overlay"
            style={{ background: bg }}
            onClick={handleClick}
          />
          <OpacityBg />
        </div>
      </div>
    </div>
  );
};

const OpacityBg = () => {
  return (
    <div className="opacity-bg">
      {sqaures?.map((s, key) => (
        <div
          key={key}
          style={{
            height: 7,
            width: 7,
            background: s === 1 ? "rgba(0,0,0,.3)" : "",
          }}
        />
      ))}
    </div>
  );
};

const sqaures = [
  1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
  1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
  0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
  0, 1, 0, 1, 0, 1,
];
