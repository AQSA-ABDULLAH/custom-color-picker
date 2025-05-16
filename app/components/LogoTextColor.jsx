"use client";
import React, { useEffect, useRef, useState } from "react";
import iro from "@jaames/iro";

function LogoTextColor() {
  const [logoFile, setLogoFile] = useState(null);
  const [svgContent, setSvgContent] = useState("");
  const [solidColor, setSolidColor] = useState("#ff0000");
  const [bio, setBio] = useState("");

  const colorPickerRef = useRef(null);
  const pickerInstance = useRef(null);

  // Logo/Text color picker
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
      });
    }
  }, []);

  useEffect(() => {
    if (
      pickerInstance.current &&
      pickerInstance.current.color.hexString.toLowerCase() !==
        solidColor.toLowerCase()
    ) {
      pickerInstance.current.color.hexString = solidColor;
    }
  }, [solidColor]);

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

  return (
    <div
      className="card"
      style={{
        backgroundColor: solidColor, // ← just use the variable directly
        padding: "24px",
        Height: "100vh",
      }}
    >
      <div className=" flex justify-center">
        <div className="w-[50rem] bg-white px-6 py-[17px] shadow rounded space-y-8">
          <section className="flex items-start justify-between">
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
                  {renderSvgWithColor()}
                </div>
              )}
            </div>

            {/* Bio Input with Applied Color */}
            <div>
              <label className="block font-medium mb-1">Your Bio:</label>
              <textarea
                rows={4}
                className="w-[320px] p-2 border rounded text-[15px] font-bold"
                placeholder="Write a short bio here..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{
                  color: solidColor,
                  backgroundColor: "#ffffff",
                }}
              />
            </div>
          </section>

          <section className="flex justify-start">
            {/* Logo & Text Color Picker */}
            <div>
              <label className="font-medium">Logo & Text Color:</label>
              <div ref={colorPickerRef} className="mt-2" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default LogoTextColor;
