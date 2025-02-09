import Image from "next/image";
import Link from "next/link";
import type { ProductType } from "~/data";

export default function SimilarOutfits({
  outfits,
}: {
  outfits: ProductType[];
}) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Similar Outfits</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {outfits.map((outfit) => (
          <Link
            href={`/product/${outfit.slug}`}
            key={outfit.slug}
            className="group"
          >
            <div className="bg-[#1A1A1A] rounded-lg overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={outfit.image_urls[0] || "/placeholder.svg"}
                  alt={outfit.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-cyan-400 transition-colors duration-200">
                  {outfit.title}
                </h3>
                <h6 className="text-sm text-[#CCCCCC] mb-2">
                  {outfit.description}
                </h6>
                <p className="text-[#CCCCCC]">${outfit.price.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
