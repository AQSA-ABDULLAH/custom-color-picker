"use client";
import React, { useState } from "react";
import LogoTextColor from "./LogoTextColor";
import GradientComponent from "./LogoTextGradientColor";

function LogoTextMain() {
  const [colorType, setColorType] = useState("solid");
  const [solidColor, setSolidColor] = useState("#ff0000");

  return (
    <div className="space-y-4">

      {/* Color Picker / Gradient Picker */}
      <div>
        {colorType === "solid" ? (
          <LogoTextColor
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

