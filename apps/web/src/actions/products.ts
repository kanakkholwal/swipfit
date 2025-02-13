"use server";

import { rawProductSchema } from "~/constants/product";
import dbConnect from "~/db/connect.mongo";
import ProductModel from "~/db/models/product";
import { generateObjectEmbeddings } from "~/lib/ai/embedding";
import { classifyImageToObject } from "~/lib/ai/product";

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
        console.log(productEmbeddings.length)

        // Save product to the database
        await dbConnect();
        const savedProduct = new ProductModel({
            ...finalProduct,
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