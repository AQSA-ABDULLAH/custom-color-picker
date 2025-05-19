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

  const gradientStops = gradientColors
    .map(
      (color, index) =>
        `<stop offset="${(index / (gradientColors.length - 1)) * 100}%" stop-color="${color}" />`
    )
    .join("");

  // Define a horizontal gradient as default
  const gradientDef = `
    <defs>
      <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
        ${gradientStops}
      </linearGradient>
    </defs>
  `;

  // Clean SVG: remove inline fills & styles
  let modifiedSvg = svgContent
    .replace(/<style[^>]*>.*?<\/style>/gs, "") // remove <style> blocks
    .replace(/fill="[^"]*"/g, "") // remove inline fill
    .replace(/<svg([^>]*)>/, `<svg$1>${gradientDef}`)
    .replace(/<(path|rect|circle|polygon|ellipse|g)(\s|>)/g, `<$1 fill="url(#${gradientId})"$2`);

  return (
    <div
      className="p-4 w-[320px]"
      style={{ backgroundColor: "#ffffff" }}
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
                  <label className="block font-medium mt-4 mb-2">Direction</label>
                  <div className="grid grid-cols-4 gap-2 w-[180px]">
                    {[315, 0, 45, 270, 90].map((deg) => (
                      <button
                        key={deg}
                        onClick={() => setAngle(deg)}
                        className={`border p-1 rounded ${
                          angle === deg
                            ? "bg-gray-800 text-white"
                            : "bg-white text-gray-800"
                        }`}
                      >
                        {deg}°
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
              setColor={setColor}
              setAlpha={setAlpha}
              angle={angle}
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

