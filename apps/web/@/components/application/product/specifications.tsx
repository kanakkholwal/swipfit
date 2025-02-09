import type { ProductType } from "~/data";

export function ProductSpecifications({ product }: { product: ProductType }) {
  return (
    <div className="w-full border-t border-gray-700 pt-4">
      <h2 className="text-xl font-semibold mb-2">Specifications</h2>

      <div className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(
            product.specifications as unknown as Record<string, string>,
          ).map(([key, value]: [string, unknown]) => {
            return (
              <div key={key} className="border-b border-muted pb-2">
                <p className="font-semibold capitalize text-xs text-[#CCCCCC]">
                  {key}
                </p>
                <p className="text-gray-100 capitalize">
                  {value === null || value === "unknown"
                    ? "-"
                    : (value as string)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
