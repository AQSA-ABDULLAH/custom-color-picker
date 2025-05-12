"use client";

import { useState } from "react";

// Convert HSV to HEX
function HSVtoHex(h: number, s: number, v: number) {
  let f = (n: number, k = (n + h / 60) % 6) =>
    v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  const r = Math.round(f(5) * 255);
  const g = Math.round(f(3) * 255);
  const b = Math.round(f(1) * 255);
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

// Convert HEX to RGB string
const hexToRGB = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b]; // ✅ return array
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
  const [color, setColor] = useState(HSVtoHex(0, 1, 1));
  const [copied, setCopied] = useState(false);
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });

  const handleHueChange = (e: React.MouseEvent | MouseEvent) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const angle = Math.atan2(y, x) * (180 / Math.PI);
    const newHue = (angle + 360) % 360;
    setHue(newHue);

    const newHex = HSVtoHex(newHue, 1, 1);
    setColor(newHex);

    setPointerPos({ x, y });
  };

  const handleAlphaChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const newAlpha = 1 - y / rect.height;
    setAlpha(Math.max(0, Math.min(1, newAlpha)));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `rgba(${hexToRGB(color).join(", ")}, ${alpha.toFixed(2)})`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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

        <section className="flex gap-6 justify-center items-center cursor-pointer">
          <div
            onMouseDown={(e) => {
              handleHueChange(e);

              const onMouseMove = (e: MouseEvent) => handleHueChange(e as any);
              const onMouseUp = () => {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
              };

              document.addEventListener("mousemove", onMouseMove);
              document.addEventListener("mouseup", onMouseUp);
            }}
            className="w-44 h-44 rounded-full border border-gray-300 dark:border-gray-700 relative"
            style={{
              background:
                "conic-gradient(from 90deg, red, yellow, lime, cyan, blue, magenta, red)",
            }}
          >
            {/* Pointer that shows hue angle */}
            <div
              className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none"
              style={{
                backgroundColor: color,
                top: "50%",
                left: "50%",
                transform: `translate(${pointerPos.x}px, ${pointerPos.y}px)`,
              }}
            />
          </div>

          <div
            onClick={handleAlphaChange}
            className="h-44 w-5 relative cursor-pointer border-1"
            style={{
              background: `linear-gradient(to top, rgba(${r}, ${g}, ${b}, 0), rgba(${r}, ${g}, ${b}, 1))`,
            }}
          >
            <div
              className="absolute left-[-7px] w-8 h-[10px] shadow-sm rounded-sm border-2 border-black"
              style={{
                top: `${(1 - alpha) * 100}%`,
                transform: "translateY(-50%)",
              }}
            />
          </div>
        </section>

        <div className="flex justify-between items-center gap-10 w-full my-[40px]">
          <div
            className="w-8 h-8 rounded-lg border-1"
            style={{ backgroundColor: `rgba(${hexToRGB(color)}, ${alpha})` }}
          />

          <button onClick={copyToClipboard} className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <button className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="text-[18px] text-gray-800 border-1 rounded-md px-4">
            {color}
          </div>
        </div>

        {/* RGB Fields */}
        <div className="flex items-center justify-between gap-10 w-full">
          {[
            { label: "r", value: r },
            { label: "g", value: g },
            { label: "b", value: b },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-center">
              <label className="text-gray-600 capitalize">{item.label}</label>
              <input
                value={item.value}
                readOnly
                className="w-full border px-2 py-1 text-center rounded"
              />
            </div>
          ))}
        </div>

        {/* HSV Fields */}
        <div className="flex items-center justify-between gap-10 w-full">
          {[
            { label: "h", value: h },
            { label: "s", value: s },
            { label: "v", value: v },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-center">
              <label className="text-gray-600 capitalize">{item.label}</label>
              <input
                value={item.value}
                readOnly
                className="w-full border px-2 py-1 text-center rounded"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
