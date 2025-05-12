"use client";
import React, { useState } from "react";

function CustomColorPicker() {
  const [color, setColor] = useState("#ff0000");

  const hexToRGB = (hex) => {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split("");
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      const rgb = [
        parseInt(c[0] + c[1], 16),
        parseInt(c[2] + c[3], 16),
        parseInt(c[4] + c[5], 16),
      ];
      return `rgb(${rgb.join(", ")})`;
    }
    return "Invalid HEX";
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(color);
    alert(`Copied ${color} to clipboard`);
  };

  return (
    <div className="max-w-md mx-auto space-y-6 p-4">
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Color Picker
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Pick a color and copy its values.
        </p>
      </div>

      <div
        className="w-full h-48 rounded-lg border-4"
        style={{ backgroundColor: color }}
      />

      <div className="text-center space-y-2">
        <div className="text-xl font-semibold text-gray-800 dark:text-white">
          {color}
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          RGB: {hexToRGB(color)}
        </div>
        <button
          onClick={copyToClipboard}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Copy to Clipboard
        </button>
      </div>

      <section className=" flex gap-[40px]">
        <div className="rounded-full w-44 h-44 shadow-inner border border-gray-300 dark:border-gray-700 overflow-hidden">
          <div
            className="sketch-picker"
            style={{
              width: "100%",
              boxSizing: "initial",
              background: "transparent",
              borderRadius: "0px",
              boxShadow: "none",
            }}
          >
            {/* COLOR PALLET */}
            <div
              style={{
                width: "100%",
                paddingBottom: "100%",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "hsl(0,100%, 50%)",
                }}
              >
                <div
                  className="saturation-white"
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    background:
                      "linear-gradient(to right, #fff, rgba(255,255,255,0))",
                  }}
                >
                  <div
                    className="saturation-black"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0,
                      background:
                        "linear-gradient(to top, #000, rgba(0,0,0,0))",
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      top: "17.6471%",
                      left: "84.7619%",
                      cursor: "default",
                    }}
                  >
                    <div
                      style={{
                        width: "4px",
                        height: "4px",
                        boxShadow:
                          "0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3), 0 0 1px 2px rgba(0,0,0,.4)",
                        borderRadius: "50%",
                        transform: "translate(-2px, -2px)",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div>
          <div style={{ display: "flex" }}>
            <div style={{ padding: "4px 0", flex: 1 }}>
              <div
                style={{
                  position: "relative",
                  height: "100px",
                  width: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  className="hue-vertical"
                  style={{
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(to bottom, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
                  }}
                >
                  <div style={{ position: "absolute", left: "0%" }}>
                    <div
                      style={{
                        marginLeft: "1px",
                        width: "8px",
                        height: "4px",
                        borderRadius: "1px",
                        boxShadow: "0 0 2px rgba(0, 0, 0, 0.6)",
                        background: "#fff",
                        transform: "translateY(-2px)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-5 gap-2 text-xs text-center">
        {[
       
          { label: "r", value: hexToRGB(color).split("(")[1]?.split(",")[0] },
          { label: "g", value: hexToRGB(color).split(",")[1]?.trim() },
          {
            label: "b",
            value: hexToRGB(color).split(",")[2]?.replace(")", "").trim(),
          },
          { label: "a", value: "100" },
        ].map((item, i) => (
          <div key={i}>
            <input
              value={item.value}
              readOnly
              className="w-full border px-2 py-1 text-center rounded"
            />
            <label className="block pt-1 text-gray-600 capitalize">
              {item.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomColorPicker;

// import React from "react";

// function CustomColorPicker() {
//   return (
//     <>
//       <div className="text-center space-y-1">
//         <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
//           Color Picker
//         </h2>
//         <p className="text-gray-600 dark:text-gray-300">
//           Pick a color and copy its values.
//         </p>
//       </div>

//       <div
//         className="w-full h-48 rounded-lg border-4"
//         style={{ backgroundColor: color }}
//       />

//       <div className="text-center space-y-2">
//         <div className="text-xl font-semibold text-gray-800 dark:text-white">
//           {color}
//         </div>
//         <div className="text-gray-500 dark:text-gray-400">
//           RGB: {hexToRGB(color)}
//         </div>
//         <button
//           onClick={copyToClipboard}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
//         >
//           Copy to Clipboard
//         </button>
//       </div>

//       <section className=" flex gap-[40px]">
//         <div className="rounded-full w-44 h-44 shadow-inner border border-gray-300 dark:border-gray-700 overflow-hidden">
//           <div
//             className="sketch-picker"
//             style={{
//               width: "100%",
//               boxSizing: "initial",
//               background: "transparent",
//               borderRadius: "0px",
//               boxShadow: "none",
//             }}
//           >
//             {/* COLOR PALLET */}
//             <div
//               style={{
//                 width: "100%",
//                 paddingBottom: "100%",
//                 position: "relative",
//                 overflow: "hidden",
//               }}
//             >
//               <div
//                 style={{
//                   position: "absolute",
//                   inset: 0,
//                   background: "hsl(0,100%, 50%)",
//                 }}
//               >
//                 <div
//                   className="saturation-white"
//                   style={{
//                     position: "absolute",
//                     top: 0,
//                     right: 0,
//                     bottom: 0,
//                     left: 0,
//                     background:
//                       "linear-gradient(to right, #fff, rgba(255,255,255,0))",
//                   }}
//                 >
//                   <div
//                     className="saturation-black"
//                     style={{
//                       position: "absolute",
//                       top: 0,
//                       right: 0,
//                       bottom: 0,
//                       left: 0,
//                       background:
//                         "linear-gradient(to top, #000, rgba(0,0,0,0))",
//                     }}
//                   ></div>
//                   <div
//                     style={{
//                       position: "absolute",
//                       top: "17.6471%",
//                       left: "84.7619%",
//                       cursor: "default",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "4px",
//                         height: "4px",
//                         boxShadow:
//                           "0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3), 0 0 1px 2px rgba(0,0,0,.4)",
//                         borderRadius: "50%",
//                         transform: "translate(-2px, -2px)",
//                       }}
//                     ></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* SIDEBAR */}
//         <div>
//           <div style={{ display: "flex" }}>
//             <div style={{ padding: "4px 0", flex: 1 }}>
//               <div
//                 style={{
//                   position: "relative",
//                   height: "100px",
//                   width: "10px",
//                   overflow: "hidden",
//                 }}
//               >
//                 <div
//                   className="hue-vertical"
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     background:
//                       "linear-gradient(to bottom, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
//                   }}
//                 >
//                   <div style={{ position: "absolute", left: "0%" }}>
//                     <div
//                       style={{
//                         marginLeft: "1px",
//                         width: "8px",
//                         height: "4px",
//                         borderRadius: "1px",
//                         boxShadow: "0 0 2px rgba(0, 0, 0, 0.6)",
//                         background: "#fff",
//                         transform: "translateY(-2px)",
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <div>
//         {/* Input fields */}
//         <div style={{ display: "flex", paddingTop: "4px" }}>
//           {["000000", "0", "0", "0", "100"].map((val, i) => (
//             <div key={i} style={{ flex: 1, paddingLeft: i === 0 ? 0 : "6px" }}>
//               <div style={{ position: "relative" }}>
//                 <input
//                   style={{
//                     width: "80%",
//                     padding: "4px 10% 3px",
//                     border: "none",
//                     boxShadow: "inset 0 0 0 1px #ccc",
//                     fontSize: "11px",
//                   }}
//                   spellCheck={false}
//                   defaultValue={val}
//                 />
//                 <label
//                   style={{
//                     display: "block",
//                     textAlign: "center",
//                     fontSize: "11px",
//                     color: "#222",
//                     paddingTop: "3px",
//                     paddingBottom: "4px",
//                     textTransform: "capitalize",
//                   }}
//                 >
//                   {["hex", "r", "g", "b", "a"][i]}
//                 </label>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

// export default CustomColorPicker;
