"use client";
import React, { useEffect, useRef, useState } from "react";
import iro from "@jaames/iro";

// Helper functions
const hexToRGB = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

const hexToHSV = (hex) => {
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

const rgbToHSLA = ([r, g, b]) => {
  const a = 1;
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }

  return `hsla(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, ${a})`;
};

const rgbToOklch = ([r, g, b]) => {
  // Dummy conversion; replace with a real OKLCH converter for accurate values
  return `oklch(${(r + g + b) / 3} 0.14 200)`;
};

function LogoTextColor({ colorType, setColorType, solidColor, setSolidColor }) {
  const [logoFile, setLogoFile] = useState(null);
  const [svgContent, setSvgContent] = useState("");
  const [color, setColor] = useState(solidColor || "#ff0000");
  const [bio, setBio] = useState("");

  const colorPickerRef = useRef(null);
  const pickerInstance = useRef(null);

  useEffect(() => {
    if (colorPickerRef.current && !pickerInstance.current) {
      pickerInstance.current = new iro.ColorPicker(colorPickerRef.current, {
        width: 160,
        color: solidColor,
        borderWidth: 1,
        borderColor: "#fff",
        layout: [
          { component: iro.ui.Wheel },
          { component: iro.ui.Slider, options: { sliderType: "hue" } },
          { component: iro.ui.Slider, options: { sliderType: "value" } },
          { component: iro.ui.Slider, options: { sliderType: "alpha" } },
        ],
      });

      pickerInstance.current.on("color:change", (newColor) => {
        setSolidColor(newColor.hexString);
        setColor(newColor.hexString);
      });
    }
  }, []);

  useEffect(() => {
    setSolidColor(color);
  }, [color]);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSvgContent(event.target.result);
        setLogoFile(file);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid SVG file.");
    }
  };

  const renderSvgWithColor = () => {
    if (!svgContent) return null;

    let coloredSvg = svgContent.replace(/fill="[^"]*"/g, "");
    coloredSvg = coloredSvg.replace(
      /<svg([^>]*)>/,
      `<svg$1><style>* { fill: ${solidColor} !important; }</style>`
    );

    return (
      <div
        className="p-4 w-[320px]"
        style={{ backgroundColor: "#ffffff" }}
        dangerouslySetInnerHTML={{ __html: coloredSvg }}
      />
    );
  };

  const [r, g, b] = hexToRGB(color);
  const [h, s, v] = hexToHSV(color);
  const hsla = rgbToHSLA([r, g, b]);
  const oklchString = rgbToOklch([r, g, b]);

  return (
    <div
      className="card"
      style={{ backgroundColor: solidColor, padding: "24px", minHeight: "100vh" }}
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-[50rem] bg-white px-6 py-6 shadow rounded space-y-8">
          <label htmlFor="colorType" className="block mb-2 font-semibold">
            Select Color Type:
          </label>
          <select
            value={colorType}
            onChange={(e) => setColorType(e.target.value)}
            className="border border-black px-2 py-1 rounded"
          >
            <option value="solid">Solid Color</option>
            <option value="gradient">Gradient</option>
          </select>

          <section className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">Upload Logo:</h3>
                <label className="flex items-center justify-center mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition duration-300">
                  Upload SVG
                  <input type="file" accept=".svg" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
              {logoFile && (
                <div className="mt-4">
                  <p className="text-lg mb-1 font-semibold">Preview:</p>
                  {renderSvgWithColor()}
                </div>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Your Bio:</label>
              <textarea
                rows={4}
                className="w-[320px] p-2 border rounded text-[15px] font-bold"
                placeholder="Write a short bio here..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ color: solidColor, backgroundColor: "#ffffff" }}
              />
            </div>
          </section>

          <section className="flex flex-col items-center gap-6">
            <div>
              <label className="font-medium">Logo & Text Color:</label>
              <div ref={colorPickerRef} className="mt-2" />
            </div>
            <input
              type="text"
              value={color}
              onChange={(e) => {
                const hex = e.target.value;
                setColor(hex);
              }}
              className="text-[18px] border rounded-md px-4 py-1 w-[120px] bg-transparent"
            />
          </section>

          <div className="grid grid-cols-3 gap-4">
            {[{ label: "r", value: r }, { label: "g", value: g }, { label: "b", value: b }].map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <label className="text-gray-600 capitalize">{item.label}</label>
                <div className="w-[80px] border px-2 py-1 text-center rounded">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[{ label: "h", value: h }, { label: "s", value: s }, { label: "v", value: v }].map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <label className="text-gray-600 capitalize">{item.label}</label>
                <div className="w-[80px] border px-2 py-1 text-center rounded">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-sm w-full">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-md shadow">
              <span className="font-semibold text-gray-800">HSLA</span>
              <code className="text-xs px-2 py-1 bg-white text-blue-700 rounded">{hsla}</code>
            </div>

            <div className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-md shadow">
              <span className="font-semibold text-gray-800">OKLCH</span>
              <code className="text-xs px-2 py-1 bg-white text-green-700 rounded">{oklchString}</code>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LogoTextColor;
