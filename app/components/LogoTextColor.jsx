"use client";
import React, { useState } from 'react';

function LogoTextColor() {
  const [logoFile, setLogoFile] = useState(null);
  const [svgContent, setSvgContent] = useState("");
  const [colorType, setColorType] = useState("solid"); // Default to 'solid'
  const [solidColor, setSolidColor] = useState("#ff0000"); // Default solid color
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
      className="mt-4 w-32 h-32 border p-2"
      dangerouslySetInnerHTML={{ __html: coloredSvg }}
    />
  );
};

  return (
    <div className="p-4 space-y-4">
      {/* Upload Logo */}
      <div>
        <label className="block font-medium mb-1">Upload Logo (SVG Only):</label>
        <input type="file" accept=".svg" onChange={handleLogoUpload} />
        {logoFile && (
          <div className="mt-4">
            <p className="text-sm mb-1">Preview:</p>
            {renderSvgWithColor()}
          </div>
        )}
      </div>

      {/* Solid Color Picker */}
      <div className="flex items-center gap-2">
        <label className="font-medium">Color:</label>
        <input
          type="color"
          value={solidColor}
          onChange={(e) => setSolidColor(e.target.value)}
        />
      </div>

      {/* Bio Input with Applied Color */}
      <div>
        <label className="block font-medium mb-1">Your Bio:</label>
        <textarea
          rows={4}
          className="w-full p-2 border rounded"
          placeholder="Write a short bio here..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          style={{ color: solidColor }} // Apply color here
        />
      </div>
    </div>
  );
}

export default LogoTextColor;

