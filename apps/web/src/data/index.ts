import dbJson from "./db.json";

export type Specifications = {
  fabric?: string;
  fit?: string;
  length?: string;
  "main trend"?: string;
  neck?: string;
  occasion?: string;
  pattern?: string;
  "sleeve length"?: string;
  type?: string;
  "pattern coverage"?: string;
  "print or pattern type"?: string;
} & Record<string, string>;

export type rawProductType = {
  product_url: string;
  gender: string;
  item_type: string;
  wear_type: string;
  image_urls: string[];
  title: string;
  description: string;
  price: number;
  mrp: number;
  specifications: Specifications;
};

export type ProductType = rawProductType & {
  slug: string;
};

export const db: ProductType[] = (
  JSON.parse(JSON.stringify(dbJson)) as rawProductType[]
).map((product) => ({
  ...product,
  slug: product.description.toLowerCase().split(" ").join("-"),
}));

export function getProductBySlug(slug: string): Promise<ProductType | null> {
  const product = db.find((p) => p.slug === slug) || null;
  return Promise.resolve(product);
}

export function getSimilarOutfits(slug: string): Promise<ProductType[]> {
  const products = db.filter((p) => p.slug !== slug).slice(0, 8);
  return Promise.resolve(products);
}

export function getProductsForSwipe(): Promise<ProductType[]> {
  const products: ProductType[] = [];

  for (let i = 0; i < 50; i++) {
    const randomIndex = Math.floor(Math.random() * db.length);
    products.push(db[randomIndex]);
  }
  return Promise.resolve(products);
}
export function getProductsForTrends(): Promise<ProductType[]> {
  const products: ProductType[] = [];

  for (let i = 0; i < 100; i++) {
    const randomIndex = Math.floor(Math.random() * db.length);
    products.push(db[randomIndex]);
  }
  return Promise.resolve([...new Set(products)]);
}
