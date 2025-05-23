"use client";

import AnimatedLoadingSkeleton from "@/components/animated/animated-loading-skeleton";
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
import { CurrencySymbol } from "~/constants/currency";
import { formatNumber } from "~/lib/utils";
import type { ProductJson } from "~/types/product";

export default function SearchPageClient({
  initialData,
  filters,
  initialQuery
}: {
  initialData: ProductJson[];
  filters: Record<string, string[]>;
  initialQuery?: string;
}) {

  const [searchQuery, setSearchQuery] = useState(initialQuery || "");

  const query = useQuery<ProductJson[]>({
    queryKey: ["search_results"],
    queryFn: async () => {
      const [data] = await searchProductByQuery(searchQuery);
      return data;
    },
    initialData,
    enabled: false, // Prevents automatic query execution on mount
  });

  // console.log(query);

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
    <>
      {/* Hero Search Section */}
      <div className="relative min-h-[40vh] flex items-center justify-center z-10">
        <div className="relative z-10 w-full max-w-3xl px-4 py-14 h-[40vh]">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
            Discover Your Style
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("searching for", searchQuery);
              query.refetch();
            }}
            className="relative"
          >
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                <Input
                  type="search"
                  name="query"
                  placeholder="Search outfits, styles, or brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value.trimStart())}
                  className="w-full pl-12 pr-4 h-14 bg-card backdrop-blur-md placeholder:text-muted-foreground focus:ring-pink-500"
                />
              </div>

              <Button
                variant="outline"
                size="icon"
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="h-14 w-14 bg-card backdrop-blur-md hover:bg-white/20 hidden"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </div>
            <div
              className={cn(
                showFilters
                  ? "min-h-36 h-auto motion-preset-expand"
                  : "h-0 motion-preset-shrink",
                "transition-all delay-150 duration-300 overflow-hidden w-full mt-2",
              )}
            >
              <div
                className={cn(
                  "p-4 bg-card backdrop-blur-md border rounded-lg shadow-xl z-50",
                )}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="bg-transparent">
                      <SelectValue placeholder="Occasions" />
                    </SelectTrigger>
                    <SelectContent>
                      {filters.occasions.map((brand, index) => (
                        <SelectItem
                          key={`occasion-${index.toString()}`}
                          value={brand}
                        >
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedColor}
                    onValueChange={setSelectedColor}
                  >
                    <SelectTrigger className="bg-transparent">
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
                    <SelectTrigger className="bg-transparent">
                      <SelectValue placeholder="Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {filters?.brands?.map((brand) => (
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
                    <SelectTrigger className="bg-transparent">
                      <SelectValue
                        placeholder="Season"
                        className="capitalize"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {filters.seasons.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
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
                    key={product.id}
                    className="break-inside-avoid-column rounded-xl overflow-hidden bg-card backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300"
                  >
                    <div className="relative overflow-hidden aspect-[3/4] bg-gradient-to-t from-card/60 to-transparent">
                      <ProductImages images={product.images} />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          toggleLike(product.id);
                          console.log(product);
                        }}
                        className={cn(
                          "absolute top-4 right-4 h-10 w-10 rounded-full bg-background backdrop-blur-sm",
                          likedItems.includes(product.id)
                            ? "text-pink-500"
                            : "text-foreground",
                        )}
                      >
                        <Heart
                          className={`h-5 w-5 ${likedItems.includes(product.id) ? "fill-current" : ""}`}
                        />
                      </Button>
                    </div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="p-4 block"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">
                          {product.brand}
                        </h3>
                        <div className="font-medium text-pink-500 flex items-center">
                          <CurrencySymbol
                            currency={product.price.currency}
                            className="text-sm h-4"
                          />

                          {product.price.value}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[product.itemType, product.occasions[0]].map((tag) => {
                          return (
                            <span
                              key={tag}
                              className="px-2 py-1 rounded-full text-xs bg-card/10 text-muted-foreground uppercase"
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                        <span>
                        <Heart className="h-4 w-4 mr-1 fill-pink-500 text-pink-500 inline-block" />
                        {formatNumber(product.likes || 0)} likes
                        </span>
                        <span className="font-light uppercase text-xs">
                          {new URL(product.productUrl).hostname}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </ConditionalRender>
          </ConditionalRender>
        </ConditionalRender>
      </div>
    </>
  );
}
