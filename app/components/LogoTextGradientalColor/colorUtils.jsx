
const hexToRGB = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

const hexToCMYK = (hex) => {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Convert HEX to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Calculate K (black key)
  const k = 1 - Math.max(r, g, b);

  if (k === 1) {
    return [0, 0, 0, 1]; // Pure black
  }

  // Calculate CMY
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);

  return [
    parseFloat(c.toFixed(4)),
    parseFloat(m.toFixed(4)),
    parseFloat(y.toFixed(4)),
    parseFloat(k.toFixed(4)),
  ];
};


function colorUtils() {
  return (
    <div>
      
          <div className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-md shadow">
            <span className="font-semibold text-gray-800">RGB</span>
            <code className="text-xs px-2 py-1 bg-white text-green-700 rounded">
              <p>{`rgb(${r}, ${g}, ${b})`}</p>
            </code>
          </div>

          <div className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-md shadow mt-2">
            <span className="font-semibold text-gray-800">CMYK</span>
            <code className="text-xs px-2 py-1 bg-white text-blue-700 rounded">
              <p>{`cmyk(${(c * 100).toFixed(0)}%, ${(m * 100).toFixed(0)}%, ${(
                y * 100
              ).toFixed(0)}%, ${(k * 100).toFixed(0)}%)`}</p>
            </code>
          </div>
    </div>
  )
}

export default colorUtils
