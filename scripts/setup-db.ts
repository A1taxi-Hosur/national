import { db } from "../server/db";
import { users, products, offers, media } from "../shared/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function setupDatabase() {
  console.log("Starting database setup...");

  try {
    // Create admin user if not exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.username, "admin"));

    if (existingAdmin.length === 0) {
      console.log("Creating admin user...");
      const adminPassword = await hashPassword("admin123");
      const [admin] = await db
        .insert(users)
        .values({
          username: "admin",
          password: adminPassword,
          isAdmin: true,
        })
        .returning();
      console.log("Admin user created:", admin.id);
    } else {
      console.log("Admin user already exists");
    }

    // Add sample product data
    const existingProducts = await db.select().from(products);
    if (existingProducts.length === 0) {
      console.log("Adding sample products...");
      
      await db.insert(products).values([
        {
          name: "Modern Velvet Sofa",
          description: "Luxurious 3-seater sofa with velvet upholstery and wooden legs.",
          category: "Living Room",
          imageUrl: "/uploads/modern-sofa.jpg",
          price: 42999,
          status: "active",
          isFeatured: true,
        },
        {
          name: "Wooden Dining Table",
          description: "Six-seater dining table made from premium quality wood.",
          category: "Dining",
          imageUrl: "/uploads/dining-table.jpg",
          price: 38599,
          status: "active",
          isFeatured: true,
        },
        {
          name: "King Size Bed Frame",
          description: "Elegant king size bed frame with headboard and storage.",
          category: "Bedroom",
          imageUrl: "/uploads/king-bed.jpg",
          price: 49999,
          status: "active",
          isFeatured: true,
        }
      ]);
      console.log("Sample products added");
    } else {
      console.log(`${existingProducts.length} products already exist in database`);
    }

    // Add sample offer
    const existingOffers = await db.select().from(offers);
    if (existingOffers.length === 0) {
      console.log("Adding sample offer...");
      await db.insert(offers).values({
        title: "Summer Sale",
        description: "25% off on all living room furniture. Limited time offer!",
        imageUrl: "/uploads/summer-sale.jpg",
        isActive: true,
        isHomeHeader: true,
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
      });
      console.log("Sample offer added");
    } else {
      console.log(`${existingOffers.length} offers already exist in database`);
    }

    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Error setting up database:", error);
  } finally {
    process.exit(0);
  }
}

setupDatabase();