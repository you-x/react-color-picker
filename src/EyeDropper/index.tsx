import React, { useState } from "react";
import { Portal } from "./Portal";
import { DropperIcon } from "../icon";
import html2canvas from "html2canvas";

type Props = {
  buttonStyle: React.CSSProperties;
  onSelect: (color: string) => void;
};

export const EyeDropper: React.FC<Props> = ({ onSelect, buttonStyle }) => {
  const [pickerCanvas, setPickerCanvas] = useState<CanvasRenderingContext2D>();
  const [coverUp, setCoverUp] = useState(false);

  const takePick = () =>
    html2canvas(document.body).then((canvas) => {
      const croppedCanvas = document.createElement("canvas");
      const croppedCanvasContext = croppedCanvas.getContext("2d");
      if (croppedCanvasContext) {
        const cropPositionTop = 0;
        const cropPositionLeft = 0;
        const cropWidth = window.innerWidth * 2;
        const cropHeight = window.innerHeight * 2;
        croppedCanvas.width = cropWidth;
        croppedCanvas.height = cropHeight;

        croppedCanvasContext.drawImage(
          canvas,
          cropPositionLeft,
          cropPositionTop
        );

        setPickerCanvas(croppedCanvasContext);
        setCoverUp(true);
      }
    });

  const getEyeDrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (pickerCanvas) {
      e.stopPropagation();
      const x1 = e.clientX * 2;
      const y1 = e.clientY * 2;
      const [r, g, b] = pickerCanvas.getImageData(x1, y1, 1, 1).data;
      onSelect(`rgba(${r}, ${g}, ${b}, 1)`);
      setCoverUp(false);
    }
  };

  return (
    <div>
      <div style={buttonStyle} onClick={takePick}>
        <DropperIcon />
      </div>
      {coverUp && (
        <Portal>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              zIndex: 100000000,
              width: window.innerWidth,
              height: window.innerHeight,
              cursor: "copy",
            }}
            onClick={(e) => getEyeDrop(e)}
          />
        </Portal>
      )}
    </div>
  );
};
