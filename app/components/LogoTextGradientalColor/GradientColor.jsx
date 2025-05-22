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

  // Handle background gradient update
 useEffect(() => {
  const gradientString = `linear-gradient(${angle}deg, ${color1}, ${color2})`;

  if (colorTarget === "background" || colorTarget === "all") {
    setbgGradient(gradientString);
    localStorage.setItem("bgGradient", gradientString);
  }

  if (colorTarget === "text" || colorTarget === "all") {
    // Text gradient is already handled inline via `textGradient`
    // But if you need to store it, you can do so here too
    localStorage.setItem("textGradient", gradientString);
  }

  if (colorTarget === "logo" || colorTarget === "all") {
    // Trigger SVG re-render with updated gradient fill
    if (uploadedSVG) {
      handleSVGInjection(uploadedSVG, color1, color2, angle);
    }
  }
}, [color1, color2, angle]);

 useEffect(() => {
    if (colorTarget !== "background" && colorTarget !== "all") return;

    const gradientString = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    setbgGradient(gradientString);
    localStorage.setItem("bgGradient", gradientString);
  }, [color1, color2, angle, colorTarget, setbgGradient]);

  // Handle SVG upload and inject gradient fill
  const handleSVGUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => {
        const originalSVG = reader.result;

        // Parse SVG and create gradient definition
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(originalSVG, "image/svg+xml");
        const svgEl = svgDoc.documentElement;

        // Remove existing defs to avoid duplicates
        const existingDefs = svgEl.querySelector("defs");
        if (existingDefs) {
          svgEl.removeChild(existingDefs);
        }

        const defs = svgDoc.createElementNS("http://www.w3.org/2000/svg", "defs");
        const gradient = svgDoc.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        gradient.setAttribute("id", "gradient");
        gradient.setAttribute("gradientUnits", "userSpaceOnUse");

        // Calculate x1, y1, x2, y2 based on angle
        const angleInRad = (angle * Math.PI) / 180;
        const x1 = 50 - 50 * Math.cos(angleInRad);
        const y1 = 50 - 50 * Math.sin(angleInRad);
        const x2 = 50 + 50 * Math.cos(angleInRad);
        const y2 = 50 + 50 * Math.sin(angleInRad);

        gradient.setAttribute("x1", `${x1}%`);
        gradient.setAttribute("y1", `${y1}%`);
        gradient.setAttribute("x2", `${x2}%`);
        gradient.setAttribute("y2", `${y2}%`);

        // Create stops
        const stop1 = svgDoc.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", color1);
        gradient.appendChild(stop1);

        const stop2 = svgDoc.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop2.setAttribute("offset", "100%");
        stop2.setAttribute("stop-color", color2);
        gradient.appendChild(stop2);

        defs.appendChild(gradient);
        svgEl.insertBefore(defs, svgEl.firstChild);

        // Apply gradient fill to common fillable tags
        const fillableTags = ["path", "rect", "circle", "ellipse", "polygon", "text"];
        fillableTags.forEach((tag) => {
          const elements = svgEl.getElementsByTagName(tag);
          for (let el of elements) {
            el.setAttribute("fill", "url(#gradient)");
            // Optional: remove inline style fill if present
            el.removeAttribute("style");
          }
        });

        const serializer = new XMLSerializer();
        const updatedSVG = serializer.serializeToString(svgEl);
        setUploadedSVG(updatedSVG);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid SVG file.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Gradient Angle */}
      <div>
        <label className="block font-semibold mb-1">Gradient Angle (deg):</label>
        <input
          type="number"
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          className="border border-black px-2 py-1 rounded w-24"
          min={0}
          max={360}
        />
      </div>

      {/* Colors */}
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

      {/* Bio with gradient text */}
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


