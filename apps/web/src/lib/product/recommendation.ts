"use server";

import { eq, inArray, ne, sql } from "drizzle-orm";
import { pineconeIndex } from "~/db/connect.pc";
import { db } from "~/db/connect.pg";
import { userProductPreferences } from "~/db/schema"; // Drizzle schema

/**
 * Retrieves personalized outfit recommendations using **Collaborative Filtering**.
 *
 * Steps:
 * 1. Fetch outfits liked by the user.
 * 2. Identify users who liked the same outfits.
 * 3. Fetch outfits liked by those similar users.
 * 4. Rank results based on popularity (likes & superlikes).
 *
 * @param {string} userId - The user ID for recommendations.
 * @returns {Promise<{ productId: string; score: number }[]>} - List of recommended outfit IDs with scores.
 */
export async function getCollaborativeRecommendations(userId: string) {
  // Step 1: Get outfits liked by the user
  const likedOutfits = await db.query.userProductPreferences.findMany({
    where: (up, { eq }) => eq(up.userId, userId),
    columns: { productId: true },
  });

  if (!likedOutfits.length) return [];
  const likedOutfitIds = likedOutfits.map((product) => product.productId);

  // Step 2: Find users who liked the same outfits (excluding current user)
  const similarUsers = await db
    .selectDistinct({ userId: userProductPreferences.userId })
    .from(userProductPreferences)
    .where(
      inArray(userProductPreferences.productId, likedOutfitIds) &&
        ne(userProductPreferences.userId, userId),
    );

  if (!similarUsers.length) return [];
  const similarUserIds = similarUsers.map((user) => user.userId);

  // Step 3: Find outfits liked by similar users & rank them based on popularity
  const recommendations = await db
    .select({
      productId: userProductPreferences.productId,
      score: sql<number>`SUM(${userProductPreferences.weight})`, // Weighting based on Superlikes
    })
    .from(userProductPreferences)
    .where(
      inArray(userProductPreferences.userId, similarUserIds) &&
        eq(userProductPreferences.action, "like"),
    )
    .groupBy(userProductPreferences.productId)
    .orderBy(sql`score DESC`)
    .limit(10);

  return recommendations;
}

/**
 * Retrieves **visually similar outfits** using **Content-Based Filtering** via **Pinecone**.
 *
 * Steps:
 * 1. Fetch outfits liked by the user.
 * 2. Retrieve their vector embeddings from **Pinecone**.
 * 3. Perform a **vector similarity search**.
 * 4. Filter out already liked/disliked outfits.
 *
 * @param {string} userId - The user ID for recommendations.
 * @returns {Promise<string[]>} - List of recommended outfit IDs based on similarity.
 */
export async function getSimilarOutfitsFromLiked(userId: string) {
  // Step 1: Fetch outfits liked by the user
  const likedOutfits = await db.query.userProductPreferences.findMany({
    where: (up, { eq }) => eq(up.userId, userId) && eq(up.action, "like"),
    columns: { productId: true },
  });

  if (!likedOutfits.length) return [];
  const likedOutfitIds = likedOutfits.map((product) => product.productId);

  // Step 2: Retrieve vector embeddings of liked outfits from Pinecone
  const vectors = await pineconeIndex.fetch(likedOutfitIds);
  if (
    !vectors ||
    !Array.isArray(vectors.records) ||
    vectors.records.length === 0
  )
    return [];

  // Step 3: Perform vector similarity search in Pinecone
  const similarOutfits = await pineconeIndex.query({
    vector: Array.from(vectors.records[0].values as number[]),
    topK: 10, // Get top 10 most similar outfits
    includeMetadata: true,
  });

  // Step 4: Filter out outfits already interacted with (liked or disliked)
  const filteredOutfits = similarOutfits.matches
    .map((match) => match.id)
    .filter((id) => !likedOutfitIds.includes(id));

  return filteredOutfits;
}

/**
 * **Hybrid Recommendation System:** Combines **Collaborative Filtering** & **Content-Based Filtering**.
 *
 * - 70% outfits from **similar users' preferences**.
 * - 30% **visually similar outfits** from Pinecone.
 *
 * @param {string} userId - The user ID for recommendations.
 * @returns {Promise<string[]>} - List of final outfit recommendations.
 */
export async function getRecommendedOutfits(userId: string) {
  const collaborativeRecommendations =
    await getCollaborativeRecommendations(userId);
  const contentRecommendations = await getSimilarOutfitsFromLiked(userId);

  // Weight distribution:
  // 70% outfits from collaborative filtering (user-based recommendations)
  // 30% outfits from content-based filtering (visually similar recommendations)
  return [
    ...collaborativeRecommendations.slice(0, 7).map((rec) => rec.productId),
    ...contentRecommendations.slice(0, 3),
  ];
}
