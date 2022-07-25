import React from "react";
import { Color } from "./formatters";
import { Instance } from "tinycolor2";
export declare type PickerContext = {
    x: number;
    y: number;
    s: number;
    l: number;
    r: number;
    g: number;
    b: number;
    hue: number;
    hsvS: number;
    hsvV: number;
    value: string;
    colors: Color[];
    degrees: number;
    opacity: number;
    onChange: (v: string) => void;
    addPoint: (e: React.MouseEvent<HTMLDivElement | HTMLCanvasElement>) => void;
    inputType: string;
    tinyColor: Instance;
    handleHue: (e: React.MouseEvent<HTMLDivElement | HTMLCanvasElement>) => void;
    isGradient: boolean;
    offsetLeft?: number;
    handleColor: (e: React.MouseEvent<HTMLDivElement>, ctx: CanvasRenderingContext2D) => void;
    currentLeft?: number;
    deletePoint: () => void;
    internalHue: number;
    setInputType: React.Dispatch<React.SetStateAction<string>>;
    gradientType: string;
    handleChange: (v: string) => void;
    currentColor: string;
    selectedColor: number;
    handleOpacity: (e: React.MouseEvent<HTMLDivElement>) => void;
    setInternalHue: React.Dispatch<React.SetStateAction<number>>;
    previousColors: string[];
    handleGradient: (color: string, left?: number) => void;
    setSelectedColor: (v: number) => void;
    previousGraidents: string[];
};
declare type Props = {
    bounds?: DOMRect;
    value: string;
    onChange: (newColor: string) => void;
    children: React.ReactNode;
};
export declare const PickerContextWrapper: React.FC<Props>;
export declare const usePicker: () => PickerContext;
export {};
//# sourceMappingURL=context.d.ts.map