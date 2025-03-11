import type {
  PineconeRecord,
  RecordMetadata,
} from "@pinecone-database/pinecone";
import { model, pinecone, pineconeIndex } from "~/db/connect.pc";
import { db } from "~/db/connect.pg";

const vectors = [] as PineconeRecord<RecordMetadata>[];

async function importToPineCone() {
  const products = await db.query.products.findMany({});

  for await (const product of products) {
    console.log("Processing product: ", product.slug);
    try {
      // const embedding = await generateObjectEmbeddings(product);
      const embedding = await pinecone.inference.embed(
        model,
        JSON.stringify(product).split(`",`),
        { inputType: "passage", truncate: "END", vectorType: "dense" },
      );

      vectors.push({
        id: product.id.toString(),
        values: Array.from(
          embedding.data[0].vectorType === "dense"
            ? embedding.data[0].values
            : [],
        ),
        metadata: {
          title: product.title,
          description: product.shortDescription,
          slug: product.slug,
          genderGroup: product.genderGroup,
        },
      });
      await pineconeIndex
        .namespace(`products-${product.genderGroup}`)
        .upsert(vectors);
    } catch (error) {
      console.error("Error processing product: ", product.slug, error);
    }
    console.log("Processed product: ", product.slug);
  }
}

importToPineCone()
  .then(() => {
    console.log("✅ Imported data to PineCone");
  })
  .catch((error) => {
    console.error("❌ Error importing data to PineCone:", error);
  })
  .finally(async () => {
    console.log(`✅ Processed ${vectors.length} products.`);
    console.log("✅ Imported data to PineCone");
    console.log("🚀 Exiting process...");
    process.exit(0);
  });
