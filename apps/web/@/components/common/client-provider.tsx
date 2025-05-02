"use client";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Next13ProgressBar } from "next13-progressbar";
import { Toaster as HotToaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnReconnect: false,
    },
  },
});

export function ClientProvider({ children ,...props}: { children: React.ReactNode }) {
  return (<NextThemesProvider defaultTheme="dark" themes={["light","dark","system"]} {...props}>
    <QueryClientProvider client={queryClient}>
      {children}
      <Next13ProgressBar
        height="4px"
        color="hsl(var(--primary))"
        options={{ showSpinner: true, trickle: true }}
        showOnShallow={true}
      />
      <HotToaster position="top-center" />
      <Toaster />
    </QueryClientProvider>
  </NextThemesProvider>);
}
