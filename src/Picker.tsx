import React from "react";
import { Hue } from "./Hue";
import { Inputs } from "./Inputs";
import { Square } from "./Square";
import { Opacity } from "./Opacity";
import { Presets } from "./Presets";
import { Controls } from "./Controls";
import { GradientBar } from "./GradientBar";
import { usePicker } from "./context";

type Props = {
  hideControls: boolean;
  hideInputs: boolean;
  hidePresets: boolean;
  presets: string[];
  hideEyeDrop: boolean;
  hideAdvancedSliders: boolean;
  hideColorGuide: boolean;
  hideInputType: boolean;
};

export const Picker: React.FC<Props> = ({
  hideControls,
  hideInputs,
  hidePresets,
  presets,
  hideEyeDrop,
  hideAdvancedSliders,
  hideColorGuide,
  hideInputType,
}) => {
  const { isGradient } = usePicker();

  return (
    <div style={{ userSelect: "none", width: "294px" }}>
      <Square />
      {!hideControls && (
        <Controls
          hideEyeDrop={hideEyeDrop}
          hideAdvancedSliders={hideAdvancedSliders}
          hideColorGuide={hideColorGuide}
          hideInputType={hideInputType}
        />
      )}
      {isGradient && <GradientBar />}
      <Hue />
      <Opacity />
      {!hideInputs && <Inputs />}
      {!hidePresets && <Presets presets={presets} />}
    </div>
  );
};
