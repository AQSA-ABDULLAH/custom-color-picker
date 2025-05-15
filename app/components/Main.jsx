"use client";
import React, { useState } from 'react';
import ColorPickerComponent from './ColorPicker';
import GradientComponent from './GradientPicker';

function Main() {
  const [colorType, setColorType] = useState('solid');

  return (
    <div className="p-4">
      <label htmlFor="colorType" className="block mb-2 font-semibold">
        Select Color Type:
      </label>
      <select
        id="colorType"
        value={colorType}
        onChange={(e) => setColorType(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2"
      >
        <option value="solid">Solid Color</option>
        <option value="gradient">Gradient</option>
      </select>

      <div className="mt-4">
        {colorType === 'solid' ? (
          <ColorPickerComponent />
        ) : (
          <GradientComponent />
        )}
      </div>
    </div>
  );
}

export default Main;

