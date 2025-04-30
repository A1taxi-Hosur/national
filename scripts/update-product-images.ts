import { db } from "../server/db";
import { products, offers } from "../shared/schema";
import { eq } from "drizzle-orm";

async function updateProductImages() {
  console.log("Updating product and offer images...");

  try {
    // Update product images to use placeholder images
    await db.update(products)
      .set({ 
        imageUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=Modern+Velvet+Sofa" 
      })
      .where(eq(products.id, 1));
    
    await db.update(products)
      .set({ 
        imageUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=Wooden+Dining+Table" 
      })
      .where(eq(products.id, 2));
    
    await db.update(products)
      .set({ 
        imageUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=King+Size+Bed+Frame" 
      })
      .where(eq(products.id, 3));
    
    // Update offer image
    await db.update(offers)
      .set({ 
        imageUrl: "https://placehold.co/1200x400/fde68a/78350f?text=Summer+Sale" 
      })
      .where(eq(offers.id, 1));

    console.log("Product and offer images updated successfully!");
  } catch (error) {
    console.error("Error updating images:", error);
  } finally {
    process.exit(0);
  }
}

updateProductImages();