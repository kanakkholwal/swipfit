"use server";
import ProductParser, { type ProductDetails } from "~/lib/product/parser";
/**
 * Fetches a product page and attempts to parse semantic product details.
 *
 * @param url - The URL of the product page.
 * @returns A Promise that resolves to a ProductDetails object or null if parsing fails.
 */
export async function fetchAndParseProductPage(
  url: string,
): Promise<ProductDetails | null> {
  try {
    const parser = new ProductParser(url);
    const product = await parser.parse();
    return product;
  } catch (error) {
    console.error("Error fetching or parsing product page:", error);
    return null;
  }
}
