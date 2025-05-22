import React, { useState, useEffect } from "react";
import ColorPickerGroup from "../ColorPickerGroup";

function GradientColor({
  bgGradient,
  setbgGradient,
  colorTarget,
  setColorTarget,
  colorType,
  setColorType,
  initialGradientColors = ["#ff0000", "#ffffff"],
}) {
  const [gradientColors, setGradientColors] = useState(initialGradientColors);
  const [hexInputs, setHexInputs] = useState(initialGradientColors);
  const [gradientType, setGradientType] = useState("linear");  // added state for gradient type
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
      const updatedSVG = injectGradientToSVG(uploadedSVG, color1, color2, angle);
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

  // Angle selector buttons (show only if linear gradient)
  const angleOptions = [
    {
      deg: 315,
      svg: (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor">
          <path d="M.557 1.208a.692.692 0 0 1 .651-.651L6.886.178a.776.776 0 0 1 .811.682.691.691 0 0 1-.643.78l-4.129.275 6.292 6.292c.293.293.305.757.026 1.036-.28.279-.743.267-1.036-.026L1.915 2.925 1.64 7.054a.691.691 0 0 1-.78.643.776.776 0 0 1-.682-.811l.379-5.678z" />
        </svg>
      ),
    },
    { deg: 0, svg: <svg width="12" height="12" viewBox="0 0 12 12"><path d="M4.54.177a.692.692 0 0 1 .92 0l4.283 3.747a.776.776 0 0 1 .091 1.056.691.691 0 0 1-1.006.096L5.714 2.351v8.899c0 .414-.32.75-.714.75-.394 0-.714-.336-.714-.75V2.351L1.172 5.076A.691.691 0 0 1 .166 4.98a.776.776 0 0 1 .091-1.056L4.539.177z"/></svg> },
    { deg: 45, svg: <svg width="12" height="12" viewBox="0 0 12 12"><path d="M8.792.557a.692.692 0 0 1 .651.651l.379 5.678a.776.776 0 0 1-.682.811.691.691 0 0 1-.78-.643l-.275-4.129-6.292 6.292c-.293.293-.757.305-1.036.026C.478 8.963.49 8.5.783 8.207l6.292-6.292-4.129-.275a.691.691 0 0 1-.643-.78.776.776 0 0 1 .811-.682l5.678.379z"/></svg> },
    { deg: 90, svg: <svg width="12" height="12" viewBox="0 0 12 12"><path d="M11.823 4.54a.692.692 0 0 1 0 .92L8.076 9.744a.776.776 0 0 1-1.056.091.691.691 0 0 1-.096-1.006l2.725-3.114H.75C.336 5.714 0 5.394 0 5c0-.394.336-.714.75-.714h8.899L6.924 1.172A.691.691 0 0 1 7.02.166a.776.776 0 0 1 1.056.091l3.747 4.282z"/></svg> },
    { deg: 270, svg: <svg width="12" height="12" viewBox="0 0 12 12"><path d="M.177 5.46a.692.692 0 0 1 0-.92L3.924.256A.776.776 0 0 1 4.98.166a.691.691 0 0 1 .096 1.006L2.351 4.286h8.899c.414 0 .75.32.75.714 0 .394-.336.714-.75.714H2.351l2.725 3.114a.691.691 0 0 1-.096 1.006.776.776 0 0 1-1.056-.091L.177 5.461z"/></svg> },
    { deg: 225, svg: <svg width="12" height="12" viewBox="0 0 12 12"><path d="M1.208 9.443a.692.692 0 0 1-.651-.651L.178 3.114a.776.776 0 0 1 .682-.811.691.691 0 0 1 .78.643l.275 4.129L8.207.783C8.5.49 8.964.478 9.243.757c.279.28.267.743-.026 1.036L2.925 8.085l4.129.275a.69.69 0 0 1 .643.78.776.776 0 0 1-.811.682l-5.678-.379z"/></svg> },
    { deg: 180, svg: <svg width="10" height="12"><path d="M5.46 11.823a.692.692 0 0 1-.92 0L.256 8.076a.776.776 0 0 1-.09-1.056.691.691 0 0 1 1.006-.096l3.114 2.725V.75c0-.414.32-.75.714-.75.394 0 .714.336.714.75v8.899l3.114-2.725a.691.691 0 0 1 1.006.096.776.776 0 0 1-.091 1.056l-4.282 3.747z"/></svg> },
    { deg: 135, svg: <svg width="10" height="12"><path d="M3.207 9.443a.692.692 0 0 1-.651-.651l-.379-5.678a.776.776 0 0 1 .682-.811.691.691 0 0 1 .78.643l.275 4.129 6.292-6.292c.293-.293.757-.305 1.036-.026.279.28.267.743-.026 1.036L5.075 8.925l4.129.275a.691.691 0 0 1 .643.78.776.776 0 0 1-.811.682l-5.678-.379z"/></svg> },
  ];

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
