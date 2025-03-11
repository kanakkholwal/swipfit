"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BadgeX, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="container mx-auto max-w-screen-xl min-h-[50vh] h-full px-4 py-8 flex flex-col items-center justify-center gap-4 text-center">
      <BadgeX size="64" className="text-red-500" />
      <h1 className="text-3xl font-bold">404 Not Found</h1>
      <p className="text-lg">The page you are looking for does not exist.</p>
      <div className="flex gap-4 flex-col md:flex-row mt-8 max-w-screen-md mx-auto">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft />
          Go Back
        </Button>
        <Button width="sm" asChild>
          <Link href="/">
            <Home />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
