/// <reference types="react" />
export declare function getHandleValue(e: React.MouseEvent<HTMLDivElement | HTMLCanvasElement>): number;
export declare const computeSquareXY: (hsl: [number, number, number]) => [number, number];
export declare function computePickerPosition(e: React.MouseEvent<HTMLDivElement>): number[];
export declare const getDegrees: (value: string) => number;
export declare const getGradientType: (value: string) => string;
export declare const getNewHsl: (newHue: number, s: number, l: number, o: number, setInternalHue: React.Dispatch<React.SetStateAction<number>>) => string;
export declare const safeBounds: (e: React.MouseEvent<HTMLDivElement | HTMLCanvasElement>) => {
    offsetLeft: number;
    offsetTop: number;
};
export declare const isUpperCase: (str: string) => boolean;
//# sourceMappingURL=utils.d.ts.map