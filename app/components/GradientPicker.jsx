"use client";
import { useEffect, useRef, useState } from "react";
import iro from "@jaames/iro";

const hexToRGB = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

export default function GradientComponent() {
  const [gradientColors, setGradientColors] = useState(["#ff0000", "#0000ff"]);
  const [gradientType, setGradientType] = useState("linear");
  const [angle, setAngle] = useState(90);

  const colorPickerRefs = useRef([]);
  const pickerInstances = useRef([]);

  const [color, setColor] = useState(gradientColors[0]);
  const [alpha, setAlpha] = useState(1);

  const [r, g, b] = hexToRGB(color);
  const gradientCSS =
    gradientType === "linear"
      ? `linear-gradient(${angle}deg, ${gradientColors.join(", ")})`
      : `radial-gradient(circle, ${gradientColors.join(", ")})`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied to clipboard:\n${text}`);
  };

  useEffect(() => {
    // Clear previous pickers
    pickerInstances.current.forEach((picker) => picker?.off?.("color:change"));
    pickerInstances.current = [];

    // Create color pickers only once when DOM is ready
    gradientColors.forEach((col, index) => {
      const container = colorPickerRefs.current[index];

      // Prevent reinitializing the same picker
      if (container && !container.hasChildNodes()) {
        const picker = new iro.ColorPicker(container, {
          width: 180,
          color: col,
          borderWidth: 1,
          borderColor: "#fff",
          layout: [
            { component: iro.ui.Wheel },
            { component: iro.ui.Slider, options: { sliderType: "hue" } },
            { component: iro.ui.Slider, options: { sliderType: "value" } },
            { component: iro.ui.Slider, options: { sliderType: "alpha" } },
          ],
        });

        picker.on("color:change", (newColor) => {
          setGradientColors((prevColors) => {
            const newColors = [...prevColors];
            newColors[index] = newColor.hexString;
            return newColors;
          });

          setColor(newColor.hexString);
          setAlpha(newColor.alpha);
        });

        pickerInstances.current.push(picker);
      }
    });
  }, []);

  return (
    <div
      className="card"
      style={{
        backgroundColor: `grey`,
        padding: "24px",
        minHeight: "100vh",
      }}
    >
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-[600px] bg-white p-6 rounded-xl shadow-md space-y-8">
          <h3 className="text-xl font-semibold">CSS Gradient Generator</h3>

          {/* Dynamic Color Pickers for Gradient Stops */}
          <div className="flex flex-wrap justify-between gap-4">
            {gradientColors.map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div ref={(el) => (colorPickerRefs.current[index] = el)} />
              </div>
            ))}
          </div>

          {/* Gradient Settings */}
          <div className="flex gap-4 items-center flex-wrap">
            <label>Type:</label>
            <select
              value={gradientType}
              onChange={(e) => setGradientType(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
            {gradientType === "linear" && (
              <>
                <label>Angle:</label>
                <input
                  type="number"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-[60px] border px-2 py-1 rounded"
                />
              </>
            )}
          </div>

          {/* Gradient Preview */}
          <div
            className="h-[150px] w-full rounded-md border"
            style={{ background: gradientCSS }}
          />

          {/* Copy Button */}
          <button
            onClick={() => copyToClipboard(`background: ${gradientCSS};`)}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Copy Gradient CSS
          </button>
        </div>
      </div>
    </div>
  );
}
