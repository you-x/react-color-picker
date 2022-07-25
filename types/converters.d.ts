export declare type CMYK = {
    c: number;
    m: number;
    y: number;
    k: number;
};
export declare const rgb2cmyk: (r: number | null, g: number | null, b: number | null) => CMYK;
export declare const cmykToRgb: ({ c, m, y, k }: CMYK) => {
    r: number;
    g: number;
    b: number;
};
//# sourceMappingURL=converters.d.ts.map