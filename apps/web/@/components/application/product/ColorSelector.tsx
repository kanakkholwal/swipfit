"use client";

import { useState } from "react";

export default function ColorSelector({ colors }: { colors: string[] }) {
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Color</h3>
      <div className="flex space-x-2">
        {colors.map((color) => (
          <button
            type="button"
            key={color}
            className={`w-8 h-8 rounded-full border-2 ${
              selectedColor === color ? "border-cyan-400" : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
            aria-label={`Select ${color} color`}
          />
        ))}
      </div>
    </div>
  );
}
