// utils/ColorDisplay.js
import React from "react";

export const RGBDisplay = ({ r, g, b }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[{ label: "r", value: r }, { label: "g", value: g }, { label: "b", value: b }].map((item, i) => (
        <div key={i} className="flex gap-3 items-center">
          <label className="text-gray-600 capitalize">{item.label}</label>
          <div className="w-[80px] border px-2 py-1 text-center rounded">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

export const HSVDisplay = ({ h, s, v }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[{ label: "h", value: h }, { label: "s", value: s }, { label: "v", value: v }].map((item, i) => (
        <div key={i} className="flex gap-3 items-center">
          <label className="text-gray-600 capitalize">{item.label}</label>
          <div className="w-[80px] border px-2 py-1 text-center rounded">{item.value}</div>
        </div>
      ))}
    </div>
  );
};

export const OtherFormatsDisplay = ({ hsla, oklchString }) => {
  return (
    <div className="space-y-4 text-sm w-full">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-md shadow">
        <span className="font-semibold text-gray-800">HSLA</span>
        <code className="text-xs px-2 py-1 bg-white text-blue-700 rounded">
          {hsla}
        </code>
      </div>

      <div className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-md shadow">
        <span className="font-semibold text-gray-800">OKLCH</span>
        <code className="text-xs px-2 py-1 bg-white text-green-700 rounded">
          {oklchString}
        </code>
      </div>
    </div>
  );
};
