import type { ProductJson } from "~/types/product";

export function ProductSpecifications({ product }: { product: ProductJson }) {
  return (
    <div className="w-full border-t pt-4">
      <h2 className="text-xl font-semibold mb-2">Specifications</h2>

      <div className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="border-b border-muted pb-2">
            <p className="font-semibold capitalize text-xs text-card-foreground/95">
              Brand
            </p>
            <p className="text-muted-foreground capitalize">{product.brand}</p>
          </div>
          <div className="border-b border-muted pb-2">
            <p className="font-semibold capitalize text-xs text-card-foreground/95">
              Suitable to wear on
            </p>
            <p className="text-muted-foreground capitalize">
              {product.occasions.join(", ")}
            </p>
          </div>
          {Object.entries(
            product.specifications as unknown as Record<string, string>,
          ).map(([key, value]: [string, unknown]) => {
            return (
              <div key={key} className="border-b border-muted pb-2">
                <p className="font-semibold capitalize text-xs text-card-foreground/95">
                  {key}
                </p>
                <p className="text-muted-foreground capitalize">
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
