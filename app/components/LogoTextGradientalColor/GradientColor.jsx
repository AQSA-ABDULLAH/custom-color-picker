import React, { useState, useEffect } from "react";
import ColorPickerGroup from "../ColorPickerGroup";
import angleOptions from "./angleOptions";

function GradientColor({
  bgGradient,
  setbgGradient,
  colorTarget,
  setColorTarget,
  colorType,
  setColorType,
  initialGradientColors = ["#ff0000", "#ffffff"],
  ...props
}) {
  const [gradientColors, setGradientColors] = useState(initialGradientColors);
  const [hexInputs, setHexInputs] = useState(initialGradientColors);
  const [gradientType, setGradientType] = useState("linear"); // added state for gradient type
  const [angle, setAngle] = useState(90);
  const [bio, setBio] = useState("Write a short bio here...");
  const [uploadedSVG, setUploadedSVG] = useState("");

  const color1 = gradientColors[0];
  const color2 = gradientColors[1];

  const textGradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;

  const [storedTextGradient, setStoredTextGradient] = useState(
    () => localStorage.getItem("textGradient") || textGradient
  );

  useEffect(() => {
    if (colorTarget === "background" || colorTarget === "all") {
      const gradientString =
        gradientType === "radial"
          ? `radial-gradient(circle, ${color1}, ${color2})`
          : `linear-gradient(${angle}deg, ${color1}, ${color2})`;
      setbgGradient(gradientString);
      localStorage.setItem("bgGradient", gradientString);
    }
  }, [color1, color2, angle, gradientType, setbgGradient]);

  useEffect(() => {
    if (colorTarget === "text" || colorTarget === "all") {
      const gradientString =
        gradientType === "radial"
          ? `radial-gradient(circle, ${color1}, ${color2})`
          : `linear-gradient(${angle}deg, ${color1}, ${color2})`;
      localStorage.setItem("textGradient", gradientString);
      setStoredTextGradient(gradientString);
    }
  }, [color1, color2, angle, gradientType]);

  useEffect(() => {
    if ((colorTarget === "logo" || colorTarget === "all") && uploadedSVG) {
      const updatedSVG = injectGradientToSVG(
        uploadedSVG,
        color1,
        color2,
        angle
      );
      setUploadedSVG(updatedSVG);
    }
  }, [color1, color2, angle, uploadedSVG]);

  const handleSVGUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => {
        const originalSVG = reader.result;
        const updatedSVG = injectGradientToSVG(
          originalSVG,
          color1,
          color2,
          angle
        );
        setUploadedSVG(updatedSVG);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid SVG file.");
    }
  };

  const injectGradientToSVG = (originalSVG, color1, color2, angle) => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(originalSVG, "image/svg+xml");
    const svgEl = svgDoc.documentElement;

    const existingDefs = svgEl.querySelector("defs");
    if (existingDefs) svgEl.removeChild(existingDefs);

    const defs = svgDoc.createElementNS("http://www.w3.org/2000/svg", "defs");
    const gradient = svgDoc.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient"
    );

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

    const fillableTags = [
      "path",
      "rect",
      "circle",
      "ellipse",
      "polygon",
      "text",
    ];
    fillableTags.forEach((tag) => {
      const elements = svgEl.getElementsByTagName(tag);
      Array.from(elements).forEach((el) => {
        el.setAttribute("fill", "url(#gradient)");
        el.removeAttribute("style");
      });
    });

    return new XMLSerializer().serializeToString(svgEl);
  };

  return (
    <div className="gradient-color-container">
      {/* Gradient type selector */}
      <div>
        <label>Gradient Type:</label>
        <select
          value={gradientType}
          onChange={(e) => setGradientType(e.target.value)}
          className="rounded border px-2 py-1"
        >
          <option value="linear">Linear</option>
          <option value="radial">Radial</option>
          <option value="conic">Conic</option>
        </select>
      </div>

      {/* Color picker group */}
      <ColorPickerGroup
        gradientColors={gradientColors}
        setGradientColors={setGradientColors}
        hexInputs={hexInputs}
        setHexInputs={setHexInputs}
      />

      {/* Angle selector - show only if gradient is linear */}
      {gradientType === "linear" && (
        <div className="angle-selector mt-3 flex gap-1">
          {angleOptions.map(({ deg, svg }) => (
            <button
              key={deg}
              title={`${deg}°`}
              onClick={() => setAngle(deg)}
              className={`rounded border p-1 hover:bg-gray-200 ${
                angle === deg ? "bg-gray-300" : ""
              }`}
            >
              {svg}
            </button>
          ))}
        </div>
      )}

      {/* Show the current CSS gradient as a preview box */}
      <div className="space-y-2">
        <label className="block font-semibold mb-1">Your Bio:</label>
        <textarea
          rows={4}
          className="w-[320px] p-2 border rounded text-[15px]"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Write your bio here..."
          style={{
            backgroundImage:
              colorTarget === "text" || colorTarget === "all"
                ? textGradient
                : storedTextGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        />
      </div>

      <div className="space-y-2">
        <label className="block font-semibold mb-1">Upload SVG Logo:</label>
        <input
          type="file"
          accept=".svg"
          onChange={handleSVGUpload}
          className="block border border-black p-1 rounded w-fit"
        />
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

// import React, { useState, useEffect } from "react";
// import ColorPickerGroup from "../ColorPickerGroup";

// function GradientColor({
//   bgGradient,
//   setbgGradient,
//   colorTarget,
//   setColorTarget,
//   colorType,
//   setColorType,
//   initialGradientColors = ["#ff0000", "#ffffff"],
// }) {
//   const [gradientColors, setGradientColors] = useState(initialGradientColors);
//   const color1 = gradientColors[0];
// const color2 = gradientColors[1];

//   const [hexInputs, setHexInputs] = useState(initialGradientColors);
//   const [gradientType, setGradientType] = useState("linear");
//   const [angle, setAngle] = useState(90);
//   const [bio, setBio] = useState("Write a short bio here...");
//   const [uploadedSVG, setUploadedSVG] = useState("");

//   const textGradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;

//   const [storedTextGradient, setStoredTextGradient] = useState(
//     () => localStorage.getItem("textGradient") || textGradient
//   );

//  // Update background gradient only when target is "background" or "all"
//   useEffect(() => {
//     if (colorTarget === "background" || colorTarget === "all") {
//       const gradientString = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
//       setbgGradient(gradientString);
//       localStorage.setItem("bgGradient", gradientString);
//     }
//   }, [color1, color2, angle, setbgGradient]);

//   useEffect(() => {
//     if (colorTarget === "text" || colorTarget === "all") {
//       const gradientString = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
//       localStorage.setItem("textGradient", gradientString);
//       setStoredTextGradient(gradientString);
//     }
//   }, [color1, color2, angle, colorTarget]);

//   useEffect(() => {
//     if ((colorTarget === "logo" || colorTarget === "all") && uploadedSVG) {
//       const updatedSVG = injectGradientToSVG(
//         uploadedSVG,
//         color1,
//         color2,
//         angle
//       );
//       setUploadedSVG(updatedSVG);
//     }
//   }, [color1, color2, angle, uploadedSVG, colorTarget]);

//   const handleSVGUpload = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type === "image/svg+xml") {
//       const reader = new FileReader();
//       reader.onload = () => {
//         const originalSVG = reader.result;
//         const updatedSVG = injectGradientToSVG(
//           originalSVG,
//           color1,
//           color2,
//           angle
//         );
//         setUploadedSVG(updatedSVG);
//       };
//       reader.readAsText(file);
//     } else {
//       alert("Please upload a valid SVG file.");
//     }
//   };

//   const injectGradientToSVG = (originalSVG, color1, color2, angle) => {
//     const parser = new DOMParser();
//     const svgDoc = parser.parseFromString(originalSVG, "image/svg+xml");
//     const svgEl = svgDoc.documentElement;

//     const existingDefs = svgEl.querySelector("defs");
//     if (existingDefs) svgEl.removeChild(existingDefs);

//     const defs = svgDoc.createElementNS("http://www.w3.org/2000/svg", "defs");
//     const gradient = svgDoc.createElementNS(
//       "http://www.w3.org/2000/svg",
//       "linearGradient"
//     );

//     gradient.setAttribute("id", "gradient");
//     gradient.setAttribute("gradientUnits", "userSpaceOnUse");

//     const angleRad = (angle * Math.PI) / 180;
//     const x1 = 50 - 50 * Math.cos(angleRad);
//     const y1 = 50 - 50 * Math.sin(angleRad);
//     const x2 = 50 + 50 * Math.cos(angleRad);
//     const y2 = 50 + 50 * Math.sin(angleRad);

//     gradient.setAttribute("x1", `${x1}%`);
//     gradient.setAttribute("y1", `${y1}%`);
//     gradient.setAttribute("x2", `${x2}%`);
//     gradient.setAttribute("y2", `${y2}%`);

//     const stop1 = svgDoc.createElementNS("http://www.w3.org/2000/svg", "stop");
//     stop1.setAttribute("offset", "0%");
//     stop1.setAttribute("stop-color", color1);
//     gradient.appendChild(stop1);

//     const stop2 = svgDoc.createElementNS("http://www.w3.org/2000/svg", "stop");
//     stop2.setAttribute("offset", "100%");
//     stop2.setAttribute("stop-color", color2);
//     gradient.appendChild(stop2);

//     defs.appendChild(gradient);
//     svgEl.insertBefore(defs, svgEl.firstChild);

//     const fillableTags = [
//       "path",
//       "rect",
//       "circle",
//       "ellipse",
//       "polygon",
//       "text",
//     ];
//     fillableTags.forEach((tag) => {
//       const elements = svgEl.getElementsByTagName(tag);
//       Array.from(elements).forEach((el) => {
//         el.setAttribute("fill", "url(#gradient)");
//         el.removeAttribute("style");
//       });
//     });

//     return new XMLSerializer().serializeToString(svgEl);
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <label className="block font-semibold mb-1">
//           Gradient Angle (deg):
//         </label>
//         <input
//           type="number"
//           value={angle}
//           onChange={(e) => setAngle(Number(e.target.value))}
//           className="border border-black px-2 py-1 rounded w-24"
//           min={0}
//           max={360}
//         />
//       </div>

//       <ColorPickerGroup
//         gradientColors={gradientColors}
//         setGradientColors={setGradientColors}
//         hexInputs={hexInputs}
//         setHexInputs={setHexInputs}
//         setColor={(newColor, index) => {
//           setGradientColors((prev) => {
//             const updated = [...prev];
//             updated[index] = newColor;
//             return updated;
//           });
//         }}
//       />

//       <div className="space-y-2">
//         <label className="block font-semibold mb-1">Your Bio:</label>
//         <textarea
//           rows={4}
//           className="w-[320px] p-2 border rounded text-[15px]"
//           value={bio}
//           onChange={(e) => setBio(e.target.value)}
//           placeholder="Write your bio here..."
//           style={{
//             backgroundImage:
//               colorTarget === "text" || colorTarget === "all"
//                 ? textGradient
//                 : storedTextGradient,
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//           }}
//         />
//       </div>

//       <div className="space-y-2">
//         <label className="block font-semibold mb-1">Upload SVG Logo:</label>
//         <input
//           type="file"
//           accept=".svg"
//           onChange={handleSVGUpload}
//           className="block border border-black p-1 rounded w-fit"
//         />
//         {uploadedSVG && (
//           <div
//             className="mt-4 p-4 border rounded"
//             dangerouslySetInnerHTML={{ __html: uploadedSVG }}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// export default GradientColor;
