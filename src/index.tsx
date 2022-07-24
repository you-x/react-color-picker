import React, { FC, useRef, useState, useEffect } from "react";
import { PickerContextWrapper } from "./context";
import { Picker } from "./Picker";
import "./styles.css";

export * from "./useColorPicker";

type Props = {
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  hideControls?: boolean;
  hideInputs?: boolean;
  hidePresets?: boolean;
  presets?: string[];
  hideEyeDrop?: boolean;
  hideAdvancedSliders?: boolean;
  hideColorGuide?: boolean;
  hideInputType?: boolean;
};

export const ColorPicker: FC<Props> = ({
  value = "rgba(175, 51, 242, 1)",
  onChange = () => {},
  hideControls = false,
  hideInputs = false,
  hidePresets = false,
  presets = [],
  hideEyeDrop = false,
  hideAdvancedSliders = false,
  hideColorGuide = false,
  hideInputType = false,
}) => {
  const contRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<DOMRect>();

  useEffect(() => {
    if (contRef?.current) {
      setBounds(contRef?.current?.getBoundingClientRect());
    }
  }, [setBounds]);

  return (
    <div ref={contRef}>
      <PickerContextWrapper bounds={bounds} value={value} onChange={onChange}>
        <Picker
          hideControls={hideControls}
          hideInputs={hideInputs}
          hidePresets={hidePresets}
          presets={presets}
          hideEyeDrop={hideEyeDrop}
          hideAdvancedSliders={hideAdvancedSliders}
          hideColorGuide={hideColorGuide}
          hideInputType={hideInputType}
        />
      </PickerContextWrapper>
    </div>
  );
};
