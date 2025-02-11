import { z } from "zod"

// Base validation schemas
export const skuSchema = z.string()
  .min(4, "SKU must be at least 4 characters")
  .max(20, "SKU cannot exceed 20 characters")
  .regex(/^[a-zA-Z0-9-_]+$/, "SKU must be alphanumeric")

export const productSchema = z.object({
  sku: skuSchema,
  name: z.string()
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name cannot exceed 100 characters"),
  price: z.number()
    .min(0.01, "Price must be at least $0.01")
    .max(999999.99, "Price cannot exceed $999,999.99"),
  quantity: z.number().int()
    .min(0, "Quantity cannot be negative"),
  description: z.string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  category: z.string()
    .min(1, "Category is required"),
  images: z.array(z.string().url())
    .max(5, "Maximum 5 images allowed")
    .optional(),
})

export const importSchema = z.array(z.object({
  sku: skuSchema,
  name: z.string().min(3),
  price: z.number().min(0),
  quantity: z.number().int().min(0),
  description: z.string().optional(),
  category: z.string().optional(),
  images: z.array(z.string().url()).optional(),
}))

export type Product = z.infer<typeof productSchema>
export type ImportProduct = z.infer<typeof importSchema>[number]

export const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png"]
export const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
export const MAX_IMPORT_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Books",
  "Sports & Outdoors",
  "Toys & Games",
  "Beauty & Personal Care",
  "Automotive",
  "Health & Wellness",
  "Food & Beverages",
] as const