export type CMYK = {
  c: number;
  m: number;
  y: number;
  k: number;
};

export const rgb2cmyk = (
  r: number | null,
  g: number | null,
  b: number | null
): CMYK => {
  var computedC = 0;
  var computedM = 0;
  var computedY = 0;
  var computedK = 0;

  if (
    r === null ||
    g === null ||
    b === null ||
    isNaN(r) ||
    isNaN(g) ||
    isNaN(b)
  ) {
    // alert("Please enter numeric RGB values!");
    throw new Error("Please enter numeric RGB values!");
  }
  if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
    alert("RGB values must be in the range 0 to 255.");
    throw new Error("RGB values must be in the range 0 to 255.");
  }

  if (r === 0 && g === 0 && b === 0) {
    computedK = 1;
    return {
      c: 0,
      m: 0,
      y: 0,
      k: 1,
    };
  }

  computedC = 1 - r / 255;
  computedM = 1 - g / 255;
  computedY = 1 - b / 255;

  var minCMY = Math.min(computedC, Math.min(computedM, computedY));
  computedC = (computedC - minCMY) / (1 - minCMY);
  computedM = (computedM - minCMY) / (1 - minCMY);
  computedY = (computedY - minCMY) / (1 - minCMY);
  computedK = minCMY;

  return { c: computedC, m: computedM, y: computedY, k: computedK };
};

export const cmykToRgb = ({ c, m, y, k }: CMYK) => {
  var r = 255 * (1 - c) * (1 - k);
  var g = 255 * (1 - m) * (1 - k);
  var b = 255 * (1 - y) * (1 - k);

  return { r: r, g: g, b: b };
};
