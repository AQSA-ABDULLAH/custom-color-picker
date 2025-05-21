"use client";
import React, { useState } from "react";
import Main from "./LogoTextSolidColor/Main"

function LogoTextMain() {
  const [colorType, setColorType] = useState("solid");
  const [solidColor, setSolidColor] = useState("#ff0000");

  return (
    <div className="space-y-4">
      <Main
        colorType={colorType}
        setColorType={setColorType}
      />
    </div>
  );
}


export default LogoTextMain;

