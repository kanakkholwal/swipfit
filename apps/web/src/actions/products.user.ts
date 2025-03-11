"use server";

import { eq } from "drizzle-orm";
import { db } from "~/db/connect.pg";
import { products } from "~/db/schema/product";


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