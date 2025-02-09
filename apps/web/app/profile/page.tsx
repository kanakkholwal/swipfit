"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Settings, Grid, ListFilter } from "lucide-react";

// Mock data - in production this would come from an API
const savedOutfits = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop",
    brand: "Urban Style",
    price: "$89.99",
    liked: true,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1000&fit=crop",
    brand: "Fashion Nova",
    price: "$129.99",
    liked: true,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1000&fit=crop",
    brand: "Zara",
    price: "$79.99",
    superLiked: true,
  },
];

const userPreferences = {
  colors: ["Navy", "Black", "White", "Beige"],
  brands: ["Zara", "H&M", "Urban Style", "Fashion Nova"],
  styles: ["Casual", "Business Casual", "Smart Casual"],
  sizes: ["M", "L"],
};

export default function ProfilePage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-background rounded-lg p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-24 h-24">
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold mb-2">Sarah Johnson</h1>
            <p className="text-muted-foreground">
              Fashion enthusiast | Style explorer
            </p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </Button>
            </div>
          </div>
          <div className="flex gap-8 text-center">
            <div>
              <p className="text-2xl font-bold">{savedOutfits.length}</p>
              <p className="text-muted-foreground text-sm">Saved</p>
            </div>
            <div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-muted-foreground text-sm">Following</p>
            </div>
            <div>
              <p className="text-2xl font-bold">128</p>
              <p className="text-muted-foreground text-sm">Followers</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="outfits" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="outfits">Saved Outfits</TabsTrigger>
              <TabsTrigger value="preferences">Style Preferences</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setView("grid")}
                className={
                  view === "grid" ? "bg-primary text-primary-foreground" : ""
                }
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setView("list")}
                className={
                  view === "list" ? "bg-primary text-primary-foreground" : ""
                }
              >
                <ListFilter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="outfits" className="mt-6">
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 md:grid-cols-3 gap-4"
                  : "space-y-4"
              }
            >
              {savedOutfits.map((outfit) => (
                <Card
                  key={outfit.id}
                  className={view === "grid" ? "" : "flex overflow-hidden"}
                >
                  <div
                    className={
                      view === "grid"
                        ? "relative aspect-[3/4]"
                        : "relative w-48 shrink-0"
                    }
                  >
                    <Image
                      src={outfit.image}
                      alt={outfit.brand}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent
                    className={`p-4 ${view === "list" ? "flex-1" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{outfit.brand}</h3>
                      <Heart className="w-5 h-5 text-primary fill-primary" />
                    </div>
                    <p className="text-muted-foreground">{outfit.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="preferences">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Favorite Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {userPreferences.colors.map((color) => (
                      <div
                        key={color}
                        className="px-3 py-1 rounded-full bg-primary/10 text-sm"
                      >
                        {color}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Preferred Brands</h3>
                  <div className="flex flex-wrap gap-2">
                    {userPreferences.brands.map((brand) => (
                      <div
                        key={brand}
                        className="px-3 py-1 rounded-full bg-primary/10 text-sm"
                      >
                        {brand}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Style Preferences</h3>
                  <div className="flex flex-wrap gap-2">
                    {userPreferences.styles.map((style) => (
                      <div
                        key={style}
                        className="px-3 py-1 rounded-full bg-primary/10 text-sm"
                      >
                        {style}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    {userPreferences.sizes.map((size) => (
                      <div
                        key={size}
                        className="px-3 py-1 rounded-full bg-primary/10 text-sm"
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
