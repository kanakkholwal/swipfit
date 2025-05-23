"use client";

import { ImageSwiper } from "@/components/extended/image-swiper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Heart, LogOut, RotateCcw, Sparkles, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { productFeed, updateSwipeStatus } from "~/actions/products";
import { CurrencySymbol } from "~/constants/currency";
import { formatNumber } from "~/lib/utils";
import type { ProductJson } from "~/types/product";

export default function SwipePageClient({
  initialProducts,
}: {
  initialProducts: ProductJson[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState<number[]>([]);

  const { data: products } = useQuery<ProductJson[]>({
    queryKey: ["swipe_feed_results"],
    queryFn: () => productFeed(),
    initialData: initialProducts,
  });

  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10]);

  // TODO: Implement swipe history and undo functionality and idk I forgot

  const handleSwipe = async (action: "dislike" | "like" | "super_like") => {
    if (currentIndex >= products.length - 1) return;
    setSwipeHistory([...swipeHistory, currentIndex]);

    await updateSwipeStatus(products[currentIndex].id, action);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (swipeHistory.length === 0) return;
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    setCurrentIndex(swipeHistory.pop()!);
  };

  return (
    <div className="flex items-center justify-center flex-col space-y-6">
      {currentIndex < products.length ? (<>
        <motion.div
          className="relative w-full max-w-md shadow-xl rounded-xl overflow-hidden aspect-[3/4] max-h-[32rem]  bg-gradient-to-t from-black/60 to-transparent mask-y-from-70% mask-y-to-90%"
          style={{ x, opacity, rotate }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, { offset }) => {
            if (offset.x > 50) handleSwipe("like");
            else if (offset.x < -50) handleSwipe("dislike");
          }}
        >
          {products[currentIndex].images.length > 1 ? (
            <ImageSwiper
              images={products[currentIndex].images}
              key={currentIndex}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <Image
              src={products[currentIndex].images[0].url}
              alt={products[currentIndex].description}
              fill={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="absolute inset-0 w-full h-full object-cover"
              priority
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <h3 className="text-xl font-bold">
              {products[currentIndex].title}
            </h3>

            <div className="flex items-center mt-3 text-sm">
              <p className="text-muted-foreground flex items-center">
                <Heart className="h-4 w-4 mr-1 fill-pink-500 text-pink-500 inline-block" />
                {formatNumber(products[currentIndex].likes || 0)} likes
              </p>
              <div className="ml-auto font-semibold flex items-center tracking-wide">
                <CurrencySymbol
                  currency={products[currentIndex].price.currency}
                  className="text-sm h-3.5"
                />
                {products[currentIndex].price.value}
              </div>
            </div>
          </div>
        </motion.div>
        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon_xl"
            rounded="full"
            effect="shineHover"
            onClick={() => handleSwipe("dislike")}
          >
            <X className="text-destructive" />
          </Button>

          <Button
            variant="outline"
            size="icon_xl"
            rounded="full"
            onClick={handleUndo}
            disabled={swipeHistory.length === 0}
          >
            <RotateCcw className="text-muted-foreground" />
          </Button>

          <Button
            variant="outline"
            effect="shineHover"
            size="icon_xl"
            rounded="full"
            onClick={() => handleSwipe("super_like")}
          >
            <Sparkles className="text-yellow-500" />
          </Button>

          <Button
            variant="outline"
            size="icon_xl"
            rounded="full"
            effect="shineHover"
            onClick={() => handleSwipe("like")}
          >
            <Heart className="text-red-500" />
          </Button>
          <Button
            variant="outline"
            size="icon_xl"
            rounded="full"
            effect="shineHover"
            asChild
          >
            <Link href={`/products/${products[currentIndex]?.slug}`}>
              {/* appropriate icon */}
              <LogOut className="text-emerald-500" />
            </Link>
          </Button>
        </div>
      </>) : (
        <Card className="p-8 max-w-lg text-center">
          <h2 className="text-2xl font-bold mb-4">No More Outfits</h2>
          <p className="text-muted-foreground mb-6">
            You&apos;ve seen all available outfits. Check back later for more
            recommendations!
          </p>
          <Button onClick={() => setCurrentIndex(0)}>Start Over</Button>
        </Card>
      )}


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
