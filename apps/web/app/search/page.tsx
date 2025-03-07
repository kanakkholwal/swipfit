"use client";

import AnimatedLoadingSkeleton from "@/components/animated/animated-loading-skeleton";
import { SquaresBackground } from "@/components/animated/bg-square";
import ProductImages from "@/components/application/product/Image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConditionalRender from "@/components/utils/conditional-render";
import EmptyArea from "@/components/utils/empty-area";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Heart, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { searchProductByQuery } from "~/actions/products";
import { formatNumber } from "~/lib/utils";
import type { ProductJson } from "~/types/product";




const filters = {
  categories: ["All", "Dresses", "Casual", "Business", "Party", "Sports"],
  colors: ["All", "Black", "White", "Red", "Blue", "Beige", "Green"],
  brands: [
    "All",
    "Zara",
    "H&M",
    "Urban Style",
    "Fashion Nova",
    "Mango",
    "ASOS",
  ],
  priceRanges: ["All", "Under $50", "$50-$100", "$100-$200", "Over $200"],
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const query = useQuery<ProductJson[]>({
    queryKey: ['search_results'],
    queryFn: () => searchProductByQuery(searchQuery),
    initialData: [],
    // enabled: false, // Prevents automatic query execution on mount
  })

  console.log(query);


  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [likedItems, setLikedItems] = useState<string[]>([]);

  const toggleLike = (id: string) => {
    setLikedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  // TODO: Filter outfits based on selected filters and update search params
  // useEffect(()=>{

  // },[query.isLoading])



  return (
    <div className="min-h-screen">
      <SquaresBackground
        direction="diagonal"
        speed={0.5}
        squareSize={40}
        borderColor="#333"
        hoverFillColor="#222"
        className="fixed inset-0 min-h-screen h-full w-full z-0"
      />
      {/* Hero Search Section */}
      <div className="relative min-h-[40vh] flex items-center justify-center z-10">
        <div className="relative z-10 w-full max-w-3xl px-4 py-14 h-[40vh]">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
            Discover Your Style
          </h1>

          <form onSubmit={(e) => {
            e.preventDefault();
            console.log("searching for", searchQuery);
            query.refetch();
          }} className="relative">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <Input
                  type="search"
                  name="query"
                  placeholder="Search outfits, styles, or brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value.trimStart())}
                  className="w-full pl-12 pr-4 h-14 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-gray-400 focus:ring-pink-500"
                />
              </div>

              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="h-14 w-14 border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20"
              >
                <SlidersHorizontal className="h-5 w-5 text-white" />
              </Button>
            </div>
            <div
              className={cn(
                showFilters ? "min-h-36 h-auto motion-preset-expand" : "h-0 motion-preset-shrink",
                "transition-all delay-150 duration-300 overflow-hidden w-full mt-2",
              )}
            >
              <div
                className={cn(
                  "p-4 bg-black/35 backdrop-blur-md border border-white/10 rounded-lg shadow-xl z-50",
                )}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="bg-transparent border-white/20">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {filters.categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedColor}
                    onValueChange={setSelectedColor}
                  >
                    <SelectTrigger className="bg-transparent border-white/20">
                      <SelectValue placeholder="Color" />
                    </SelectTrigger>
                    <SelectContent>
                      {filters.colors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedBrand}
                    onValueChange={setSelectedBrand}
                  >
                    <SelectTrigger className="bg-transparent border-white/20">
                      <SelectValue placeholder="Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {filters.brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedPrice}
                    onValueChange={setSelectedPrice}
                  >
                    <SelectTrigger className="bg-transparent border-white/20">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      {filters.priceRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400">
                    {query.data?.length} results found
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => {
                      setSelectedCategory("All");
                      setSelectedColor("All");
                      setSelectedBrand("All");
                      setSelectedPrice("All");
                    }}
                    className="text-pink-500 hover:text-pink-400"
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Pinterest-style Grid */}
      <div className="container px-4 py-8 z-10 flex-col flex justify-center items-center">
        <ConditionalRender condition={query.isFetching}>
          <AnimatedLoadingSkeleton />
        </ConditionalRender>
        <ConditionalRender condition={!query.isFetching}>
          <ConditionalRender condition={!query.isError}>
            <ConditionalRender condition={query.data?.length === 0}>
              <EmptyArea
                title="No results found"
                description="Try adjusting your search query or filters to find the perfect outfit."
                className="mt-5 z-10"
              />
            </ConditionalRender>
            <ConditionalRender condition={query.data?.length > 0}>
              <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4 mx-auto w-full">
                {query.data?.map((product) => (
                  <div
                    key={product._id}
                    className="break-inside-avoid-column rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300"
                  >
                    <div className="relative overflow-hidden aspect-[3/4] bg-gradient-to-t from-black/60 to-transparent">
                      <ProductImages images={product.images} />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleLike(product._id)}
                        className={cn("absolute top-4 right-4 h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm border-white/20 hover:bg-black/70",
                          likedItems.includes(product._id)
                            ? "text-pink-500"
                            : "text-white",
                        )}
                      >
                        <Heart
                          className={`h-5 w-5 ${likedItems.includes(product._id) ? "fill-current" : ""}`}
                        />
                      </Button>
                    </div>
                    <Link href={`/products/${product.slug}`} className="p-4 block">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{product.brand}</h3>
                        <p className="font-medium text-pink-500">{product.price.value}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-gray-300">
                          {product.itemType}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-gray-300">
                          {product.wearType}
                        </span>
                      </div>
                      <div className="flex items-center mt-3 text-sm text-gray-400">
                        <Heart className="h-4 w-4 mr-1 fill-pink-500 text-pink-500" />
                        {formatNumber(product.likes || 0)} likes
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </ConditionalRender>
          </ConditionalRender>
        </ConditionalRender>
      </div>


    </div>
  );
}
