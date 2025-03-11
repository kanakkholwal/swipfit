"use server";

import { desc, eq, like } from "drizzle-orm";
import { nanoid } from "nanoid";
import { rawProductSchema } from "~/constants/product";
import { pineconeIndex } from "~/db/connect.pc";
import { db } from "~/db/connect.pg";
import type { ProductInsertType } from "~/db/schema/product";
import { products } from "~/db/schema/product";
import { generateObjectEmbeddings } from "~/lib/ai/embedding";
import { classifyImageToObject } from "~/lib/ai/product";
import { semanticSearch } from "~/lib/ai/search";
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

        // Save the product

        const [savedProduct] = await db.insert(products).values(finalProduct).returning();

        const embeddings = await generateObjectEmbeddings(savedProduct);
        console.log('Embeddings:', embeddings.length);

        await pineconeIndex.namespace(`products-${savedProduct.genderGroup}`).upsert([
            {
                id: savedProduct.id,
                metadata: {
                    title: savedProduct.title,
                    description: savedProduct.shortDescription,
                    slug: savedProduct.slug,
                    genderGroup: savedProduct.genderGroup,
                    itemType: savedProduct.itemType,
                    wearType: savedProduct.wearType,
                    dominantColor: savedProduct.dominantColor,
                    colorPalette: savedProduct.colorPalette,
                    occasions: savedProduct.occasions,
                    seasons: savedProduct.seasons,
                },
                values: embeddings,
            },
        ])

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

        
        const queryResponse = await semanticSearch(query);

        // Perform vector search
        const matchingProducts = await db.query.products.findMany({
            where: (fields, operators) => (
                operators.or(
                    ...queryResponse.map((match) => operators.eq(fields.id, match.id))
                )
            ),
            orderBy(fields, operators) {
                return operators.desc(fields.likes);
            },
            limit: 20,
        });
        // Perform vector search (Replace with actual implementation)
        // const matchingProducts = await db.select().from(products)
        //     .where(like(products.title, `%${query}%`))
        //     .orderBy(desc(products.likes))
        //     .limit(20);



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
