"use client";
import React, { useState } from "react";
import LogoTextColor from "./LogoTextColor"; // make sure the path is correct

function Main({ colorType, setColorType, solidColor, setSolidColor }) {
  const [colorTarget, setColorTarget] = useState("all"); // "logo", "text", "background", "all"

  return (
    <div
      className="card"
      style={{
        backgroundColor: solidColor,
        padding: "24px",
        minHeight: "100vh",
      }}
    >
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

          {/* Conditionally render LogoTextColor when 'all' is selected */}
          {colorTarget === "all" && (
               <LogoTextColor
            colorType={colorType}
            setColorType={setColorType}
            solidColor={solidColor}
            setSolidColor={setSolidColor}
          />
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;
