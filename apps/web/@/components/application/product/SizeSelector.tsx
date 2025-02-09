"use client";

import { useState } from "react";

export default function SizeSelector({ sizes }: { sizes: string[] }) {
  const [selectedSize, setSelectedSize] = useState(sizes[0]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Size</h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            type="button"
            key={size}
            className={`px-4 py-2 rounded-md border ${
              selectedSize === size
                ? "bg-cyan-400 text-black"
                : "border-gray-600 hover:border-cyan-400"
            }`}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
