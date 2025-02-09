import { cn } from "@/lib/utils";
import { Shirt } from "lucide-react";

export function AppLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn("inline-flex gap-2 justify-center items-center", className)}
    >
      <Shirt className="h-6 w-6 text-pink-500" />
      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
        {process.env.NEXT_PUBLIC_WEBSITE_NAME || "SwipFit"}
      </span>
    </div>
  );
}
