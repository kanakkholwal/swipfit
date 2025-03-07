import SwipePageClient from "./client";
import { productFeed } from "~/action/products";

export default async function SwipePage() {
  const products = await productFeed();

  return <SwipePageClient initialProducts={products} />;
}
