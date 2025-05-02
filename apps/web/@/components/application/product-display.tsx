import ProductImages from "@/components/application/product/Image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import Link from "next/link";
import { CurrencySymbol } from "~/constants/currency";
import type { Session } from "~/lib/auth-client";
import { formatNumber } from "~/lib/utils";
import type { ProductJson } from "~/types/product";


export default function ProductDisplay({
    product,
    user,
    className,
}: {
    product: ProductJson,
    user?: Session["user"],
    className?: string
}) {


    return (<div
        className={
            cn(
                "break-inside-avoid-column rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300",
                className,
            )
        }
    >
        <div className="relative overflow-hidden aspect-[3/4] bg-gradient-to-t from-background/60 to-transparent">
            <ProductImages images={product.images} />
            {user && (<Button
                variant="outline"
                size="icon"
                className={
                    "absolute top-4 right-4 h-10 w-10 rounded-full bg-background/50 backdrop-blur-sm  hover:bg-background/70"
                }
            >
                <Heart />
            </Button>)}
        </div>
        <Link
            href={`/products/${product.slug}`} className="p-4 block">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{product.title}</h3>
                <p className="font-medium text-pink-500 inline-flex items-center">
                    <CurrencySymbol
                        currency={product.price.currency}
                        className="text-sm h-3.5"
                    />
                    {product.price.value.toFixed(0)}
                </p>
            </div>
            <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                    {product.brand}
                </span>
                <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                    {product.occasions[0]}
                </span>
            </div>
            <div className="flex items-center mt-3 text-sm text-muted-foreground">
                <Heart className="h-4 w-4 mr-1 fill-pink-500 text-pink-500" />
                {formatNumber(product.likes || 0)} likes
            </div>
        </Link>
    </div>)
}