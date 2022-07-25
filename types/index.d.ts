import React, { FC } from "react";
import "./styles.css";
export * from "./useColorPicker";
declare type Props = {
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
export declare const ColorPicker: FC<Props>;
//# sourceMappingURL=index.d.ts.map