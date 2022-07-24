import React, { useState } from "react";
import { ColorPicker } from "../index";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Example/ColorPicker",
  component: ColorPicker,
};

/*
 * Example Button story with React Hooks.
 * See note below related to this example.
 */
export const Primary = () => {
  const [color, setColor] = useState("rgba(255,255,255,1)");

  return (
    <div
      style={{
        width: "500px",
      }}
    >
      <ColorPicker value={color} onChange={setColor} />
    </div>
  );
};
