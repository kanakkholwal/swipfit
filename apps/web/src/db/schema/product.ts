import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { integer, jsonb, pgTable, primaryKey, text, varchar } from "drizzle-orm/pg-core";


export const products = pgTable("products", {
    id: text("id").primaryKey(),
    
    slug: text("slug").unique().notNull(),
    images: jsonb("images").notNull().default([]).$type<{
        url: string;
        alt: string;
    }[]>(),

    title: text("title").notNull(),
    shortDescription: text("short_description").notNull(),
    description: text("description").notNull(),

    productUrl: text("product_url").unique().notNull(),
    
    price: jsonb("price").notNull().default({
        currency: "INR",
        value: 0,
    }).$type<{
        currency: string;
        value: number;
    }>(),

    brand: text("brand").notNull(),
    variants: jsonb("variants").notNull().default({ size: [] }).$type<{
        size: string[];
    }>(),
    markupMetadata: jsonb("markup_metadata").default({ sku: "" }).$type<Record<string, string>>(),

    // "women" | "men" | "boy" | "girl"
    genderGroup: varchar("gender_group", { length: 10 }).notNull(),
    itemType: text("item_type").notNull(),
    wearType: text("wear_type").notNull(),
    specifications: jsonb("specifications").default({}),

    dominantColor: text("dominant_color").notNull(),
    colorPalette: text("color_palette").array().notNull().default([]),
    tags: text("tags").array().notNull().default([]),
    occasions: text("occasions").array().notNull().default([]),
    seasons: text("seasons").array().notNull().default([]),

    likes: integer("likes").notNull().default(0),
});

// export const productLikes = pgTable("product_likes", {
//     userId: text("user_id").notNull(),
//     productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
// }, (table) => ({
//     pk: primaryKey({ columns: [table.userId, table.productId] })
// }));

// export const productSearchQueries = pgTable("product_search_queries", {
//     id: serial("id").primaryKey(),
//     query: text("query").notNull(),
//     embeddings: jsonb("embeddings").notNull(),
//     productResults: jsonb("product_results").notNull().default([]),
//     createdAt: timestamp("created_at").default(sql`now()`),
// });



export type ProductInsertType = InferInsertModel<typeof products>;
export type ProductSelectType = InferSelectModel<typeof products>;
export type ProductJson = InferSelectModel<typeof products>;
