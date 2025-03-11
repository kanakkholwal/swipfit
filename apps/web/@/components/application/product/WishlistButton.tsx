"use client";

import { Button } from "@/components/ui/button";
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
    <Button
      type="button"
      size="icon_lg"
      variant={isInWishlist ? "gradient_pink" : "outline"}
      effect="shineHover"
      onClick={handleToggleWishlist}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={`w-6 h-6 ${isInWishlist ? "fill-current" : ""}`} />
    </Button>
  );
}
