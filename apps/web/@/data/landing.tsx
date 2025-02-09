import {
  ArrowRight,
  Camera,
  Heart,
  Palette,
  ShoppingBag,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
export const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Style",
    description:
      "Get fits that actually match your vibe with our smart style algorithm",
  },
  {
    icon: Target,
    title: "Perfect Match",
    description:
      "Our AI learns your aesthetic and suggests outfits you'll actually want to wear",
  },
  {
    icon: Zap,
    title: "Quick Discovery",
    description:
      "Swipe through curated looks and find your next favorite outfit in seconds",
  },
];

export const trendingStyles = [
  {
    title: "Y2K Comeback",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=1000&fit=crop",
    tags: ["#Y2K", "#Vintage", "#Aesthetic"],
  },
  {
    title: "Street Style",
    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&h=1000&fit=crop",
    tags: ["#StreetWear", "#Urban", "#Fresh"],
  },
  {
    title: "Minimalist Chic",
    image:
      "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&h=1000&fit=crop",
    tags: ["#Minimal", "#Clean", "#Aesthetic"],
  },
];

export const stats = [
  { label: "Active Users", value: 5_00_000, icon: Users },
  { label: "Styles Generated", value: 2_000_000, icon: Palette },
  { label: "Daily Matches", value: 1_00_000, icon: Heart },
  { label: "Fashion Brands", value: 1_000, icon: ShoppingBag },
];

export const testimonials = [
  {
    author: {
      name: "Emma Thompson",
      handle: "@emmaai",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
    text: "Using this AI platform has transformed how we handle data analysis. The speed and accuracy are unprecedented.",
    href: "https://twitter.com/emmaai",
  },
  {
    author: {
      name: "David Park",
      handle: "@davidtech",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    text: "The API integration is flawless. We've reduced our development time by 60% since implementing this solution.",
    href: "https://twitter.com/davidtech",
  },
  {
    author: {
      name: "Sofia Rodriguez",
      handle: "@sofiaml",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    },
    text: "Finally, an AI tool that actually understands context! The accuracy in natural language processing is impressive.",
  },
  {
    author: {
      name: "James Chen",
      handle: "@jamesdev",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    },
    text: "Game-changing ML capabilities. We've automated our entire data pipeline with incredible accuracy.",
    href: "https://twitter.com/jamesdev",
  },
  {
    author: {
      name: "Aisha Patel",
      handle: "@aishatech",
      avatar:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
    },
    text: "The real-time processing capabilities are mind-blowing. Our team's productivity has doubled.",
    href: "https://twitter.com/aishatech",
  },
  {
    author: {
      name: "Michael Kim",
      handle: "@mikeai",
      avatar:
        "https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?w=150&h=150&fit=crop&crop=face",
    },
    text: "Best decision we made was switching to this platform. The AI models are incredibly accurate and easy to deploy.",
  },
];
