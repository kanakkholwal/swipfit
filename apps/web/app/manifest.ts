import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "swipfit",
    name: "SwipFit",
    short_name: "SwipFit",
    description:
      "Discover your perfect style with AI-powered fashion recommendations",
    icons: [
      {
        src: "./favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "./favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "./android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "./android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#7c3aed",
    background_color: "#7c3aed1a",
    start_url: "/",
    scope: ".",
    display: "standalone",
    orientation: "natural",
  };
}
