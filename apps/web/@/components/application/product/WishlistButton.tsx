"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

export default function WishlistButton({ productId }: { productId: string }) {
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleToggleWishlist = () => {
    // Implement wishlist toggle logic here
    setIsInWishlist(!isInWishlist);
    console.log(
      `${isInWishlist ? "Removed from" : "Added to"} wishlist: ${productId}`,
    );
  };

  return (
    <button
      type="button"
      className={`p-3 rounded-md border ${
        isInWishlist
          ? "bg-pink-500 border-pink-500"
          : "border-gray-600 hover:border-pink-500"
      } transition-colors duration-200`}
      onClick={handleToggleWishlist}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={`w-6 h-6 ${isInWishlist ? "fill-current" : ""}`} />
    </button>
  );
}
