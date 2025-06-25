import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { storage } from "./storage";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ImageGenerationOptions {
  category: string;
  productName: string;
  description?: string;
}

export async function generateProductImage({ category, productName, description }: ImageGenerationOptions): Promise<string> {
  try {
    // Create category-specific prompts for furniture images
    const categoryPrompts = {
      "Living Room": "elegant modern living room furniture, sofa, coffee table, contemporary design, warm lighting, professional product photography",
      "Dining": "beautiful dining room furniture, dining table and chairs, wooden finish, elegant design, professional product photography",
      "Bedroom": "modern bedroom furniture, bed frame, wardrobe, nightstand, contemporary design, professional product photography",
      "Office": "professional office furniture, desk, chair, ergonomic design, modern workspace, professional product photography",
      "Decor & Interior": "modern home decor items, interior accessories, stylish design elements, professional product photography",
      "Hotel Furniture": "luxury hotel furniture, commercial grade, elegant design, professional hospitality furniture, professional product photography",
      "Restaurant Furniture": "commercial restaurant furniture, dining chairs, tables, professional grade, modern design, professional product photography"
    };

    const basePrompt = categoryPrompts[category as keyof typeof categoryPrompts] || 
      "modern furniture piece, elegant design, professional product photography";
    
    const fullPrompt = `${basePrompt}, ${productName.toLowerCase()}, high quality, studio lighting, white background, 4K resolution, commercial photography style`;

    console.log(`Generating image for: ${productName} (${category})`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: fullPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error("No image URL returned from OpenAI");
    }

    // Download and save the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const timestamp = Date.now();
    const filename = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.jpg`;
    const filePath = path.resolve(process.cwd(), 'uploads', filename);

    await fs.promises.writeFile(filePath, Buffer.from(imageBuffer));
    
    console.log(`Image saved: ${filename}`);
    return `/uploads/${filename}`;
    
  } catch (error) {
    console.error(`Failed to generate image for ${productName}:`, error);
    // Return a placeholder path if generation fails
    return "/uploads/1746039882748-7b2f470d02108271.jpg";
  }
}

export async function generateImagesForAllProducts(): Promise<void> {
  try {
    console.log("Starting image generation for all products...");
    const products = await storage.getAllProducts();
    
    for (const product of products) {
      console.log(`Processing product: ${product.name} (${product.category})`);
      
      // Skip if product already has a valid image from uploads
      if (product.imageUrl && product.imageUrl.startsWith('/uploads/')) {
        const filePath = path.resolve(process.cwd(), 'uploads', path.basename(product.imageUrl));
        if (fs.existsSync(filePath)) {
          console.log(`Product ${product.name} already has valid image, skipping`);
          continue;
        }
      }
      
      try {
        const newImageUrl = await generateProductImage({
          category: product.category,
          productName: product.name,
          description: product.description
        });
        
        // Update product with new image
        await storage.updateProduct(product.id, {
          ...product,
          imageUrl: newImageUrl
        });
        
        console.log(`Updated ${product.name} with new image: ${newImageUrl}`);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`Failed to generate image for product ${product.name}:`, error);
      }
    }
    
    console.log("Image generation process completed!");
    
  } catch (error) {
    console.error("Failed to generate images for products:", error);
  }
}