import dbConnect from "~/db/connect.mongo";
import ProductModel from "~/db/models/product";

import { nanoid } from "nanoid";
import { db } from "~/db/connect.pg";
import { products } from "~/db/schema/product";

const migrateProducts = async () => {
    await dbConnect(); // Connect to MongoDB

    const mongoProducts = await ProductModel.find();
    console.log(`Found ${mongoProducts.length} products in MongoDB.`);

    for await (const product of mongoProducts) {
        await db.insert(products).values({
            id:nanoid(32),
            slug: product.slug,
            images: product.images,
            title: product.title,
            description: product.description,
            productUrl: product.productUrl,
            price: { currency: product.price.currency, value: product.price.value },
            brand: product.brand,
            variants: product.variants,
            markupMetadata: product.markupMetadata,
            shortDescription: product.shortDescription,
            genderGroup: product.genderGroup,
            itemType: product.itemType,
            wearType: product.wearType,
            specifications: product.specifications,
            dominantColor: product.dominantColor,
            colorPalette: product.colorPalette,
            tags: product.tags,
            occasions: product.occasions,
            seasons: product.seasons,
            likes: product.likes,
        });
    }

    console.log("Migration completed successfully.");
    process.exit();
};

// migrateProducts().catch((error) => {
//     console.error("Migration failed:", error);
//     process.exit(1);
// });
