import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";

// Internally handles deg → coord without exposing radians
const getGradientCoords = (angleDeg, size) => {
  const a = ((angleDeg - 90) + 360);
  const angle = (a * Math.PI) / 180;
  const x = Math.cos(angle);
  const y = Math.sin(angle);
  const half = size / 2;

  return {
    x0: half - x * half,
    y0: half - y * half,
    x1: half + x * half,
    y1: half + y * half,
  };
};

const GradientQRCode = ({
  text = "https://example.com",
  colors = ["#ff7e5f", "#ffffff"],
  angle = 0,
  gradientType = "linear",
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = 120;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = size;
    tempCanvas.height = size;

    QRCode.toCanvas(
      tempCanvas,
      text,
      { margin: 1, errorCorrectionLevel: "H" },
      (err) => {
        if (err) {
          console.error(err);
          return;
        }

        const tempCtx = tempCanvas.getContext("2d");
        const imageData = tempCtx.getImageData(0, 0, size, size);
        const data = imageData.data;

        // Create the gradient based on type
        let gradient;
        if (gradientType === "linear") {
          const { x0, y0, x1, y1 } = getGradientCoords(angle, size);
          gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        } else if (gradientType === "radial") {
          gradient = ctx.createRadialGradient(
            size / 2,
            size / 2,
            0,
            size / 2,
            size / 2,
            size / 2
          );
        } else if (gradientType === "conic" && ctx.createConicGradient) {
          gradient = ctx.createConicGradient((angle * Math.PI) / 180, size / 2, size / 2);
        } else {
          // fallback to linear if conic not supported
          const { x0, y0, x1, y1 } = getGradientCoords(angle, size);
          gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        }

        // Add color stops
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);

        // Apply gradient to new canvas
        const gCanvas = document.createElement("canvas");
        gCanvas.width = size;
        gCanvas.height = size;
        const gCtx = gCanvas.getContext("2d");
        gCtx.fillStyle = gradient;
        gCtx.fillRect(0, 0, size, size);

        const gradientData = gCtx.getImageData(0, 0, size, size).data;

        const newImageData = ctx.createImageData(size, size);
        const newData = newImageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const isBlack = data[i] < 128;
          if (isBlack) {
            newData[i] = gradientData[i];
            newData[i + 1] = gradientData[i + 1];
            newData[i + 2] = gradientData[i + 2];
            newData[i + 3] = 255;
          } else {
            newData[i + 3] = 0;
          }
        }

        ctx.putImageData(newImageData, 0, 0);
      }
    );
  }, [text, colors, angle, gradientType]);

  return (
    <div className="flex justify-center items-center p-4 bg-white rounded-xl shadow-lg">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default GradientQRCode;



