import { SquaresBackground } from "@/components/animated/bg-square";
import { cache } from "react";
import { searchProductByQuery } from "~/actions/products";
import SearchPageClient from "./client";

const getProducts = cache(searchProductByQuery);

export default async function SearchPage(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query?.trim() || "";

  const [products, filters] = await getProducts(query);

  // console.log("Products: ", products);
  console.log("Filters: ", filters);

  return (
    <div className="min-h-screen">
      <SquaresBackground
        direction="diagonal"
        speed={0.5}
        squareSize={40}
        borderColor="#333"
        hoverFillColor="#222"
        className="fixed inset-0 min-h-screen h-full w-full z-0"
      />

      <SearchPageClient initialData={products} filters={filters} />
    </div>
  );
}
