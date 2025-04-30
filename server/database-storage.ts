import { db, pool } from "./db";
import { 
  users, products, offers, media, contacts,
  User, InsertUser, Product, InsertProduct,
  Offer, InsertOffer, Media, InsertMedia, Contact, InsertContact
} from "@shared/schema";
import { eq, desc, asc, sql } from "drizzle-orm";
import { IStorage } from "./storage";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: 'session'
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return db.select()
      .from(products)
      .where(eq(products.category, category))
      .orderBy(desc(products.createdAt));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return db.select()
      .from(products)
      .where(eq(products.isFeatured, true))
      .orderBy(desc(products.createdAt));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: InsertProduct): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    console.log(`Attempting to delete product with ID: ${id}`);
    
    // Convert to number to ensure proper comparison
    const numericId = Number(id);
    
    try {
      const result = await db
        .delete(products)
        .where(eq(products.id, numericId))
        .returning({ id: products.id });
      
      console.log(`Delete result:`, result);
      return result.length > 0;
    } catch (error) {
      console.error(`Error deleting product ${numericId}:`, error);
      return false;
    }
  }

  // Offer methods
  async getAllOffers(): Promise<Offer[]> {
    return db.select().from(offers).orderBy(desc(offers.createdAt));
  }

  async getOffer(id: number): Promise<Offer | undefined> {
    const [offer] = await db.select().from(offers).where(eq(offers.id, id));
    return offer;
  }

  async createOffer(offer: InsertOffer): Promise<Offer> {
    const [newOffer] = await db.insert(offers).values(offer).returning();
    return newOffer;
  }

  async updateOffer(id: number, offer: InsertOffer): Promise<Offer | undefined> {
    const [updatedOffer] = await db
      .update(offers)
      .set(offer)
      .where(eq(offers.id, id))
      .returning();
    return updatedOffer;
  }

  async deleteOffer(id: number): Promise<boolean> {
    console.log(`Attempting to delete offer with ID: ${id}`);
    
    // Convert to number to ensure proper comparison
    const numericId = Number(id);
    
    try {
      const result = await db
        .delete(offers)
        .where(eq(offers.id, numericId))
        .returning({ id: offers.id });
      
      console.log(`Delete result:`, result);
      return result.length > 0;
    } catch (error) {
      console.error(`Error deleting offer ${numericId}:`, error);
      return false;
    }
  }

  // Media methods
  async getAllMedia(): Promise<Media[]> {
    return db.select().from(media).orderBy(desc(media.createdAt));
  }

  async getMedia(id: number): Promise<Media | undefined> {
    const [mediaFile] = await db.select().from(media).where(eq(media.id, id));
    return mediaFile;
  }

  async createMedia(mediaFile: InsertMedia): Promise<Media> {
    const [newMedia] = await db.insert(media).values(mediaFile).returning();
    return newMedia;
  }

  async deleteMedia(id: number): Promise<boolean> {
    try {
      const result = await db
        .delete(media)
        .where(eq(media.id, id))
        .returning({ id: media.id });
      
      return result.length > 0;
    } catch (error) {
      console.error(`Error deleting media ${id}:`, error);
      return false;
    }
  }

  // Contact methods
  async getAllContacts(): Promise<Contact[]> {
    return db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getContact(id: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact;
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    return newContact;
  }

  // Category methods
  async getCategories(): Promise<string[]> {
    const result = await db
      .select({ category: products.category })
      .from(products)
      .groupBy(products.category)
      .orderBy(asc(products.category));
    
    return result.map(row => row.category);
  }
}