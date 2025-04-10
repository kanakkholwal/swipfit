import { saveProduct } from "~/actions/products";
import { db } from "~/data";

const importedMap = new Map();

const iterationLimit = 12;

const startingIndex = 310;

const timeOut = 60_000;

async function processProducts() {
  try {
    // Fetch 100 products from the database (ensure it's an array)
    const products = db.slice(startingIndex, startingIndex + 100);

    // Process all products concurrently while ensuring async execution
    let count = 0;
    console.log("🚀 Processing 100 products...");
    for await (const product of products) {
      if (count % iterationLimit === 0) {
        console.log(`Processing started again, processed ${count} products. `);
      }

      console.log("Processing product: ", product.slug);
      try {
        const productId = product.productUrl;

        // Check if product is already processed
        if (!importedMap.has(productId)) {
          await saveProduct(product); // Save product asynchronously
          console.log(productId, " is saved");
          importedMap.set(productId, true); // Mark as processed
        }
        console.log(productId, " is processed");
      } catch (error) {
        console.error(`❌ Error processing ${product.description}:`, error);
      }
      count++;
      if (count % iterationLimit === 0) {
        console.log(
          `✅ Processed ${iterationLimit} products. sleeping for ${timeOut / 1000} seconds...`,
        );
        await new Promise((resolve) => setTimeout(resolve, timeOut));
      }
    }

    console.log("✅ Successfully processed 100 products.");
  } catch (error) {
    console.error("❌ Error processing products:", error);
  }
}

// Execute the function
processProducts();
