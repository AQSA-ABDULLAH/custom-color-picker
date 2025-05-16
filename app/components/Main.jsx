"use client";
import React, { useState } from "react";
import ColorPickerComponent from "./ColorPicker";
import GradientComponent from "./GradientPicker";

function Main() {
  const [colorType, setColorType] = useState("solid");
  const [solidColor, setSolidColor] = useState("#ff0000");

  return (
    <div className="p-4 space-y-4">

      {/* Color Picker / Gradient Picker */}
      <div>
        {colorType === "solid" ? (
          <ColorPickerComponent
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

export default Main;

