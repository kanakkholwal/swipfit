"use client";
import { Button } from "@/components/ui/button";
import { tabListVariants } from "@/components/ui/tabs";
import { admin_routes } from "@/data/dashboard";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <div>
            <nav className={cn(tabListVariants({ variant:"wide"}))}>
                {Array.isArray(admin_routes?.products) ? null : admin_routes?.products?.items?.map((route) => {
                    const isActive = pathname.endsWith(route.path) || pathname === route.path;
                    return (
                        <Button key={route.path} variant={isActive ? "default":"ghost"} asChild>
                            <Link href={route.path}>
                                {route.Icon && <route.Icon />}
                                {route.title}
                            </Link>
                        </Button>
                    );
                })}
            </nav>
            {children}
        </div>
    );
}
