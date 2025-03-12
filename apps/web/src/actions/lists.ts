import { eq } from "drizzle-orm";
import { db } from "~/db/connect.pg"; // Import Drizzle instance
import { listItems, lists } from "~/db/schema";
import { getSession } from "~/lib/auth-server";

export async function handleSuperLike(productId: string) {
    const session = await getSession();
    if (!session) {
        throw new Error("User not authenticated");
    }
    const userId = session.user.id;

    // Find or create the user's "Favorite List"
    let [favoriteList] = await db.select().from(lists)
        .where(eq(lists.userId, userId))
        .limit(1);

    if (!favoriteList) {
        const [newList] = await db.insert(lists)
            .values({
                userId,
                name: "Favorite List",

            })
            .returning();
        favoriteList = newList;
    }

    // Add product to the list if not already added
    await db.insert(listItems)
        .values({ listId: favoriteList.id, productId })
        .onConflictDoNothing(); // Prevent duplicate entries

    return { success: true };
}
