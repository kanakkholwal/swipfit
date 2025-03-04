import AddToCartButton from "@/components/application/product/AddToCartButton";
import ProductGallery from "@/components/application/product/ProductGallery";
import ReviewSection from "@/components/application/product/ReviewSection";
import SimilarOutfits from "@/components/application/product/SimilarOutfits";
import WishlistButton from "@/components/application/product/WishlistButton";
// import { ProductSpecifications } from "@/components/application/product/specifications";
import { Star } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProductBySlug } from "~/actions/products";
import { CurrencySymbol } from "~/constants/currency";
import { getSimilarOutfits } from "~/data";
import { APP_NAME } from "~/project.config";

async function getReviewSummary(productId: string) {
  // In a real application, this would use AI to generate a summary of reviews
  return {
    averageRating: 4.5,
    totalReviews: 128,
    summary:
      "Customers love the modern fit and versatile style of this blazer. Many appreciate the high-quality fabric and comfortable wear. Some users mentioned that the sizing runs slightly small.",
  };
}

type TParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: TParams }) {
  const product = await getProductBySlug((await params).slug);
  if (!product) return {};

  return {
    title: `${product.title} | ${APP_NAME}`,
    description: product.description,
    openGraph: {
      images: product.images.map((image) => ({
        url: image.url,
        alt: image.alt,
      })),
    },
  };
}

export default async function ProductPage({ params }: { params: TParams }) {

  const product = await getProductBySlug((await params).slug);

  if (!product) notFound();

  const similarOutfits = await getSimilarOutfits(product.slug);
  const reviewSummary = await getReviewSummary(product.slug);

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 bg-[#0D0D0D] bg-opacity-90 backdrop-blur-sm">
        {/* Navbar content */}
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-[#CCCCCC]">
            {product.shortDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Suspense fallback={<div>Loading gallery...</div>}>
            <ProductGallery images={product.images} />
          </Suspense>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">

                <CurrencySymbol currency={product.price.currency} />
                {product.price.value.toFixed(2)}
              </span>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                {/* <span className="ml-1">{product.rating.toFixed(1)}</span> */}
                <span className="ml-1">4</span>
              </div>
            </div>

            {/* <ColorSelector colors={product.colors} />
            <SizeSelector sizes={product.sizes} /> */}

            <div className="flex space-x-4">
              <AddToCartButton productId={product.slug} />
              <WishlistButton productId={product.slug} />
            </div>

            {/* <ProductSpecifications product={product} /> */}
          </div>
        </div>

        <Suspense fallback={<div>Loading similar outfits...</div>}>
          <SimilarOutfits outfits={similarOutfits} />
        </Suspense>

        <Suspense fallback={<div>Loading reviews...</div>}>
          <ReviewSection productId={product.slug} summary={reviewSummary} />
        </Suspense>
      </main>
    </div>
  );
}
