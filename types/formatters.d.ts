export declare const low: (color: Color) => string;
export declare const high: (color: Color) => string;
export declare type Color = {
    value: string;
    index?: number;
    left?: number;
};
export declare const getColors: (value: string) => Color[];
export declare const formatInputValues: (value: number, min: number, max: number) => number;
//# sourceMappingURL=formatters.d.ts.map