"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export default function AddToCartButton({ productId }: { productId: string }) {
  const handleAddToCart = () => {
    // Implement add to cart logic here
    console.log(`Added product ${productId} to cart`);
  };

  return (
    <Button
      type="button"
      size="lg"
      className="flex-1"
      onClick={handleAddToCart}
    >
      <ShoppingCart />
      Add to Cart
    </Button>
  );
}
