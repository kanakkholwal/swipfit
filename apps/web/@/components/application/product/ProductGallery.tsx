"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductJson } from "~/types/product";

export default function ProductGallery({ images }: {images:ProductJson["images"]}) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <Image
          src={images[activeImage].url}
          alt="Product image"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            type="button"
            key={`product_image-${index.toString()}`}
            className={`relative aspect-square overflow-hidden rounded-md ${
              index === activeImage ? "ring-2 ring-cyan-400" : ""
            }`}
            onClick={() => setActiveImage(index)}
          >
            <Image
              src={image.url}
              alt={image.alt || `Product image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, (max-width: 1200px) 15vw, 10vw"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
