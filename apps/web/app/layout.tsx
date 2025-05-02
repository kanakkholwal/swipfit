import { ClientProvider } from "@/components/common/client-provider";
// import Footer from "@/components/common/footer";
// import Navbar from "@/components/common/navbar";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "SwipFit - AI-Powered Fashion Discovery",
  description:
    "Discover your perfect style with AI-powered fashion recommendations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} font-sans bg-background`}
      >
        <ClientProvider>
          {/* <div className="flex min-h-screen flex-col"> */}
            {/* <Navbar /> */}
            {/* <main className="flex-1">{children}</main> */}
            {children}
            {/* <Footer /> */}
          {/* </div> */}
          <Toaster />
        </ClientProvider>
      </body>
    </html>
  );
}
