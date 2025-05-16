"use client";
import React, { useState } from "react";

function LogoTextColor() {
  const [logoFile, setLogoFile] = useState(null);
  const [svgContent, setSvgContent] = useState("");
  const [colorType, setColorType] = useState("solid");
  const [solidColor, setSolidColor] = useState("#ff0000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff"); // ✅ Added background color
  const [bio, setBio] = useState("");

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

    let coloredSvg = svgContent;

    if (colorType === "solid") {
      // Remove all inline fill attributes
      coloredSvg = coloredSvg.replace(/fill="[^"]*"/g, "");

      // Inject a <style> into the <svg> to apply the fill color to all child elements
      coloredSvg = coloredSvg.replace(
        /<svg([^>]*)>/,
        `<svg$1><style>* { fill: ${solidColor} !important; }</style>`
      );
    }

    return (
      <div
      className="p-10"
      style={{ backgroundColor }}
      dangerouslySetInnerHTML={{ __html: coloredSvg }} // ✅ fixed typo here
    />
    );
  };

  return (
    <div className="px-60 py-5 space-y-4">
      {/* Upload Logo */}
      <div>
        <label className="block font-medium mb-1">
          Upload Logo (SVG Only):
        </label>
        <input type="file" accept=".svg" onChange={handleLogoUpload} />
        {logoFile && (
          <div className="mt-4">
            <p className="text-sm mb-1">Preview:</p>
            {renderSvgWithColor()}
          </div>
        )}
      </div>

      {/* Text/Logo Color Picker */}
      <div className="flex items-center gap-2">
        <label className="font-medium">Logo and Text Color:</label>
        <input
          type="color"
          value={solidColor}
          onChange={(e) => setSolidColor(e.target.value)}
        />
      </div>

      {/* Background Color Picker */}
      <div className="flex items-center gap-2">
        <label className="font-medium">Background Color:</label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
      </div>

      {/* Bio Input with Applied Color */}
      <div>
        <label className="block font-medium mb-1">Your Bio:</label>
        <textarea
          rows={4}
          className="w-full p-2 border rounded text-[15px] font-bold"
          placeholder="Write a short bio here..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          style={{
            color: solidColor,
            backgroundColor: backgroundColor, // ✅ Apply background here too
          }}
        />
      </div>
    </div>
  );
}

export default LogoTextColor;

