"use client";
import React, { useState, useEffect } from "react";
import LogoTextColor from "./LogoTextColor"; // make sure the path is correct
import GradientColor from "../LogoTextGradientalColor/GradientColor";

function Main({ colorType, setColorType }) {
  const [colorTarget, setColorTarget] = useState("all");
  const [bgColor, setBgColor] = useState("#ff0000");
  const [solidColor, setSolidColor] = useState("#ff0000");
  const [bgGradient, setbgGradient] = useState("#ff0000"); // fallback color

  // ✅ Load bgGradient from localStorage on mount
  useEffect(() => {
    const savedBgGradient = localStorage.getItem("bgGradient");
    if (savedBgGradient) {
      setbgGradient(savedBgGradient);
    }
  }, []);

  const containerStyle = {
    background: colorType === "solid" ? bgColor : bgGradient, 
    padding: "24px",
    minHeight: "100vh",
  };

  return (
    <div className="card" style={containerStyle}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-[50rem] bg-white px-6 py-6 shadow rounded space-y-8">
          <section className="flex items-center justify-between">
            <div>
              <label htmlFor="colorType" className="block mb-2 font-semibold">
                Select Color Type:
              </label>
              <select
                value={colorType}
                onChange={(e) => setColorType(e.target.value)}
                className="border border-black px-2 py-1 rounded"
              >
                <option value="solid">Solid Color</option>
                <option value="gradient">Gradient</option>
              </select>
            </div>
            <div>
              <label htmlFor="colorTarget" className="block mb-2 font-semibold">
                Select Color Target:
              </label>
              <select
                value={colorTarget}
                onChange={(e) => setColorTarget(e.target.value)}
                className="border border-black px-2 py-1 rounded"
              >
                <option value="logo">Logo</option>
                <option value="text">Text</option>
                <option value="background">Background</option>
                <option value="all">All</option>
              </select>
            </div>
          </section>

          {colorType === "solid" ? (
            <LogoTextColor
              colorTarget={colorTarget}
              setColorTarget={setColorTarget}
              colorType={colorType}
              setColorType={setColorType}
              solidColor={solidColor}
              setSolidColor={setSolidColor}
              bgColor={bgColor}
              setBgColor={setBgColor}
            />
          ) : (
            <GradientColor
              bgGradient={bgGradient}
              setbgGradient={setbgGradient}
              colorTarget={colorTarget}
              setColorTarget={setColorTarget}
              colorType={colorType}
              setColorType={setColorType}
              initialGradientColors={[solidColor, "#ffffff"]}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;





















  // <GradientComponent
  //             bgGradient={bgGradient}
  //             setbgGradient={setbgGradient}
  //             colorTarget={colorTarget}
  //             setColorTarget={setColorTarget}
  //             colorType={colorType}
  //             setColorType={setColorType}
  //             initialGradientColors={[solidColor, "#ffffff"]}
  //           />