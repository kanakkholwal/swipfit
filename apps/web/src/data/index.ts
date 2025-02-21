import dbJson from "./db.json";
import {shuffle} from "~/lib/utils"


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

export type ProductType = {
  title: string;
  description: string;
  slug: string;
  images: { url: string; alt: string }[];
  price: {
    currency: string;
    value: number;
  };
  variants: {
    size: string[];
  };
  markupMetadata: {
    sku: string;
  };
  productUrl: string;
  brand: string;
};

export const db: ProductType[] = shuffle((
  JSON.parse(JSON.stringify(dbJson)) as rawProductType[]
).map((product) => ({
  ...product,
  slug: product.description.toLowerCase().split(" ").join("-"),
})).filter((product, index, array) => array.findIndex(t => t.slug === product.slug) === index && product.item_type !== "innerwear")
  .map((product) => ({
    ...product,
    title:product.description,
    description:product.description,
    brand:product.title,
    images:product.image_urls.map((img) => ({
        url:img,
        alt:product.description,
    })),
    price:{
        currency:"INR",
        value:product.price
    },
    variants:{
        size:[]
    },
    markupMetadata:{
        sku:""
    },
    productUrl:product.product_url
}))
);


export function getProducts(): Promise<ProductType[]> {
  return Promise.resolve(db);
}
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
