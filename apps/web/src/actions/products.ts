"use server";

import { nanoid } from "nanoid";
import { rawProductSchema } from "~/constants/product";
import dbConnect from "~/db/connect.mongo";
import ProductModel, { ProductSearchQuery } from "~/db/models/product";
import { generateObjectEmbeddings } from "~/lib/ai/embedding";
import { classifyImageToObject } from "~/lib/ai/product";
import { embedSearchQuery } from "~/lib/ai/search";
import type { ProductJson } from "~/types/product";

export async function saveProduct(product: Record<string, unknown>) {
    try {
        // Validate the product
        const validationResponse = rawProductSchema.safeParse(product);
        if (!validationResponse.success) {
            console.error('Error validating product:', validationResponse.error);
            return Promise.reject(validationResponse.error);
        }
        const validatedProduct = validationResponse.data;

        const productSlug = `${validatedProduct.title.toLowerCase().replace(/ /g, '-')}-${nanoid(8)}`;
        await dbConnect();
        // check if [product.productUrl] already exists in the database
        const existingProduct = await ProductModel.findOne({ productUrl: validatedProduct.productUrl });
        if (existingProduct) {
            console.log(`Product with target: ${validatedProduct.productUrl} already exists`);
            return Promise.resolve(JSON.parse(JSON.stringify(existingProduct)));
        }

        const classifiedObject = await classifyImageToObject(validatedProduct.images.map((image) => image.url));

        const finalProduct = {
            ...validatedProduct,
            ...classifiedObject.object,
        }
        // generate embeddings for the product
        const productEmbeddings = await generateObjectEmbeddings(finalProduct);
        console.log(`${productEmbeddings.length} embeddings generated for product: ${finalProduct.title}`);

        // Save product to the database
        await dbConnect();
        const savedProduct = new ProductModel({
            ...finalProduct,
            slug: productSlug,
            text_embeddings: productEmbeddings,
        });

        await savedProduct.save();


        // return the product in json
        return Promise.resolve(JSON.parse(JSON.stringify(savedProduct)));

    } catch (error) {
        console.error('Error saving product:', error);
        return Promise.reject(error);
    }
}


export async function searchProductByQuery(
    query: string,
    preFilter: Record<string, string | number | boolean | string[] | number[]> = {}
): Promise<ProductJson[]> {
    try {
        await dbConnect();

        if (!query.trim()) {
            console.log('Query is required to search product');
            const products = await ProductModel.find(preFilter).limit(20).exec();
            return JSON.parse(JSON.stringify(products));
        }
        console.log('Searching for products with query:', query);
        const existingQuery = await ProductSearchQuery.findOne({
            query
        });
        if (existingQuery) {
            console.log(`Found existing query: ${query}`);
            const products = await ProductModel.find({ _id: { $in: existingQuery.product_results } }).exec();
            return JSON.parse(JSON.stringify(products));
        }


        const queryEmbedding = await embedSearchQuery(query.trim());
        console.log('Query embedded:', queryEmbedding.length);

        // Search for products with similar embeddings
        const products = await ProductModel.aggregate([
            // { "$match": preFilter }, // Pre-filtering based on the provided conditions
            {
                "$vectorSearch": {
                    "queryVector": queryEmbedding,
                    "path": "text_embeddings",
                    "numCandidates": 100,
                    "limit": 20,
                    "index": "products_index",
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "title": 1,
                    "price": 1,
                    "images": 1,
                    "productUrl": 1,
                    "slug": 1,
                    "brand": 1,
                    "likes": 1,
                    "shortDescription": 1,
                    "genderGroup": 1,
                    "itemType": 1,
                    "wearType": 1,
                    "specifications": 1,
                    "tags": 1,
                    "occasions": 1,
                    "dominantColor": 1,
                    "colorPalette": 1,
                    'similarityScore': {
                        '$meta': 'vectorSearchScore'
                    }
                }
            },
            { "$sort": { "similarityScore": -1 } } // Sorting based on similarity score
        ]).exec();
        if(products.length > 0){
            const newQuery = new ProductSearchQuery({
                query,
                embeddings: queryEmbedding,
                product_results: products.map((product) => product._id),
            });
            await newQuery.save();
        }

        console.log(`Found ${products.length} products matching the query: ${query}`);
        return JSON.parse(JSON.stringify(products));
    } catch (error) {
        console.error('Error searching product:', error);
        throw error;
    }
}



export async function getProductBySlug(slug: string): Promise<ProductJson | null> {
    try {
        await dbConnect();
        console.log("slug",decodeURIComponent(slug))
        const product = await ProductModel.findOne({ slug:decodeURIComponent(slug) })
        .select("-text_embeddings")
        .exec();
        console.log(product)
        return JSON.parse(JSON.stringify(product));
        }
    catch (error) {
        console.error('Error getting product by slug:', error);
        throw error;
    }
}