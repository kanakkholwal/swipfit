import SwipePageClient from "./client";
import { getProductsForSwipe } from "~/data";

export default async function SwipePage() {
  const products = await getProductsForSwipe();

  return <SwipePageClient initialProducts={products} />;
}
