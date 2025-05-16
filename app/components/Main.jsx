"use client";
import React, { useState } from "react";
import ColorPickerComponent from "./ColorPicker";
import GradientComponent from "./GradientPicker";

function Main() {
  const [colorType, setColorType] = useState("solid");
  const [solidColor, setSolidColor] = useState("#ff0000"); // NEW

  return (
    <div>
      {colorType === "solid" && (
        <ColorPickerComponent
          colorType={colorType}
          setColorType={setColorType}
          solidColor={solidColor}
          setSolidColor={setSolidColor} // NEW
        />
      )}

      {colorType === "gradient" && (
        <GradientComponent
          colorType={colorType}
          setColorType={setColorType}
          initialGradientColors={[solidColor, "#ffffff"]} // NEW
        />
      )}
    </div>
  );
}

export default Main;


