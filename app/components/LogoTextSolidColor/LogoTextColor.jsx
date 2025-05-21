"use client";
import React, { useEffect, useRef, useState } from "react";
import iro from "@jaames/iro";
import { RGBDisplay, HSVDisplay, OtherFormatsDisplay } from "./ColorDisplay"; // adjust path if needed
import { hexToRGB, hexToHSV, rgbToHSLA, rgbToOklch } from "./colorUtils";


function LogoTextColor({ solidColor, setSolidColor }) {
  const [logoFile, setLogoFile] = useState(null);
  const [svgContent, setSvgContent] = useState("");
  const [color, setColor] = useState(solidColor || "#ff0000");
  const [logoColor, setLogoColor] = useState("#ff0000");
  const [textColor, setTextColor] = useState("#ff0000");
  const [bgColor, setBgColor] = useState("#ffffff");

  useEffect(() => {
    const storedLogoColor = localStorage.getItem("logoColor");
    const storedTextColor = localStorage.getItem("textColor");
    const storedBgColor = localStorage.getItem("bgColor");

    if (storedLogoColor) setLogoColor(storedLogoColor);
    if (storedTextColor) setTextColor(storedTextColor);
    if (storedBgColor) setBgColor(storedBgColor);
  }, []);

  const [bio, setBio] = useState("");

  useEffect(() => {
    localStorage.setItem("logoColor", logoColor);
  }, [logoColor]);

  useEffect(() => {
    localStorage.setItem("textColor", textColor);
  }, [textColor]);

  useEffect(() => {
    localStorage.setItem("bgColor", bgColor);
  }, [bgColor]);

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
        setLogoColor(newColor.hexString); // For logo
        setTextColor(newColor.hexString); // For text
        setBgColor("#ffffff"); // Or set dynamically if your design supports it
      });
    }
  }, []);

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

    // Remove existing fill attributes
    let coloredSvg = svgContent.replace(/fill="[^"]*"/g, "");

    // Determine if logo color should be changed

    coloredSvg = coloredSvg.replace(
      /<svg([^>]*)>/,
      `<svg$1><style>* { fill: ${logoColor} !important; }</style>`
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[50rem] space-y-8">
        <section className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-semibold">Upload Logo:</h3>
              <label className="flex items-center justify-center mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition duration-300">
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

          <div>
            <label className="block font-medium mb-1">Your Bio:</label>
            <textarea
              rows={4}
              className="w-[320px] p-2 border rounded text-[15px] font-bold"
              placeholder="Write a short bio here..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{
                color: textColor,
                backgroundColor: "#fffff",
              }}
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

        <RGBDisplay r={r} g={g} b={b} />
        <HSVDisplay h={h} s={s} v={v} />
        <OtherFormatsDisplay hsla={hsla} oklchString={oklchString} />
      </div>
    </div>
  );
}

export default LogoTextColor;
