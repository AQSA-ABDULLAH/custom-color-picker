import React, { useState, useEffect } from "react";

function GradientColor({
  bgGradient,
  setbgGradient,
  colorTarget,
  setColorTarget,
  colorType,
  setColorType,
  initialGradientColors = ["#ff0000", "#ffffff"],
}) {
  const [color1, setColor1] = useState(initialGradientColors[0]);
  const [color2, setColor2] = useState(initialGradientColors[1]);
  const [angle, setAngle] = useState(90);
  const [bio, setBio] = useState("Write a short bio here...");
  const [uploadedSVG, setUploadedSVG] = useState("");

  const textGradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;

  // ✅ Only update background when color/angle changes AND target is background or all
  useEffect(() => {
    if (colorTarget !== "background" && colorTarget !== "all") return;

    const gradientString = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    setbgGradient(gradientString);
    localStorage.setItem("bgGradient", gradientString);
  }, [color1, color2, angle, setbgGradient]);

  const handleSVGUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedSVG(reader.result);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid SVG file.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Angle Control */}
      <div>
        <label className="block font-semibold mb-1">Gradient Angle (deg):</label>
        <input
          type="number"
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          className="border border-black px-2 py-1 rounded w-24"
        />
      </div>

      {/* Color Pickers */}
      <div className="flex gap-4">
        <div>
          <label className="block font-semibold mb-1">Color 1:</label>
          <input
            type="color"
            value={color1}
            onChange={(e) => setColor1(e.target.value)}
            className="w-12 h-12 p-0 border border-black rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Color 2:</label>
          <input
            type="color"
            value={color2}
            onChange={(e) => setColor2(e.target.value)}
            className="w-12 h-12 p-0 border border-black rounded"
          />
        </div>
      </div>

      {/* Bio with Gradient Text */}
      <div className="space-y-2">
        <label className="block font-semibold mb-1">Your Bio:</label>
        <textarea
          rows={4}
          className="w-[320px] p-2 border rounded text-[15px]"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write your bio here..."
          style={{
            backgroundColor: "#ffffff",
            backgroundImage: textGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        />
      </div>

      {/* SVG Upload */}
      <div className="space-y-2">
        <label className="block font-semibold mb-1">Upload SVG Logo:</label>
        <input
          type="file"
          accept=".svg"
          onChange={handleSVGUpload}
          className="block border border-black p-1 rounded w-fit"
        />

        {/* SVG Preview */}
        {uploadedSVG && (
          <div
            className="mt-4 p-4 border rounded"
            dangerouslySetInnerHTML={{ __html: uploadedSVG }}
          />
        )}
      </div>
    </div>
  );
}

export default GradientColor;

