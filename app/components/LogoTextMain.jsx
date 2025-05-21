"use client";
import React, { useState } from "react";
import GradientComponent from "./LogoTextGradientColor";
import Main from "../components/LogoTextSolidColor/Main";

function LogoTextMain() {
  const [colorType, setColorType] = useState("solid");
  const [solidColor, setSolidColor] = useState("#ff0000");

  return (
    <div className="space-y-4">
      {/* Color Picker / Gradient Picker */}
      <div>
        {colorType === "solid" ? (
          <Main
            colorType={colorType}
            setColorType={setColorType}
            solidColor={solidColor}
            setSolidColor={setSolidColor}
          />
        ) : (
          <GradientComponent
            colorType={colorType}
            setColorType={setColorType}
            initialGradientColors={[solidColor, "#ffffff"]}
          />
        )}
      </div>
    </div>
  );
}

export default LogoTextMain;

