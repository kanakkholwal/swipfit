"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, RefreshCw, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Mock data - in production this would come from an API
const occasions = [
  "Casual Day Out",
  "Business Meeting",
  "Date Night",
  "Wedding Guest",
  "Workout",
  "Beach Day",
  "Party",
];

const weatherOptions = [
  "Sunny & Warm",
  "Cool & Breezy",
  "Cold & Windy",
  "Rainy",
  "Hot & Humid",
];

const stylePreferences = [
  "Minimalist",
  "Bohemian",
  "Classic",
  "Streetwear",
  "Elegant",
  "Sporty",
];

const suggestedOutfits = [
  {
    id: 1,
    title: "Business Casual Ensemble",
    items: [
      {
        id: 1,
        name: "Navy Blazer",
        brand: "Zara",
        price: "$129.99",
        image:
          "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop",
      },
      {
        id: 2,
        name: "White Button-Down",
        brand: "H&M",
        price: "$39.99",
        image:
          "https://images.unsplash.com/photo-1603251579431-8041402bdeda?w=800&h=800&fit=crop",
      },
      {
        id: 3,
        name: "Tailored Pants",
        brand: "Mango",
        price: "$69.99",
        image:
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop",
      },
    ],
  },
  {
    id: 2,
    title: "Casual Weekend Look",
    items: [
      {
        id: 4,
        name: "Denim Jacket",
        brand: "Levi's",
        price: "$89.99",
        image:
          "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&h=800&fit=crop",
      },
      {
        id: 5,
        name: "White T-Shirt",
        brand: "Urban Style",
        price: "$24.99",
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop",
      },
      {
        id: 6,
        name: "Black Jeans",
        brand: "ASOS",
        price: "$59.99",
        image:
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=800&fit=crop",
      },
    ],
  },
];

export default function OutfitAssistantPage() {
  const [occasion, setOccasion] = useState("");
  const [weather, setWeather] = useState("");
  const [style, setStyle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleGenerateOutfits = () => {
    setIsGenerating(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsGenerating(false);
      setShowSuggestions(true);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">AI Outfit Assistant</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tell us about your plans and preferences, and our AI will curate the
            perfect outfit combinations for you.
          </p>
        </div>

        {/* Preferences Form */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Occasion</Label>
                <Select value={occasion} onValueChange={setOccasion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    {occasions.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Weather</Label>
                <Select value={weather} onValueChange={setWeather}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select weather" />
                  </SelectTrigger>
                  <SelectContent>
                    {weatherOptions.map((w) => (
                      <SelectItem key={w} value={w}>
                        {w}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Style Preference</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {stylePreferences.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              onClick={handleGenerateOutfits}
              disabled={!occasion || !weather || !style || isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating Outfits...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Outfit Suggestions
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Suggestions */}
        {showSuggestions && (
          <div className="space-y-8">
            {suggestedOutfits.map((outfit) => (
              <Card key={outfit.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{outfit.title}</h3>
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Save Outfit
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {outfit.items.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <div className="relative aspect-square rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.brand}
                          </p>
                          <p className="text-sm font-medium">{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
