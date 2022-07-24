import React, { useRef, useState } from "react";
import throttle from "lodash.throttle";
import { usePaintSquare } from "./usePaintSquare";
import { usePicker } from "./context";

export const Square: React.FC = () => {
  const { handleColor, x, y, internalHue } = usePicker();
  const [dragging, setDragging] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  usePaintSquare(canvas, internalHue);

  const handleChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const ctx = canvas?.current?.getContext("2d");
    if (ctx) {
      const onMouseMove = throttle(() => handleColor(e, ctx), 250);
      onMouseMove();
    }
  };

  const stopDragging = () => {
    setDragging(false);
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging) {
      handleChange(e);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) {
      handleChange(e);
    }
  };

  return (
    <div className="ps-rl">
      <div
        style={{
          position: "absolute",
          left: -7,
          top: -7,
          width: 308,
          height: 308,
        }}
        onMouseEnter={stopDragging}
      />
      <div
        className="ps-rl c-cross"
        onMouseMove={handleMove}
        onMouseUp={stopDragging}
      >
        <div
          style={{ left: x, top: y }}
          className="handle"
          onMouseDown={() => setDragging(true)}
        />
        <div className="canvas-wrapper" onClick={(e) => handleClick(e)}>
          <canvas ref={canvas} width="294px" height="294px" id="paintSquare" />
        </div>
      </div>
    </div>
  );
};
