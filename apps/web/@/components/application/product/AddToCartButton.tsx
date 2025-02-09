"use client";

import { ShoppingCart } from "lucide-react";

export default function AddToCartButton({ productId }: { productId: string }) {
  const handleAddToCart = () => {
    // Implement add to cart logic here
    console.log(`Added product ${productId} to cart`);
  };

  return (
    <button
      type="button"
      className="flex-1 bg-cyan-400 text-black font-semibold py-3 px-6 rounded-md hover:bg-cyan-300 transition-colors duration-200 flex items-center justify-center"
      onClick={handleAddToCart}
    >
      <ShoppingCart className="w-5 h-5 mr-2" />
      Add to Cart
    </button>
  );
}
