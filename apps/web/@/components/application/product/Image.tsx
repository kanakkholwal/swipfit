import Image from "next/image";
// import { ImageSwiper } from "@/components/extended/image-swiper";
import type { ProductType } from "~/types/product";

export default function ProductImages({
  images,
}: {
  images: ProductType["images"];
}) {
  // return images.length > 1 ? (
  //   <ImageSwiper
  //     images={images}
  //     className="absolute inset-0 w-full h-full object-cover"
  //   />
  // ) : (
    return <Image
      src={images[0].url}
      alt={images[0].alt || ""}
      fill={true}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="absolute inset-0 w-full h-full object-cover"
    />
  // );
}
