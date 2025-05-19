"use client";
import { useState } from "react";
import ColorPickerGroup from "./ColorPickerGroup";

const hexToRGB = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

export default function GradientComponent({
  colorType,
  setColorType,
  initialGradientColors = ["#ff0000", "#ffffff"],
}) {
  const [gradientColors, setGradientColors] = useState(initialGradientColors);
  const [hexInputs, setHexInputs] = useState(initialGradientColors);
  const [gradientType, setGradientType] = useState("linear");
  const [angle, setAngle] = useState(90);
  // const [gradientAngle, setGradientAngle] = useState(90);

  const [color, setColor] = useState(gradientColors[0]);
  const [alpha, setAlpha] = useState(1);

  const [logoFile, setLogoFile] = useState(null);
  const [svgContent, setSvgContent] = useState(null);
  const [bio, setBio] = useState("");

  const gradientCSS =
    gradientType === "linear"
      ? `linear-gradient(${angle}deg, ${gradientColors.join(", ")})`
      : gradientType === "conic"
      ? `conic-gradient(from ${angle}deg, ${gradientColors.join(", ")})`
      : `radial-gradient(circle, ${gradientColors.join(", ")})`;

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

  const renderSvgWithGradient = () => {
    if (!svgContent) return null;

    const gradientId = "gradientFill";

    // Generate gradient stops
    const gradientStops = gradientColors
      .map(
        (color, index) =>
          `<stop offset="${
            (index / (gradientColors.length - 1)) * 100
          }%" stop-color="${color}" />`
      )
      .join("");

    // Gradient direction logic
    let gradientDef = "";

    if (gradientType === "linear") {
      // Convert angle to x1, y1, x2, y2

      const a = angle - 90 + 360;
      const angleRad = (a * Math.PI) / 180;
      const x1 = 50 - Math.cos(angleRad) * 50;
      const y1 = 50 - Math.sin(angleRad) * 50;
      const x2 = 50 + Math.cos(angleRad) * 50;
      const y2 = 50 + Math.sin(angleRad) * 50;

      gradientDef = `
      <defs>
        <linearGradient id="${gradientId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
          ${gradientStops}
        </linearGradient>
      </defs>
    `;
    } else if (gradientType === "radial") {
      gradientDef = `
      <defs>
        <radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%">
          ${gradientStops}
        </radialGradient>
      </defs>
    `;
    } else if (gradientType === "conic") {
      // Conic is not natively supported in SVG; simulate using pattern or fallback to radial
      // Example fallback:
      gradientDef = `
      <defs>
        <radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%">
          ${gradientStops}
        </radialGradient>
      </defs>
    `;
    }

    // Clean and inject SVG
    let modifiedSvg = svgContent
      .replace(/<style[^>]*>.*?<\/style>/gs, "")
      .replace(/fill="[^"]*"/g, "")
      .replace(/stroke="[^"]*"/g, "")
      .replace(/<svg([^>]*)>/, `<svg$1>${gradientDef}`)
      .replace(
        /<(path|rect|circle|polygon|ellipse|g)(\s|>)/g,
        `<$1 fill="url(#${gradientId})"$2`
      );

    return (
      <div
        className="p-4 w-[320px] bg-white"
        dangerouslySetInnerHTML={{ __html: modifiedSvg }}
      />
    );
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
        <div className="w-full max-w-[800px] bg-white p-6 rounded-xl shadow-md space-y-8">
             <label htmlFor="colorType" className="block mb-2 font-semibold">
            Select Color Type:
          </label>
          <select
            value={colorType}
            onChange={(e) => setColorType(e.target.value)}
            className="border-1 border-black"
          >
            <option value="solid">Solid Color</option>
            <option value="gradient">Gradient</option>
          </select>
          <h3 className="text-xl font-semibold">CSS Gradient Generator</h3>

          <section className="flex flex-col lg:flex-row gap-8 items-center justify-between w-[100%]">
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
                          <svg width="12" height="12" viewBox="0 0 12 12">
                            <path d="M.557 1.208a.692.692 0 0 1 .651-.651L6.886.178a.776.776 0 0 1 .811.682.691.691 0 0 1-.643.78l-4.129.275 6.292 6.292c.293.293.305.757.026 1.036-.28.279-.743.267-1.036-.026L1.915 2.925 1.64 7.054a.691.691 0 0 1-.78.643.776.776 0 0 1-.682-.811l.379-5.678z" />
                          </svg>
                        ),
                      },
                      {
                        deg: 0,
                        svg: (
                          <svg width="12" height="12" viewBox="0 0 12 12">
                            <path d="M4.54.177a.692.692 0 0 1 .92 0l4.283 3.747a.776.776 0 0 1 .091 1.056.691.691 0 0 1-1.006.096L5.714 2.351v8.899c0 .414-.32.75-.714.75-.394 0-.714-.336-.714-.75V2.351L1.172 5.076A.691.691 0 0 1 .166 4.98a.776.776 0 0 1 .091-1.056L4.539.177z" />
                          </svg>
                        ),
                      },
                      {
                        deg: 45,
                        svg: (
                          <svg width="12" height="12" viewBox="0 0 12 12">
                            <path d="M8.792.557a.692.692 0 0 1 .651.651l.379 5.678a.776.776 0 0 1-.682.811.691.691 0 0 1-.78-.643l-.275-4.129-6.292 6.292c-.293.293-.757.305-1.036.026C.478 8.963.49 8.5.783 8.207l6.292-6.292-4.129-.275a.691.691 0 0 1-.643-.78.776.776 0 0 1 .811-.682l5.678.379z" />
                          </svg>
                        ),
                      },
                      {
                        deg: 90,
                        svg: (
                          <svg width="12" height="12" viewBox="0 0 12 12">
                            <path d="M11.823 4.54a.692.692 0 0 1 0 .92L8.076 9.744a.776.776 0 0 1-1.056.091.691.691 0 0 1-.096-1.006l2.725-3.114H.75C.336 5.714 0 5.394 0 5c0-.394.336-.714.75-.714h8.899L6.924 1.172A.691.691 0 0 1 7.02.166a.776.776 0 0 1 1.056.091l3.747 4.282z" />
                          </svg>
                        ),
                      },
                      {
                        deg: 270,
                        svg: (
                          <svg width="12" height="12" viewBox="0 0 12 12">
                            <path d="M.177 5.46a.692.692 0 0 1 0-.92L3.924.256A.776.776 0 0 1 4.98.166a.691.691 0 0 1 .096 1.006L2.351 4.286h8.899c.414 0 .75.32.75.714 0 .394-.336.714-.75.714H2.351l2.725 3.114a.691.691 0 0 1-.096 1.006.776.776 0 0 1-1.056-.091L.177 5.461z" />
                          </svg>
                        ),
                      },
                      {
                        deg: 225,
                        svg: (
                          <svg width="12" height="12" viewBox="0 0 12 12">
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
                    ].map(({ deg, svg }) => (
                      <button
                        key={deg}
                        onClick={() => setAngle(deg)}
                        className={`flex items-center justify-center border p-1 rounded w-10 h-10 ${
                          angle === deg
                            ? "bg-gray-800 text-white"
                            : "bg-white text-gray-800"
                        }`}
                        title={`${deg}°`}
                      >
                        {svg}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <ColorPickerGroup
              gradientColors={gradientColors}
              setGradientColors={setGradientColors}
              hexInputs={hexInputs}
              setHexInputs={setHexInputs}
              color={color}
              setColor={setColor}
              alpha={alpha}
              setAlpha={setAlpha}
            />
          </section>

          <section className="flex items-start justify-between gap-6">
            {/* Upload Logo */}
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">Upload Logo:</h3>
                <label className="flex items-center justify-center mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition duration-300 w-fit">
                  Upload SVG
                  <input
                    type="file"
                    accept=".svg"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {logoFile && (
                <div className="mt-4">
                  <p className="text-lg mb-1 font-semibold">Preview:</p>
                  {renderSvgWithGradient()}
                </div>
              )}
            </div>

            {/* Bio Input with Gradient Text */}
            <div>
              <label className="block font-medium mb-1">Your Bio:</label>
              <textarea
                rows={4}
                className="w-[320px] p-2 border rounded text-[15px] font-bold"
                placeholder="Write a short bio here..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{
                  backgroundColor: "#ffffff",
                  backgroundImage: gradientCSS,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
