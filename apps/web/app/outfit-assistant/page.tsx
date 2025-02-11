"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowRight, Heart, RefreshCw, ShoppingBag, Sparkles } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const occasions = [
  "Casual Day Out",
  "Business Meeting",
  "Date Night",
  "Wedding Guest",
  "Workout",
  "Beach Day",
  "Party"
]

const weatherOptions = [
  "Sunny & Warm",
  "Cool & Breezy",
  "Cold & Windy",
  "Rainy",
  "Hot & Humid"
]

const stylePreferences = [
  "Minimalist",
  "Bohemian",
  "Classic",
  "Streetwear",
  "Elegant",
  "Sporty"
]

const suggestedOutfits = [
  {
    id: 1,
    title: "Business Casual Ensemble",
    description: "Perfect for a day at the office or important meetings",
    items: [
      {
        id: 1,
        name: "Navy Blazer",
        brand: "Zara",
        price: "$129.99",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop"
      },
      {
        id: 2,
        name: "White Button-Down",
        brand: "H&M",
        price: "$39.99",
        image: "https://images.unsplash.com/photo-1603251579431-8041402bdeda?w=800&h=800&fit=crop"
      },
      {
        id: 3,
        name: "Tailored Pants",
        brand: "Mango",
        price: "$69.99",
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop"
      }
    ]
  },
  {
    id: 2,
    title: "Casual Weekend Look",
    description: "Effortlessly stylish for your weekend adventures",
    items: [
      {
        id: 4,
        name: "Denim Jacket",
        brand: "Levi's",
        price: "$89.99",
        image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&h=800&fit=crop"
      },
      {
        id: 5,
        name: "White T-Shirt",
        brand: "Urban Style",
        price: "$24.99",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop"
      },
      {
        id: 6,
        name: "Black Jeans",
        brand: "ASOS",
        price: "$59.99",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&h=800&fit=crop"
      }
    ]
  }
]

export default function OutfitAssistantPage() {
  const [occasion, setOccasion] = useState("")
  const [weather, setWeather] = useState("")
  const [style, setStyle] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [savedOutfits, setSavedOutfits] = useState<number[]>([])

  const handleGenerateOutfits = () => {
    setIsGenerating(true)
    // Simulate API call delay
    setTimeout(() => {
      setIsGenerating(false)
      setShowSuggestions(true)
    }, 1500)
  }

  const toggleSaveOutfit = (outfitId: number) => {
    setSavedOutfits(prev => 
      prev.includes(outfitId) 
        ? prev.filter(id => id !== outfitId)
        : [...prev, outfitId]
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[400px] flex items-center justify-center bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-black">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/40" />
        </div>
        
        <div className="relative z-10 w-full max-w-3xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-pink-500" />
            <span className="text-sm text-white">AI-Powered Style Assistant</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
            Your Personal Style Guide
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Let our AI create the perfect outfit combinations tailored to your occasion, weather, and style preferences.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-12">
        {/* Preferences Form */}
        <Card className="bg-gray-900/50 backdrop-blur-sm border-white/10 mb-12 max-w-3xl mx-auto">
          <CardContent className="p-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Occasion</Label>
                <Select value={occasion} onValueChange={setOccasion}>
                  <SelectTrigger className="bg-transparent border-white/20">
                    <SelectValue placeholder="Select occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    {occasions.map(o => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Weather</Label>
                <Select value={weather} onValueChange={setWeather}>
                  <SelectTrigger className="bg-transparent border-white/20">
                    <SelectValue placeholder="Select weather" />
                  </SelectTrigger>
                  <SelectContent>
                    {weatherOptions.map(w => (
                      <SelectItem key={w} value={w}>{w}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300">Style Preference</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="bg-transparent border-white/20">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {stylePreferences.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              className="w-full mt-6 mx-auto max-w-sm" 
              variant="gradient_pink"
              onClick={handleGenerateOutfits}
              disabled={!occasion || !weather || !style || isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating Your Perfect Outfits...
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
          <div className="space-y-8 max-w-5xl mx-auto">
            {suggestedOutfits.map((outfit) => (
              <Card key={outfit.id} className="bg-gray-900/50 backdrop-blur-sm border-white/10 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{outfit.title}</h3>
                      <p className="text-gray-400">{outfit.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-white/20" onClick={() => toggleSaveOutfit(outfit.id)}>
                        <Heart className={`h-4 w-4 mr-2 ${savedOutfits.includes(outfit.id) ? 'fill-pink-500 text-pink-500' : ''}`} />
                        {savedOutfits.includes(outfit.id) ? 'Saved' : 'Save Outfit'}
                      </Button>
                      <Button size="sm" className="bg-pink-500 hover:bg-pink-600">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Shop All
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {outfit.items.map((item) => (
                      <div key={item.id} className="group relative">
                        <div className="relative aspect-square rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Button 
                            className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black hover:bg-gray-100"
                            size="sm"
                          >
                            Shop Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-3">
                          <h4 className="font-medium text-white">{item.name}</h4>
                          <p className="text-sm text-gray-400">{item.brand}</p>
                          <p className="text-sm font-medium text-pink-500">{item.price}</p>
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
  )
}