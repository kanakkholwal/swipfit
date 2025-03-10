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


export async function actionOnProduct(id:string,action:string){
    try {
        const product = await db.query.products.findFirst({
            where: eq(products.id, id),
        });

        if (!product) {
            return Promise.reject(`Product with ID: ${id} does not exist`);
        }

        if (action === "like") {
            await db.update(products)
            .set({
                // likes: db.raw`${products.likes} + 1`
            })
            .where(eq(products.id, id))
        } else if (action === "dislike") {
            
        } else if (action === "super_like") {
            
        } else {
            return Promise.reject(`Invalid action: ${action}`);
        }

        return product;
    } catch (error) {
        console.error("Error performing action on product:", error);
        return Promise.reject(error);
    }
}