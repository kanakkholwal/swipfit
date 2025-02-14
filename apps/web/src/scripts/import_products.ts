import { saveProduct } from "~/actions/products";
import { db } from "~/data";

const importedMap = new Map();

async function processProducts() {
    try {
        // Fetch 100 products from the database (ensure it's an array)
        const products = db.slice(0, 100);

        // Process all products concurrently while ensuring async execution
        for await (const product of products){
            try{
                const productId = product.slug

                // Check if product is already processed
                if (!importedMap.has(productId)) {
                    await saveProduct(product); // Save product asynchronously
                    console.log(productId," is saved")
                    importedMap.set(productId, true); // Mark as processed
                }
                console.log(productId," is processed")
            }
            catch (error) {
                console.error(`❌ Error processing ${product.description}:`, error);
            }
        }
      
        

        console.log("✅ Successfully processed 100 products.");
    } catch (error) {
        console.error("❌ Error processing products:", error);
    }
}

// Execute the function
processProducts();
