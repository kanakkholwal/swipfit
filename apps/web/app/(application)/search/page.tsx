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

      <SearchPageClient initialData={products} filters={filters} initialQuery={query}/>
    </div>
  );
}
