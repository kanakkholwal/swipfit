"use server";

import { rawProductSchema } from "~/constants/product";
import { classifyImageToObject, generateObjectEmbeddings } from "~/lib/ai/product";

export async function saveProduct(product: Record<string, unknown>) {
    try {
        // Validate the product
        const validationResponse = rawProductSchema.safeParse(product);
        if (!validationResponse.success) {
            console.error('Error validating product:', validationResponse.error);
            return Promise.reject(validationResponse.error);
        }
        const validatedProduct = validationResponse.data;

        const classifiedObject = await classifyImageToObject(validatedProduct.images.map((image) => image.url));

        const finalProduct = {
            ...validatedProduct,
            ...classifiedObject.object,
        }
        // generate embeddings for the product
        const productEmbeddings = await generateObjectEmbeddings(finalProduct);

        // save embeddings to the database

        // Save product to the database

        // return the final product
        return Promise.resolve({
            ...finalProduct,
            embeddings: productEmbeddings,
        });

    } catch (error) {
        console.error('Error saving product:', error);
        return Promise.reject(error);
    }
}