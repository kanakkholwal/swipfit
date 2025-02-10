"use client";

// import { ThemeProvider as NextThemesProvider } from "next-themes";
// import type { ThemeProviderProps } from "next-themes/dist/types";
import { Next13ProgressBar } from "next13-progressbar";
import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster } from "@/components/ui/toaster";
export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Next13ProgressBar
        height="4px"
        color="hsl(var(--primary))"
        options={{ showSpinner: true, trickle: true }}
        showOnShallow={true}
      />
      <HotToaster
        position="top-center"
        
       
      />
      <Toaster />
    </>
  );
}
