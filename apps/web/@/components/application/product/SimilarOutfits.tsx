import Image from "next/image";
import Link from "next/link";
import type { ProductJson } from "~/types/product";

export default function SimilarOutfits({
  outfits,
}: {
  outfits: ProductJson[];
}) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Similar Outfits</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
        {outfits.map((outfit) => (
          <Link
            href={`/products/${outfit.slug}`}
            key={outfit.slug}
            className="group"
          >
            <div className="overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={outfit.images[0].url || "/placeholder.svg"}
                  alt={outfit.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-base mb-2 group-hover:text-cyan-400 transition-colors duration-200">
                  {outfit.title}
                </h4>
                <p className="text-[#CCCCCC]">
                  ${outfit.price.value.toFixed(2)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
