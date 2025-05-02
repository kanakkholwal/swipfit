"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart, Search, Shirt, TrendingUp, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "~/lib/auth-client";
import { ThemeSwitcher } from "./theme-switcher";

  const navItems = [
    { href: "/search", label: "Search", icon: Search },
    { href: "/trends", label: "Trends", icon: TrendingUp },
    { href: "/swipe", label: "Discover", icon: Shirt },
    { href: "/outfit-assistant", label: "Assistant", icon: Heart },
  ];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <Shirt className="h-6 w-6 text-pink-500" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
            SwipFit
          </span>
        </Link>

        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between ml-auto">
          <div className="flex items-center space-x-4 mx-auto">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center space-x-2 text-sm font-medium transition duration-500 rounded-md h-8 py-2 px-3",
                  "hover:bg-accent hover:text-accent-foreground",
                  pathname === href ? "text-pink-500" : "text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeSwitcher/>
            {session?.user ? (<>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link href="/profile">
                  <User />
                  Profile
                </Link>
              </Button>
            </>) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                  asChild
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          className="ml-auto md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="h-6 w-6 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>{isMenuOpen ? "Close menu" : "Open menu"}</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t md:hidden">
          <div className="container space-y-4 py-4">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-pink-500 ${
                  pathname === href ? "text-pink-500" : "text-muted-foreground"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t">
              {session?.user ? (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile">
                    <User />
                    Profile
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" width="full" asChild>
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button
                    size="sm"
                    width="full"
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    asChild
                  >
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
