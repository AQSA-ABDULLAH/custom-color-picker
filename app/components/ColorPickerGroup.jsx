"use client";
import { useEffect, useRef } from "react";
import iro from "@jaames/iro";

const ColorPickerGroup = ({
  gradientColors,
  setGradientColors,
  hexInputs,
  setHexInputs,
  setColor,
  setAlpha,
  angle
}) => {
  const colorPickerRefs = useRef([]);
  const pickerInstances = useRef([]);

  useEffect(() => {
    pickerInstances.current = [];

    gradientColors.forEach((col, index) => {
      const container = colorPickerRefs.current[index];
      if (container && !container.hasChildNodes()) {
        const picker = new iro.ColorPicker(container, {
          width: 150,
          color: col,
          borderWidth: 1,
          borderColor: "#fff",
          layout: [
            { component: iro.ui.Wheel },
            { component: iro.ui.Slider, options: { sliderType: "hue" } },
            { component: iro.ui.Slider, options: { sliderType: "value" } },
            { component: iro.ui.Slider, options: { sliderType: "alpha" } },
          ],
        });

        picker.on("color:change", (newColor) => {
          setGradientColors((prev) => {
            const updated = [...prev];
            updated[index] = newColor.hexString;
            return updated;
          });

          setHexInputs((prev) => {
            const updated = [...prev];
            updated[index] = newColor.hexString;
            return updated;
          });

          setColor(newColor.hexString);
          setAlpha(newColor.alpha);
        });

        pickerInstances.current[index] = picker;
      }
    });
  }, []);

  useEffect(() => {
    gradientColors.forEach((color, index) => {
      const picker = pickerInstances.current[index];
      if (
        picker &&
        picker.color.hexString.toLowerCase() !== color.toLowerCase()
      ) {
        picker.color.hexString = color;
      }
    });
  }, [gradientColors]);

  const handleHexInputChange = (value, index) => {
    const formatted = value.startsWith("#") ? value : `#${value}`;

    setHexInputs((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });

    if (/^#([0-9A-Fa-f]{6})$/.test(formatted)) {
      setGradientColors((prev) => {
        const updated = [...prev];
        updated[index] = formatted;
        return updated;
      });
    }
  };

  return (
    <div className="flex flex-wrap justify-between gap-4">
      {gradientColors.map((_, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <div ref={(el) => (colorPickerRefs.current[index] = el)} />
          <input
            type="text"
            value={hexInputs[index]}
            onChange={(e) => handleHexInputChange(e.target.value, index)}
            className="border px-2 py-1 rounded w-[120px] text-center"
            maxLength={7}
          />
        </div>
      ))}
    </div>
  );
};

export default ColorPickerGroup;

