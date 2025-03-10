"use server";

import { desc, eq, like } from "drizzle-orm";
import { nanoid } from "nanoid";
import { rawProductSchema } from "~/constants/product";
import { db } from "~/db/connect.pg";
import type { ProductInsertType } from "~/db/schema/product";
import { products } from "~/db/schema/product";
import { classifyImageToObject } from "~/lib/ai/product";
import { embedSearchQuery } from "~/lib/ai/search";
import type { ProductJson } from "~/types/product";

export async function saveProduct(product: Record<string, unknown>) {
    try {
        const validationResponse = rawProductSchema.safeParse(product);
        if (!validationResponse.success) {
            console.error('Error validating product:', validationResponse.error);
            return Promise.reject(validationResponse.error);
        }
        const validatedProduct = validationResponse.data;

        const productSlug = `${validatedProduct.title.toLowerCase().replace(/ /g, '-')}-${nanoid(8)}`;

        // Check if the product already exists
        const existingProduct = await db.query.products.findFirst({
            where: eq(products.productUrl, validatedProduct.productUrl),
        });

        
        if (existingProduct) {
            console.log(`Product with URL: ${validatedProduct.productUrl} already exists`);
            return existingProduct;
        }

        const classifiedObject = await classifyImageToObject(validatedProduct.images.map((image) => image.url));

        // const finalProduct = {
        //     ...validatedProduct,
        //     ...classifiedObject.object,
        //     slug: productSlug,
        //     // text_embeddings: await generateObjectEmbeddings(validatedProduct),
        // };
        const finalProduct = {
            id: nanoid(32),
            slug: productSlug,
            images: validatedProduct.images.map((image) => ({
                url: image.url,
                alt: image.alt || "",
            })),
            productUrl: validatedProduct.productUrl,
            price: validatedProduct.price,
            brand: validatedProduct.brand,
            markupMetadata: validatedProduct.markupMetadata,
            variants: validatedProduct.variants,
            title: classifiedObject.object.title || validatedProduct.title,
            shortDescription: classifiedObject.object.shortDescription,
            description: classifiedObject.object.description,
            genderGroup: classifiedObject.object.genderGroup,
            itemType: classifiedObject.object.itemType,
            wearType: classifiedObject.object.wearType,
            specifications: classifiedObject.object.specifications,
            dominantColor: classifiedObject.object.dominantColor,
            colorPalette: classifiedObject.object.colorPalette,
            tags: classifiedObject.object.tags,
            occasions: classifiedObject.object.occasions,
            seasons: classifiedObject.object.seasons,
            likes: 0,

            // ...validatedProduct,
            // ...classifiedObject.object,
          } satisfies ProductInsertType;
          
          

        const [savedProduct] = await db.insert(products).values(finalProduct).returning();

        return savedProduct;
    } catch (error) {
        console.error('Error saving product:', error);
        return Promise.reject(error);
    }
}

export async function productFeed(
    preFilter: Record<string, string | number | boolean | string[] | number[]> = {}
): Promise<ProductJson[]> {
    try {
        const fetchedProducts = await db.select().from(products)
            // .where(and(...Object.entries(preFilter).map(([key, value]) => eq(products[key], value))))
            .orderBy(desc(products.likes))
            .limit(50);
        
        return fetchedProducts;
    } catch (error) {
        console.error('Error fetching product feed:', error);
        throw error;
    }
}

export async function searchProductByQuery(
    query?: string,
    preFilter: Record<string, string | number | boolean | string[] | number[]> = {}
): Promise<ProductJson[]> {
    try {
        if (!query?.trim()) {
            console.log('Query is required to search product');
            return await db.select().from(products).limit(20);
        }

        console.log('Searching for products with query:', query);

        // const existingQuery = await db.query.productSearchQueries.findFirst({
        //     where: eq(productSearchQueries.query, query),
        // });

        // if (existingQuery) {
        //     console.log(`Found existing query: ${query}`);
        //     return await db.select().from(products).where(eq(products.id, existingQuery.product_results));
        // }

        const queryEmbedding = await embedSearchQuery(query.trim());
        console.log('Query embedded:', queryEmbedding.length);

        // Perform vector search (Replace with actual implementation)
        const matchingProducts = await db.select().from(products)
            .where(like(products.title, `%${query}%`))
            .orderBy(desc(products.likes))
            .limit(20);

        // if (matchingProducts.length > 0) {
        //     await db.insert(productSearchQueries).values({
        //         query,
        //         embeddings: queryEmbedding,
        //         product_results: matchingProducts.map((product) => product.id),
        //     });
        // }

        console.log(`Found ${matchingProducts.length} products matching the query: ${query}`);
        return matchingProducts;
    } catch (error) {
        console.error('Error searching product:', error);
        throw error;
    }
}

export async function getProductBySlug(slug: string): Promise<ProductJson | null> {
    try {
        const product = await db.query.products.findFirst({
            where: eq(products.slug, decodeURIComponent(slug)),
            
        });

        return Promise.resolve(product ?? null);
    } catch (error) {
        console.error('Error getting product by slug:', error);
        throw error;
    }
}
