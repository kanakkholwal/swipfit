import ProductDisplay from "@/components/application/product-display";
import { TrendingUp } from "lucide-react";
import { getProductsForTrends } from "~/actions/products";
import { getSession } from "~/lib/auth-server";




export default async function TrendsPage() {
  const session = await getSession();
  const products = await getProductsForTrends();

  return (
    <div className="min-h-screen">
      {/* Hero Search Section */}
      <div className="p-4 mt-5">
        <h1 className="text-2xl font-bold">
          <TrendingUp className="inline size-6 mr-2 " />
          Trending Outfits
        </h1>
      </div>

      {/* Pinterest-style Grid */}
      <div className="container px-4 py-8 z-10">
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {products.map((product) => (
            <ProductDisplay
              key={product.slug}
              className="break-inside-avoid-column rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300"

              product={product}
              user={session?.user}
            />))}
        </div>
      </div>
    </div>
  );
}
