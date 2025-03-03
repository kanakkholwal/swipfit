import { SquaresBackground } from "@/components/animated/bg-square";
import { ImageSwiper } from "@/components/extended/image-swiper";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";
import { getProductsForTrends } from "~/data";

export default async function TrendsPage() {
  const outfits = await getProductsForTrends();

  return (
    <div className="min-h-screen bg-black">
      <SquaresBackground
        direction="diagonal"
        speed={0.5}
        squareSize={40}
        borderColor="#333"
        hoverFillColor="#222"
        className="fixed inset-0 min-h-screen h-full w-full z-0"
      />
      {/* Hero Search Section */}
      <div className="relative h-[45vh] min-h-[400px] flex items-center justify-center z-10">
        <div className="relative z-10 w-full max-w-3xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
            Trending Outfits
          </h1>
        </div>
      </div>

      {/* Pinterest-style Grid */}
      <div className="container px-4 py-8 z-10">
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {outfits.map((outfit) => (
            <div
              key={outfit.slug}
              className="break-inside-avoid-column rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="relative overflow-hidden aspect-[3/4] bg-gradient-to-t from-black/60 to-transparent">
                {outfit.images.length > 1 ? (
                  <ImageSwiper
                    images={outfit.images}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={outfit.images[0].url}
                    alt={outfit.description}
                    fill={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className={
                    "absolute top-4 right-4 h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm border-white/20 hover:bg-black/70  text-white"
                  }
                >
                  <Heart className={"h-5 w-5 "} />
                </Button>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{outfit.title}</h3>
                  <p className="font-medium text-pink-500">${outfit.price.value.toFixed(2)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-gray-300">
                    {outfit.brand}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-gray-300">
                    {outfit.brand}
                  </span>
                </div>
                <div className="flex items-center mt-3 text-sm text-gray-400">
                  <Heart className="h-4 w-4 mr-1 fill-pink-500 text-pink-500" />
                  {3.4}k likes
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
