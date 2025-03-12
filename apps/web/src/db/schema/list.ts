import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { users } from "./auth-schema"; // Assuming users schema exists
import { products } from "./product"; // Assuming products schema exists

// Lists Table (Stores user-created lists)
export const lists = pgTable("lists", {
    id: text("id").primaryKey().generatedAlwaysAs(nanoid(32)), // Auto-incrementing ID
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull().default("Favorite List"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
},
    (list) => ({
        uniqueList: unique("unique_list").on(list.userId, list.name), // Ensures unique list per user
    }));

// List Items Table (Maps products to lists)
export const listItems = pgTable("list_items", {
    id: text("id").primaryKey().generatedAlwaysAs(nanoid(32)),
    listId: text("list_id").notNull().references(() => lists.id, { onDelete: "cascade" }),
    productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    addedAt: timestamp("added_at").defaultNow().notNull(),
},
    (listItem) => ({
        uniqueListItem: unique("unique_list_item").on(listItem.listId, listItem.productId), // Ensures product is not added twice
    }));

// Relations for Drizzle ORM
export const listsRelations = relations(lists, ({ one, many }) => ({
    user: one(users, { fields: [lists.userId], references: [users.id] }),
    items: many(listItems),
}));

export const listItemsRelations = relations(listItems, ({ one }) => ({
    list: one(lists, { fields: [listItems.listId], references: [lists.id] }),
    product: one(products, { fields: [listItems.productId], references: [products.id] }),
}));
