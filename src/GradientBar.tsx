import React, { useState } from "react";
import { getHandleValue } from "./utils";
import { usePicker } from "./context";

export const GradientBar: React.FC = () => {
  const { currentColor, addPoint, colors, value, handleGradient } = usePicker();
  const [dragging, setDragging] = useState(false);

  const stopDragging = () => {
    setDragging(false);
  };

  const handleDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) {
      addPoint(e);
    }
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging) {
      handleGradient(currentColor, getHandleValue(e));
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
          onMouseDown={handleDown}
          onMouseMove={handleMove}
          style={{ paddingTop: 6, paddingBottom: 6 }}
        >
          <div
            style={{
              width: 294,
              height: 14,
              backgroundImage: value,
              borderRadius: 10,
            }}
          />
        </div>
        {colors?.map((c, i) => (
          <Handle
            left={c.left as number}
            key={`${i}-${c}`}
            i={i}
            setDragging={setDragging}
          />
        ))}
      </div>
    </div>
  );
};

type HandleProps = {
  left: number;
  i: number;
  setDragging: (v: boolean) => void;
};

export const Handle: React.FC<HandleProps> = ({ left, i, setDragging }) => {
  const { setSelectedColor, selectedColor } = usePicker();
  const isSelected = selectedColor === i;

  const handleDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setSelectedColor(i);
    setDragging(true);
  };

  return (
    <div
      style={{ left: left * 2.76 + 13 }}
      onMouseDown={(e) => handleDown(e)}
      className="gradient-handle-wrap"
    >
      <div style={handleStyle(isSelected)} className="gradient-handle df jc ac">
        {isSelected && (
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "white",
            }}
          />
        )}
      </div>
    </div>
  );
};

const handleStyle = (isSelected: boolean) => {
  return {
    boxShadow: isSelected ? "0px 0px 5px 1px rgba(86, 140, 245,.95)" : "",
    border: isSelected ? "2px solid white" : "2px solid rgba(255,255,255,.75)",
  };
};
