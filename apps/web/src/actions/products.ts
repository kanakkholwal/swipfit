"use server";

import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { rawProductSchema } from "~/constants/product";
import { model, pinecone, pineconeIndex } from "~/db/connect.pc";
import { db } from "~/db/connect.pg";
import type { ProductInsertType } from "~/db/schema/product";
import { products, userProductPreferences } from "~/db/schema/product";
import { classifyImageToObject } from "~/lib/ai/product";
import { semanticSearch } from "~/lib/ai/search";
import { getSession } from "~/lib/auth-server";
import { getCollaborativeRecommendations } from "~/lib/product/recommendation";
import type { ProductJson } from "~/types/product";
import { handleSuperLike } from "./lists";

export async function saveProduct(product: Record<string, unknown>) {
  try {
    const validationResponse = rawProductSchema.safeParse(product);
    if (!validationResponse.success) {
      console.error("Error validating product:", validationResponse.error);
      return Promise.reject(validationResponse.error);
    }
    const validatedProduct = validationResponse.data;

    const productSlug = `${validatedProduct.title.toLowerCase().replace(/ /g, "-")}-${nanoid(8)}`;

    // Check if the product already exists
    const existingProduct = await db.query.products.findFirst({
      where: eq(products.productUrl, validatedProduct.productUrl),
    });

    if (existingProduct) {
      console.log(
        `Product with URL: ${validatedProduct.productUrl} already exists`,
      );
      return existingProduct;
    }

    const classifiedObject = await classifyImageToObject(
      validatedProduct.images.map((image) => image.url),
    );

    const finalProduct = {
      id: nanoid(32),
      slug: productSlug,
      images: validatedProduct.images.map((image) => ({
        url: image.url,
        alt: image.alt || "",
      })),
      productUrl: validatedProduct.productUrl,
      price: validatedProduct.price,
      brand: validatedProduct.brand,
      markupMetadata: validatedProduct.markupMetadata,
      variants: validatedProduct.variants,
      title: classifiedObject.object.title || validatedProduct.title,
      shortDescription: classifiedObject.object.shortDescription,
      description: classifiedObject.object.description,
      genderGroup: classifiedObject.object.genderGroup,
      itemType: classifiedObject.object.itemType,
      wearType: classifiedObject.object.wearType,
      specifications: classifiedObject.object.specifications,
      dominantColor: classifiedObject.object.dominantColor,
      colorPalette: classifiedObject.object.colorPalette,
      tags: classifiedObject.object.tags,
      occasions: classifiedObject.object.occasions,
      seasons: classifiedObject.object.seasons,
      likes: 0,

      // ...validatedProduct,
      // ...classifiedObject.object,
    } satisfies ProductInsertType;

    // Save the product

    const [savedProduct] = await db
      .insert(products)
      .values(finalProduct)
      .returning();


    const embedding = await pinecone.inference.embed(
      model,
      JSON.stringify(savedProduct).split(`",`),
      { inputType: "passage", truncate: "END", vectorType: "dense" },
    );
    // console.log("Embeddings:", embedding);

    await pineconeIndex
      .namespace(`products-${savedProduct.genderGroup}`)
      .upsert([
        {
          id: savedProduct.id,
          metadata: {
            title: savedProduct.title,
            description: savedProduct.shortDescription,
            slug: savedProduct.slug,
            genderGroup: savedProduct.genderGroup,
            itemType: savedProduct.itemType,
            wearType: savedProduct.wearType,
            dominantColor: savedProduct.dominantColor,
            colorPalette: savedProduct.colorPalette,
            occasions: savedProduct.occasions,
            seasons: savedProduct.seasons,
          },
          values: Array.from(
            embedding.data[0].vectorType === "dense"
              ? embedding.data[0].values
              : []),
        },
      ]);

    return savedProduct;
  } catch (error) {
    console.error("Error saving product:", error);
    return Promise.reject(error);
  }
}

export async function productFeed(
  preFilter: Record<
    string,
    string | number | boolean | string[] | number[]
  > = {},
): Promise<ProductJson[]> {
  try {
    const session = await getSession();
    if (!session) {
      return Promise.reject("User session is required to fetch product feed");
    }
    const fetchedProducts = await db
      .select()
      .from(products)
      // .where(and(...Object.entries(preFilter).map(([key, value]) => eq(products[key], value))))
      .orderBy(desc(products.likes))
      .limit(50);

    const recommendations = await getCollaborativeRecommendations(session.user.id);
    console.log("Recommendations:", recommendations);

    const recommendedProducts = await db.query.products.findMany({
      where: (fields, operators) =>
        operators.inArray(fields.id, recommendations.map((rec) => rec.productId)),
    });
    if (recommendedProducts.length < 20) {
      return recommendedProducts.concat(fetchedProducts);
    }


    return recommendedProducts;
  } catch (error) {
    console.error("Error fetching product feed:", error);
    throw error;
  }
}

export async function getProductsForTrends(): Promise<ProductJson[]> {
  try {
    const trendingProducts = await db.query.products.findMany({
      orderBy: (products, { asc }) => [asc(products.id)],
      limit: 100,
    });

    return trendingProducts;
  } catch (error) {
    console.error("Error fetching trending products:", error);
    throw error;
  }
}

export async function updateSwipeStatus(
  productId: string,
  action: "like" | "dislike" | "super_like",
) {
  try {
    const session = await getSession();
    if (!session) {
      return Promise.reject("User session is required to update swipe status");
    }
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product) {
      return Promise.reject(`Product with ID: ${productId} does not exist`);
    }

    await db.transaction(async (txDb) => {
      //  a check to see if the user has already liked the product
      const existingPreference =
        await txDb.query.userProductPreferences.findFirst({
          where: (fields, operators) =>
            operators.and(
              operators.eq(fields.userId, session.user.id),
              operators.eq(fields.productId, productId),
            ),
        });

      if (existingPreference) {
        console.log(
          `User has already ${existingPreference.action}d the product`,
        );
        return Promise.resolve(true);
      }

      if (action === "like" || action === "super_like") {
        await txDb
          .update(products)
          .set({
            likes: product.likes + 1,
          })
          .where(eq(products.id, productId));
        if (action === "super_like") {
          await handleSuperLike(productId);
        }
      }

      await txDb.insert(userProductPreferences).values({
        userId: session.user.id,
        productId,
        action,
        weight: action === "dislike" ? -1 : action === "like" ? 1 : 2,
      });
      // maybe implement a way to add  into wishlist
    });

    return Promise.resolve(true);
  } catch (error) {
    console.error("Error updating swipe status:", error);
    throw error;
  }
}

export async function searchProductByQuery(
  query?: string,
  preFilter: Record<
    string,
    string | number | boolean | string[] | number[]
  > = {},
): Promise<[ProductJson[], Record<string, string[]>]> {
  try {
    // get the distinct values with non duplicate values

    const [colors, tags, occasions, seasons, brands] = await Promise.all([
      (
        await db
          .selectDistinct({ colorPalette: products.colorPalette })
          .from(products)
          .orderBy(products.colorPalette)
          .limit(10)
      )
        .flatMap((color) => color.colorPalette)
        .filter((color, i, arr) => color && arr.indexOf(color) === i),
      (
        await db
          .selectDistinct({ tags: products.tags })
          .from(products)
          .orderBy(products.tags)
          .limit(10)
      )
        .flatMap((tags) => tags.tags)
        .filter((tag, i, arr) => tag && arr.indexOf(tag) === i),
      (
        await db
          .selectDistinct({ occasions: products.occasions })
          .from(products)
          .orderBy(products.occasions)
          .limit(10)
      )
        .flatMap((occasion) => occasion.occasions)
        .filter((occasion, i, arr) => occasion && arr.indexOf(occasion) === i),
      (
        await db
          .selectDistinct({ seasons: products.seasons })
          .from(products)
          .orderBy(products.seasons)
          .limit(10)
      )
        .flatMap((season) => season.seasons)
        .filter((season, i, arr) => season && arr.indexOf(season) === i),

      (
        await db
          .selectDistinct({ brand: products.brand })
          .from(products)
          .orderBy(products.brand)
          .limit(10)
      )
        .map((brand) => brand.brand)
        .filter((brand, i, arr) => brand && arr.indexOf(brand) === i),
    ]);

    const filters = {
      colors,
      tags,
      occasions,
      seasons,
      brands,
    };

    if (!query?.trim()) {
      console.log("Query is required to search product");
      return [await db.select().from(products).limit(20), filters];
    }

    console.log("Searching for products with query:", query);

    const queryResponse = await semanticSearch(query);

    // Perform vector search
    const matchingProducts = await db.query.products.findMany({
      where: (fields, operators) =>
        operators.and(
          operators.or(
          ...queryResponse.map((match) => operators.eq(fields.id, match.id)),
        ),
        operators.eq(fields.genderGroup, "man")
      ),
      orderBy(fields, operators) {
        return operators.desc(fields.likes);
      },
      limit: 20,
    });
    // Perform vector search (Replace with actual implementation)
    // const matchingProducts = await db.select().from(products)
    //     .where(like(products.title, `%${query}%`))
    //     .orderBy(desc(products.likes))
    //     .limit(20);

    console.log(
      `Found ${matchingProducts.length} products matching the query: ${query}`,
    );

    return [matchingProducts, filters];
  } catch (error) {
    console.error("Error searching product:", error);
    return Promise.reject(error);
  }
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductJson | null> {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.slug, decodeURIComponent(slug)),
    });

    return Promise.resolve(product ?? null);
  } catch (error) {
    console.error("Error getting product by slug:", error);
    throw error;
  }
}

export async function getSimilarProducts(slug: string): Promise<ProductJson[]> {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.slug, slug),
    });

    if (!product) {
      return Promise.reject(`Product with slug: ${slug} does not exist`);
    }

    const similarProducts = await db.query.products.findMany({
      where: (fields, operators) =>
        operators.and(
          operators.ne(fields.id, product.id),
          operators.eq(fields.genderGroup, product.genderGroup),
          operators.eq(fields.occasions, product.occasions),
          operators.eq(fields.seasons, product.seasons),

          operators.or(
            operators.eq(fields.itemType, product.itemType),
            operators.eq(fields.wearType, product.wearType),
            operators.eq(fields.dominantColor, product.dominantColor),
            operators.eq(fields.colorPalette, product.colorPalette),
          ),
        ),
      orderBy(fields, operators) {
        return operators.desc(fields.likes);
      },
      limit: 8,
    });

    return similarProducts;
  } catch (error) {
    console.error("Error getting similar products:", error);
    throw error;
  }
}


