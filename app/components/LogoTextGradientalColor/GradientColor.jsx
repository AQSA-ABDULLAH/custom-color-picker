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

  // Inject gradient and update targets on change
  useEffect(() => {
    const gradientString = `linear-gradient(${angle}deg, ${color1}, ${color2})`;

    if (colorTarget === "background" || colorTarget === "all") {
      setbgGradient(gradientString);
      localStorage.setItem("bgGradient", gradientString);
    }

    if (colorTarget === "text" || colorTarget === "all") {
      localStorage.setItem("textGradient", gradientString);
    }

    if (colorTarget === "logo" || colorTarget === "all") {
      if (uploadedSVG) {
        const updatedSVG = injectGradientToSVG(uploadedSVG, color1, color2, angle);
        setUploadedSVG(updatedSVG);
      }
    }
  }, [color1, color2, angle, uploadedSVG, setbgGradient]);

  // Handle SVG Upload
  const handleSVGUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => {
        const originalSVG = reader.result;
        const updatedSVG = injectGradientToSVG(originalSVG, color1, color2, angle);
        setUploadedSVG(updatedSVG);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid SVG file.");
    }
  };

  // Inject gradient into SVG string
  const injectGradientToSVG = (originalSVG, color1, color2, angle) => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(originalSVG, "image/svg+xml");
    const svgEl = svgDoc.documentElement;

    // Remove old defs
    const existingDefs = svgEl.querySelector("defs");
    if (existingDefs) {
      svgEl.removeChild(existingDefs);
    }

    const defs = svgDoc.createElementNS("http://www.w3.org/2000/svg", "defs");
    const gradient = svgDoc.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    gradient.setAttribute("id", "gradient");
    gradient.setAttribute("gradientUnits", "userSpaceOnUse");

    const angleRad = (angle * Math.PI) / 180;
    const x1 = 50 - 50 * Math.cos(angleRad);
    const y1 = 50 - 50 * Math.sin(angleRad);
    const x2 = 50 + 50 * Math.cos(angleRad);
    const y2 = 50 + 50 * Math.sin(angleRad);

    gradient.setAttribute("x1", `${x1}%`);
    gradient.setAttribute("y1", `${y1}%`);
    gradient.setAttribute("x2", `${x2}%`);
    gradient.setAttribute("y2", `${y2}%`);

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

    const fillableTags = ["path", "rect", "circle", "ellipse", "polygon", "text"];
    fillableTags.forEach((tag) => {
      const elements = svgEl.getElementsByTagName(tag);
      for (let el of elements) {
        el.setAttribute("fill", "url(#gradient)");
        el.removeAttribute("style");
      }
    });

    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgEl);
  };

  return (
    <div className="space-y-6">
      {/* Gradient Angle Input */}
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

        {/* Preview Area */}
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

