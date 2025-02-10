"use client";
import { Button } from "@/components/ui/button";
import { tabListVariants } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ROUTES = [
    { name: "Overview", path: "products" },
    { name: "Stats", path: "products/stats" },
    { name: "Import", path: "products/import" },
    { name: "Add Product", path: "products/add" },
]

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <div>
            <nav className={cn(tabListVariants({ variant:"wide"}))}>
                {ROUTES.map((route) => {
                    const isActive = pathname.endsWith(route.path) || pathname === route.path;
                    return (
                        <Button key={route.path} variant={isActive ? "default":"ghost"} asChild>
                            <Link href={route.path} >{route.name}</Link>
                        </Button>
                    );
                })}
            </nav>
            {children}
        </div>
    );
}
