import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";

const GradientQRCode = ({ text = "https://example.com", colors = ["#ff7e5f", "#ffffff"] }) => {
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

    QRCode.toCanvas(tempCanvas, text, { margin: 1, errorCorrectionLevel: "H" }, (err) => {
      if (err) {
        console.error(err);
        return;
      }

      const tempCtx = tempCanvas.getContext("2d");
      const imageData = tempCtx.getImageData(0, 0, size, size);
      const data = imageData.data;

      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1]);

      const gradientCanvas = document.createElement("canvas");
      gradientCanvas.width = size;
      gradientCanvas.height = size;
      const gCtx = gradientCanvas.getContext("2d");

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
    });
  }, [text, colors]);

  return (
    <div className="flex justify-center items-center p-4 bg-white rounded-xl shadow-lg">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default GradientQRCode;

