"use client";
import { useEffect, useRef, useState } from "react";
import ColorPickerGroup from "./ColorPickerGroup"; // adjust path as needed

import GradientQRCode from "./GradientQRCode";

import iro from "@jaames/iro";

const hexToRGB = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

export default function GradientComponent() {
  const [gradientColors, setGradientColors] = useState(["#ff0000", "#0000ff"]);
  const [hexInputs, setHexInputs] = useState(["#ff0000", "#0000ff"]);
  const [gradientType, setGradientType] = useState("linear");
  const [angle, setAngle] = useState(90);
  const [qrValue, setQrValue] = useState("https://example.com");

  const colorPickerRefs = useRef([]);
  const pickerInstances = useRef([]);

  const [color, setColor] = useState(gradientColors[0]);
  const [alpha, setAlpha] = useState(1);

  const [r, g, b] = hexToRGB(color);
  const gradientCSS =
    gradientType === "linear"
      ? `linear-gradient(${angle}deg, ${gradientColors.join(", ")})`
      : gradientType === "conic"
      ? `conic-gradient(from ${angle}deg, ${gradientColors.join(", ")})`
      : `radial-gradient(circle, ${gradientColors.join(", ")})`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied to clipboard:\n${text}`);
  };

  useEffect(() => {
    pickerInstances.current = [];

    gradientColors.forEach((col, index) => {
      const container = colorPickerRefs.current[index];

      if (container && !container.hasChildNodes()) {
        const picker = new iro.ColorPicker(container, {
          width: 150,
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

          setHexInputs((prev) => {
            const updated = [...prev];
            updated[index] = newColor.hexString;
            return updated;
          });

          setColor(newColor.hexString);
          setAlpha(newColor.alpha);
        });

        pickerInstances.current[index] = picker;
      }
    });
  }, []);

  // Sync pickers when gradientColors change
  useEffect(() => {
    gradientColors.forEach((color, index) => {
      const picker = pickerInstances.current[index];
      if (
        picker &&
        picker.color.hexString.toLowerCase() !== color.toLowerCase()
      ) {
        picker.color.hexString = color;
      }
    });
  }, [gradientColors]);

  const handleHexInputChange = (value, index) => {
    const formatted = value.startsWith("#") ? value : `#${value}`;

    setHexInputs((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });

    if (/^#([0-9A-Fa-f]{6})$/.test(formatted)) {
      setGradientColors((prev) => {
        const updated = [...prev];
        updated[index] = formatted;
        return updated;
      });
    }
  };

  return (
    <div
      className="card"
      style={{
        background: gradientCSS,
        padding: "24px",
        minHeight: "100vh",
      }}
    >
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-[600px] bg-white p-6 rounded-xl shadow-md space-y-8">
          <h3 className="text-xl font-semibold">CSS Gradient Generator</h3>

          <section className="flex justify-between w-[100%]">
            <div>
              {/* Gradient Type Selection */}
              <div>
                <label className="block font-medium mb-2">Style</label>
                <div className="flex gap-2">
                  {["linear", "radial", "conic"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setGradientType(type)}
                      className={`px-[6px] py-1 rounded border ${
                        gradientType === type
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-800"
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direction Buttons (only for linear/conic) */}
              {gradientType !== "radial" && (
                <div>
                  <label className="block font-medium mt-4 mb-2">
                    Direction
                  </label>
                  <div className="grid grid-cols-4 gap-2 w-[180px]">
                    {[
                      {
                        deg: 315,
                        svg: (
                          <svg width="10" height="10">
                            <path d="M.557 1.208a.692.692 0 0 1 .651-.651L6.886.178a.776.776 0 0 1 .811.682.691.691 0 0 1-.643.78l-4.129.275 6.292 6.292c.293.293.305.757.026 1.036-.28.279-.743.267-1.036-.026L1.915 2.925 1.64 7.054a.691.691 0 0 1-.78.643.776.776 0 0 1-.682-.811l.379-5.678z" />
                          </svg>
                        ),
                      },
                      {
                        deg: 0,
                        svg: (
                          <svg width="10" height="12">
                            <path d="M4.54.177a.692.692 0 0 1 .92 0l4.283 3.747a.776.776 0 0 1 .091 1.056.691.691 0 0 1-1.006.096L5.714 2.351v8.899c0 .414-.32.75-.714.75-.394 0-.714-.336-.714-.75V2.351L1.172 5.076A.691.691 0 0 1 .166 4.98a.776.776 0 0 1 .091-1.056L4.539.177z" />
                          </svg>
                        ),
                      },
                      {
                        deg: 45,
                        svg: (
                          <svg width="10" height="10">
                            <path d="M8.792.557a.692.692 0 0 1 .651.651l.379 5.678a.776.776 0 0 1-.682.811.691.691 0 0 1-.78-.643l-.275-4.129-6.292 6.292c-.293.293-.757.305-1.036.026C.478 8.963.49 8.5.783 8.207l6.292-6.292-4.129-.275a.691.691 0 0 1-.643-.78.776.776 0 0 1 .811-.682l5.678.379z" />
                          </svg>
                        ),
                      },
                      {
                        deg: 270,
                        svg: (
                          <svg width="12" height="10">
                            <path d="M.177 5.46a.692.692 0 0 1 0-.92L3.924.256A.776.776 0 0 1 4.98.166a.691.691 0 0 1 .096 1.006L2.351 4.286h8.899c.414 0 .75.32.75.714 0 .394-.336.714-.75.714H2.351l2.725 3.114a.691.691 0 0 1-.096 1.006.776.776 0 0 1-1.056-.091L.177 5.461z" />
                          </svg>
                        ),
                      },
                      {
                        deg: 90,
                        svg: (
                          <svg width="12" height="10">
                            <path d="M11.823 4.54a.692.692 0 0 1 0 .92L8.076 9.744a.776.776 0 0 1-1.056.091.691.691 0 0 1-.096-1.006l2.725-3.114H.75C.336 5.714 0 5.394 0 5c0-.394.336-.714.75-.714h8.899L6.924 1.172A.691.691 0 0 1 7.02.166a.776.776 0 0 1 1.056.091l3.747 4.282z" />
                          </svg>
                        ),
                      },
                      {
                        deg: 225,
                        svg: (
                          <svg width="10" height="10">
                            <path d="M1.208 9.443a.692.692 0 0 1-.651-.651L.178 3.114a.776.776 0 0 1 .682-.811.691.691 0 0 1 .78.643l.275 4.129L8.207.783C8.5.49 8.964.478 9.243.757c.279.28.267.743-.026 1.036L2.925 8.085l4.129.275a.69.69 0 0 1 .643.78.776.776 0 0 1-.811.682l-5.678-.379z" />
                          </svg>
                        ),
                      },
                      {
                        deg: 180,
                        svg: (
                          <svg width="10" height="12">
                            <path d="M5.46 11.823a.692.692 0 0 1-.92 0L.256 8.076a.776.776 0 0 1-.09-1.056.691.691 0 0 1 1.006-.096l3.114 2.725V.75c0-.414.32-.75.714-.75.394 0 .714.336.714.75v8.899l3.114-2.725a.691.691 0 0 1 1.006.096.776.776 0 0 1-.091 1.056l-4.282 3.747z" />
                          </svg>
                        ),
                      },
                      {
                        deg: 135,
                        svg: (
                          <svg width="10" height="10">
                            <path d="M9.443 8.792a.692.692 0 0 1-.651.651l-5.678.379a.776.776 0 0 1-.811-.682.691.691 0 0 1 .643-.78l4.129-.275L.783 1.793C.49 1.5.478 1.036.757.757c.28-.279.743-.267 1.036.026l6.292 6.292.275-4.129a.691.691 0 0 1 .78-.643.776.776 0 0 1 .682.811l-.379 5.678z" />
                          </svg>
                        ),
                      },
                    ].map((dir, idx) => (
                      <button
                        key={idx}
                        onClick={() => setAngle(dir.deg)}
                        className={`border py-1 px-2 rounded flex justify-center items-center ${
                          angle === dir.deg
                            ? "bg-blue-500 text-white"
                            : "bg-white"
                        }`}
                      >
                        {dir.svg}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-[60%] space-y-2">
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
          </section>

          <section className="flex justify-between items-center">
            {/* QR Code with Gradient */}
            <div>
              <div className="flex flex-col items-center gap-6">
      <GradientQRCode text="https://example.com" colors={gradientColors} />
    </div>
            </div>

            <div>
              <h1
                className="text-[20px] font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage: gradientCSS,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                TEXT COLOR
              </h1>

              <div className="flex gap-4 text-[18px]">
                <h1>RGB</h1>
                <p>{`rgb(${r}, ${g}, ${b})`}</p>
              </div>
            </div>
          </section>

          {/* Color Pickers + HEX Inputs */}
          <ColorPickerGroup
            gradientColors={gradientColors}
            setGradientColors={setGradientColors}
            hexInputs={hexInputs}
            setHexInputs={setHexInputs}
            setColor={setColor}
            setAlpha={setAlpha}
          />
        </div>
      </div>
    </div>
  );
}
