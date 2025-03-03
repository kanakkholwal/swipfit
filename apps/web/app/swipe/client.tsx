"use client";
import { ImageSwiper } from "@/components/extended/image-swiper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, LogOut, RotateCcw, Sparkles, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ProductType } from "~/data";

export default function SwipePageClient({
  initialProducts,
}: {
  initialProducts: ProductType[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState<number[]>([]);
  const [likedOutfits, setLikedOutfits] = useState<string[]>([]);
  const [superLikedOutfits, setSuperLikedOutfits] = useState<string[]>([]);

  const currentOutfit = initialProducts[currentIndex];

  const handleSwipe = (direction: "left" | "right" | "super") => {
    if (currentIndex >= initialProducts.length - 1) return;

    setSwipeHistory([...swipeHistory, currentIndex]);

    if (direction === "right") {
      setLikedOutfits([...likedOutfits, currentOutfit.slug]);
    } else if (direction === "super") {
      setSuperLikedOutfits([...superLikedOutfits, currentOutfit.slug]);
    }

    setCurrentIndex(currentIndex + 1);
  };

  const handleUndo = () => {
    if (swipeHistory.length === 0) return;

    const previousIndex = swipeHistory[swipeHistory.length - 1];
    const previousOutfitId = initialProducts[previousIndex].slug;

    setCurrentIndex(previousIndex);
    setSwipeHistory(swipeHistory.slice(0, -1));
    setLikedOutfits(likedOutfits.filter((id) => id !== previousOutfitId));
    setSuperLikedOutfits(
      superLikedOutfits.filter((id) => id !== previousOutfitId),
    );
  };

  if (currentIndex >= initialProducts.length) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/50">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">No More Outfits</h2>
          <p className="text-muted-foreground mb-6">
            You&apos;ve seen all available outfits. Check back later for more
            recommendations!
          </p>
          <Button onClick={() => setCurrentIndex(0)}>Start Over</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="in-h-[calc(100vh-4rem)] max-w-md mx-auto space-y-8">
      {/* Outfit Card */}
      <Card className="relative overflow-hidden aspect-[3/4] bg-gradient-to-t from-black/60 to-transparent">
        {currentOutfit.images.length > 1 ? (
          <ImageSwiper
            images={currentOutfit.images}
            key={currentIndex}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <Image
            src={currentOutfit.images[0].url}
            alt={currentOutfit.description}
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
          <h3 className="text-xl font-bold">{currentOutfit.title}</h3>
          <p className="text-sm opacity-90">{currentOutfit.description}</p>
          <p className="text-lg font-semibold mt-1">{currentOutfit.price.value}</p>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          effect="shineHover"
          className="h-14 w-14 rounded-full bg-white"
          onClick={() => handleSwipe("left")}
        >
          <X className="h-6 w-6 text-destructive" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-full bg-white"
          onClick={handleUndo}
          disabled={swipeHistory.length === 0}
        >
          <RotateCcw className="h-6 w-6 text-muted-foreground" />
        </Button>

        <Button
          variant="outline"
          effect="shineHover"
          size="icon"
          className="h-14 w-14 rounded-full bg-white"
          onClick={() => handleSwipe("super")}
        >
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          effect="shineHover"
          className="h-14 w-14 rounded-full bg-white"
          onClick={() => handleSwipe("right")}
        >
          <Heart className="h-6 w-6 text-red-500" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          effect="shineHover"
          className="h-14 w-14 rounded-full bg-white"
          asChild
        >
          <Link href={`/product/${currentOutfit.slug}`}>
            {/* appropriate icon */}
            <LogOut className="h-6 w-6 text-emerald-500" />
          </Link>
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{
            width: `${(currentIndex / initialProducts.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
