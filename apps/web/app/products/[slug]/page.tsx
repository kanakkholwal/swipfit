import ProductGallery from "@/components/application/product/ProductGallery";
import ReviewSection from "@/components/application/product/ReviewSection";
import SimilarOutfits from "@/components/application/product/SimilarOutfits";
import WishlistButton from "@/components/application/product/WishlistButton";
import { ProductSpecifications } from "@/components/application/product/specifications";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProductBySlug } from "~/actions/products";
import { CurrencySymbol } from "~/constants/currency";
import { getSimilarOutfits } from "~/data";
import { formatNumber } from "~/lib/utils";
import { APP_DOMAIN, APP_NAME } from "~/project.config";

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
    description: product.shortDescription,
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

  const targetUrl = new URL(product.productUrl);
  const targetHostname = targetUrl.hostname;
  targetUrl.searchParams.append("utm_source", APP_DOMAIN);
  targetUrl.searchParams.append("utm_medium", "referral");
  targetUrl.searchParams.append("utm_campaign", product.slug);
  targetUrl.searchParams.append("utm_content", "product-page");

  return (
    <div className="min-h-screen">


      <main className="container mx-auto px-4 py-8 max-w-[1200px] mt-10">


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Suspense fallback={<div>Loading gallery...</div>}>
            <ProductGallery images={product.images} />
          </Suspense>

          <div className="space-y-6">
            <div className="mb-4">
              <h2 className="text-3xl font-semibold mb-2 dark:text-gray-300">{product.brand}</h2>
              <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">{product.title}</h3>
              <p className="text-gray-500 dark:text-gray-300">
                Liked by <span className="font-semibold">{formatNumber(product.likes)}</span> people
              </p>
            </div>
            <div className="flex h-5 items-center space-x-4 text-sm">
              <div>
                {product.genderGroup}
              </div>
              <Separator orientation="vertical" />
              <div>
                {product.itemType}
              </div>
              <Separator orientation="vertical" />
              <div>
                {product.wearType}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold flex items-center">

                <CurrencySymbol currency={product.price.currency} className="text-2xl h-5" />
                {product.price.value.toFixed(0)}
              </span>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                {/* <span className="ml-1">{product.rating.toFixed(1)}</span> */}
                <span className="ml-1">4</span>
              </div>
            </div>

            {/* <ColorSelector colors={product.colors} />
            <SizeSelector sizes={product.sizes} /> */}

            <div className="flex space-x-4 items-top">
              <WishlistButton productId={product.slug} />
              <div className="flex-1 flex flex-col">

                <Button
                  type="button"
                  size="lg"
                  className="flex-1"
                  asChild
                >
                  <Link href={targetUrl.toString()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buy now{" "}
                    <ExternalLink />
                  </Link>
                </Button>
                <span className="inline-block text-[8px] italic text-gray-500 dark:text-gray-300 mt-1 ml-auto">
                  check it out on {targetHostname}
                </span>
              </div>
            </div>
            <div className="pb-2">
              <p className="font-semibold capitalize text-xs text-[#CCCCCC]">
                Tags
              </p>
              <p className="text-sm dark:text-gray-100 capitalize">
                #{product.tags.join(", #")}
              </p>
            </div>
            <ProductSpecifications product={product} />
          </div>
        </div>

        <Suspense fallback={<div>Loading similar outfits...</div>}>
          <SimilarOutfits outfits={similarOutfits} />
        </Suspense>

        <Suspense fallback={<div>Loading reviews...</div>}>
          <ReviewSection productId={product.slug} summary={reviewSummary} />
        </Suspense>
      </main >
    </div >
  );
}
