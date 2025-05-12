"use client";

import { useEffect, useRef, useState } from "react";
import iro, { ColorPicker, Color } from "@jaames/iro";

import chroma from "chroma-js";
import { QRCodeSVG } from "qrcode.react";

// Convert HEX to RGB
const hexToRGB = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

// Convert HEX to HSV
const hexToHSV = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : delta / max;
  const v = max;

  return [h, Math.round(s * 100), Math.round(v * 100)];
};

export default function ColorPickerComponent() {
  const [hue, setHue] = useState(0);
  const [alpha, setAlpha] = useState(1);
  const [color, setColor] = useState("#ff0000");

  const colorPickerRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  if (colorPickerRef.current) {
    const picker = new iro.ColorPicker(colorPickerRef.current, {
      width: 200,
      color: color,
      borderWidth: 1,
      borderColor: "#fff",
    });

    picker.on("color:change", (newColor: iro.Color) => {
      setColor(newColor.hexString);
    });

    // Cleanup if component unmounts
    return () => {
      picker.off("color:change");
    };
  }
}, []);



  const copyToClipboard = () => {
    navigator.clipboard.writeText(color);
    alert(`Copied ${color} to clipboard`);
  };

  const [r, g, b] = hexToRGB(color);
  const [h, s, v] = hexToHSV(color);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Color Picker
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Hue wheel + Opacity bar
          </p>
        </div>

        <div ref={colorPickerRef}></div>

        <div className="flex justify-between items-center gap-10 w-full my-[40px]">
          <div
            className="w-8 h-8 rounded-lg border border-gray-400"
            style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha})` }}
          />

          <button
            onClick={copyToClipboard}
            className="w-[100px] bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Copy
          </button>

          <input
            type="text"
            value={color}
            onChange={(e) => {
              const hex = e.target.value;
              setColor(hex);
              const isValidHex = /^#([0-9A-Fa-f]{6})$/i.test(hex);
              if (isValidHex) {
                const [newHue] = hexToHSV(hex);
                setHue(newHue);
              }
            }}
            className="text-[18px] border border-white text-white rounded-md px-4 py-1 w-[120px] bg-transparent"
          />
        </div>

        {/* RGB Fields */}
        <div className="flex items-center justify-between gap-10 w-full">
          {[{ label: "r", value: r }, { label: "g", value: g }, { label: "b", value: b }].map(
            (item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <label className="text-gray-600 capitalize">{item.label}</label>
                <input
                  value={item.value}
                  readOnly
                  className="w-full border px-2 py-1 text-center rounded"
                />
              </div>
            )
          )}
        </div>

        {/* HSV Fields */}
        <div className="flex items-center justify-between gap-10 w-full">
          {[{ label: "h", value: h }, { label: "s", value: s }, { label: "v", value: v }].map(
            (item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <label className="text-gray-600 capitalize">{item.label}</label>
                <input
                  value={item.value}
                  readOnly
                  className="w-full border px-2 py-1 text-center rounded"
                />
              </div>
            )
          )}
        </div>

        {/* QR Code with selected color */}
        <div className="flex flex-col items-center justify-center mt-6 space-y-2">
          <QRCodeSVG
            value="https://www.youtube.com/"
            size={160}
            fgColor={`rgba(${r}, ${g}, ${b}, ${alpha})`}
            bgColor="#ffffff"
            level="H"
            includeMargin={true}
          />
          <p className="text-sm text-gray-600">QR Code with selected color</p>
        </div>
      </div>
    </div>
  );
}

