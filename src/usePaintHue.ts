import { RefObject, useEffect } from "react";
import { config } from "./constants";
import tinycolor from "tinycolor2";

const { squareSize } = config;

export const usePaintHue = (canvas: RefObject<HTMLCanvasElement>) => {
  useEffect(() => {
    const ctx = canvas?.current?.getContext("2d");
    if (ctx) {
      ctx.rect(0, 0, 294, 14);

      const gradient = ctx.createLinearGradient(0, 0, squareSize, 0);
      for (let i = 0; i <= 360; i += 30) {
        gradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
      }
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, [canvas]);
};

export const usePaintSat = (
  canvas: RefObject<HTMLCanvasElement>,
  h: number,
  l: number
) => {
  useEffect(() => {
    const ctx = canvas?.current?.getContext("2d");
    if (ctx) {
      ctx.rect(0, 0, 294, 14);

      const gradient = ctx.createLinearGradient(0, 0, squareSize, 0);
      for (let i = 0; i <= 100; i += 10) {
        gradient.addColorStop(i / 100, `hsl(${h}, ${i}%, ${l}%)`);
      }
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, [canvas, h, l]);
};

export const usePaintLight = (
  canvas: RefObject<HTMLCanvasElement>,
  h: number,
  s: number
) => {
  useEffect(() => {
    const ctx = canvas?.current?.getContext("2d");
    if (ctx) {
      ctx.rect(0, 0, 294, 14);

      const gradient = ctx.createLinearGradient(0, 0, squareSize, 0);
      for (let i = 0; i <= 100; i += 10) {
        gradient.addColorStop(i / 100, `hsl(${h}, ${s}%, ${i}%)`);
      }
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, [canvas, h, s]);
};

export const usePaintBright = (
  canvas: RefObject<HTMLCanvasElement>,
  h: number,
  s: number
) => {
  useEffect(() => {
    const ctx = canvas?.current?.getContext("2d");
    if (ctx) {
      ctx.rect(0, 0, 294, 14);

      const gradient = ctx.createLinearGradient(0, 0, squareSize, 0);
      for (let i = 0; i <= 100; i += 10) {
        let hsl = tinycolor({ h: h, s: s, v: i });
        gradient.addColorStop(i / 100, hsl.toHslString());
      }
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, [canvas, h, s]);
};
