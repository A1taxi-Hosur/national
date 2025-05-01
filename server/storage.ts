import { 
  type User, 
  type InsertUser, 
  type Product, 
  type InsertProduct, 
  type Offer, 
  type InsertOffer, 
  type Media, 
  type InsertMedia, 
  type Contact, 
  type InsertContact 
} from "@shared/schema";

import session from "express-session";
import createMemoryStore from "memorystore";

// Create memory store
const MemoryStore = createMemoryStore(session);

// Define the storage interface with all necessary methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Offer methods
  getAllOffers(): Promise<Offer[]>;
  getOffer(id: number): Promise<Offer | undefined>;
  createOffer(offer: InsertOffer): Promise<Offer>;
  updateOffer(id: number, offer: InsertOffer): Promise<Offer | undefined>;
  deleteOffer(id: number): Promise<boolean>;

  // Media methods
  getAllMedia(): Promise<Media[]>;
  getMedia(id: number): Promise<Media | undefined>;
  createMedia(media: InsertMedia): Promise<Media>;
  deleteMedia(id: number): Promise<boolean>;

  // Contact methods
  getAllContacts(): Promise<Contact[]>;
  getContact(id: number): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;

  // Category methods
  getCategories(): Promise<string[]>;

  // Session store
  sessionStore: session.Store;
}

// Memory Storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private offers: Map<number, Offer>;
  private media: Map<number, Media>;
  private contacts: Map<number, Contact>;
  sessionStore: session.Store;

  private userIdCounter: number;
  private productIdCounter: number;
  private offerIdCounter: number;
  private mediaIdCounter: number; 
  private contactIdCounter: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.offers = new Map();
    this.media = new Map();
    this.contacts = new Map();
    
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.offerIdCounter = 1;
    this.mediaIdCounter = 1;
    this.contactIdCounter = 1;

    // Initialize session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });

    // Create initial admin user with plain password (will be used directly)
    this.createUser({
      username: "admin",
      password: "password", // Direct password
    }).then(user => {
      // Update user to be admin
      const adminUser = { ...user, isAdmin: true };
      this.users.set(user.id, adminUser);
    });

    // Add some sample products
    this.createInitialData();
  }

  private async createInitialData() {
    // Sample categories
    const categories = ['Living Room', 'Bedroom', 'Dining', 'Office', 'Decor & Interior', 'Hotel Furniture'];
    
    // Sample products
    const sampleProducts: InsertProduct[] = [
      {
        name: "Modern Velvet Sofa",
        description: "Elegant and comfortable velvet sofa perfect for your living room.",
        imageUrl: "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?auto=format&fit=crop&q=80&w=900",
        category: "Living Room",
        price: 42999,
        isNew: true,
        isFeatured: true,
        status: "active"
      },
      {
        name: "Wooden Dining Table",
        description: "Sturdy wooden dining table that comfortably seats 6 people.",
        imageUrl: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=900",
        category: "Dining",
        price: 36999,
        discountedPrice: 45999,
        isFeatured: true,
        status: "active"
      },
      {
        name: "King Size Bed Frame",
        description: "Elegant king size bed frame with built-in storage.",
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800",
        category: "Bedroom",
        price: 58999,
        isFeatured: true,
        status: "active"
      },
      {
        name: "Ergonomic Office Desk",
        description: "Height-adjustable office desk for maximum comfort.",
        imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=900",
        category: "Office",
        price: 24999,
        isFeatured: true,
        status: "active"
      },
      {
        name: "L-Shaped Sectional Sofa",
        description: "Versatile L-shaped sectional sofa with chaise lounge.",
        imageUrl: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=700",
        category: "Living Room",
        price: 65999,
        status: "active"
      },
      {
        name: "Round Coffee Table",
        description: "Modern round coffee table with marble top.",
        imageUrl: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&q=80&w=800",
        category: "Living Room",
        price: 18999,
        status: "active"
      },
      {
        name: "Elegant Wall Art",
        description: "Contemporary wall art piece to enhance your interior design.",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=900",
        category: "Decor & Interior",
        price: 12499,
        isFeatured: true,
        status: "active"
      },
      {
        name: "Luxury Hotel Bed Set",
        description: "Complete bed set with premium linens designed for hotel standards.",
        imageUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=900",
        category: "Hotel Furniture",
        price: 89999,
        isFeatured: true,
        status: "active"
      },
      {
        name: "Hotel Reception Desk",
        description: "Modern reception counter with built-in storage and cable management.",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=900",
        category: "Hotel Furniture",
        price: 124999,
        status: "active"
      },
      {
        name: "Hotel Lobby Sofa",
        description: "Elegant and durable lobby seating solution for hospitality spaces.",
        imageUrl: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=900",
        category: "Hotel Furniture",
        price: 78500,
        status: "active"
      }
    ];

    for (const product of sampleProducts) {
      await this.createProduct(product);
    }

    // Sample offers
    const sampleOffers: InsertOffer[] = [
      {
        title: "Summer Sale",
        description: "25% off on selected items",
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=900",
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isActive: true,
        isHomeHeader: true
      },
      {
        title: "Diwali Special",
        description: "Free delivery on orders above ₹25,000",
        imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=900",
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        isActive: true,
        isHomeHeader: false
      }
    ];

    for (const offer of sampleOffers) {
      await this.createOffer(offer);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id, 
      isAdmin: false 
    };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.isFeatured
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const now = new Date();
    const newProduct: Product = {
      id,
      name: product.name,
      description: product.description,
      category: product.category,
      imageUrl: product.imageUrl,
      price: product.price,
      discountedPrice: product.discountedPrice || null,
      isNew: product.isNew || null,
      isFeatured: product.isFeatured || null,
      status: product.status || null,
      createdAt: now
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: InsertProduct): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      return undefined;
    }

    const updatedProduct: Product = {
      id,
      name: product.name || existingProduct.name,
      description: product.description || existingProduct.description,
      category: product.category || existingProduct.category,
      imageUrl: product.imageUrl || existingProduct.imageUrl,
      price: product.price || existingProduct.price,
      discountedPrice: product.discountedPrice || existingProduct.discountedPrice,
      isNew: product.isNew || existingProduct.isNew,
      isFeatured: product.isFeatured || existingProduct.isFeatured,
      status: product.status || existingProduct.status,
      createdAt: existingProduct.createdAt
    };
    
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    console.log(`Attempting to delete product with ID: ${id}`);
    console.log(`Current products before deletion: ${Array.from(this.products.keys()).join(', ')}`);
    console.log(`Number of products before deletion: ${this.products.size}`);
    
    // Force convert id to number
    const numericId = Number(id);
    
    // Make sure the ID exists
    if (!this.products.has(numericId)) {
      console.log(`Product ID ${numericId} not found in storage`);
      return false;
    }
    
    // Delete the product - using explicit numeric ID
    const result = this.products.delete(numericId);
    console.log(`Delete result for ID ${numericId}: ${result}`);
    console.log(`Products after deletion: ${Array.from(this.products.keys()).join(', ')}`);
    console.log(`Number of products after deletion: ${this.products.size}`);
    
    return result;
  }

  // Offer methods
  async getAllOffers(): Promise<Offer[]> {
    return Array.from(this.offers.values());
  }

  async getOffer(id: number): Promise<Offer | undefined> {
    return this.offers.get(id);
  }

  async createOffer(offer: InsertOffer): Promise<Offer> {
    const id = this.offerIdCounter++;
    const now = new Date();
    const newOffer: Offer = {
      id,
      title: offer.title,
      description: offer.description,
      imageUrl: offer.imageUrl,
      expiryDate: offer.expiryDate || null,
      isActive: offer.isActive || null,
      isHomeHeader: offer.isHomeHeader || null,
      createdAt: now
    };
    this.offers.set(id, newOffer);
    return newOffer;
  }

  async updateOffer(id: number, offer: InsertOffer): Promise<Offer | undefined> {
    const existingOffer = this.offers.get(id);
    if (!existingOffer) {
      return undefined;
    }

    const updatedOffer: Offer = {
      id,
      title: offer.title || existingOffer.title,
      description: offer.description || existingOffer.description,
      imageUrl: offer.imageUrl || existingOffer.imageUrl,
      expiryDate: offer.expiryDate || existingOffer.expiryDate,
      isActive: offer.isActive || existingOffer.isActive,
      isHomeHeader: offer.isHomeHeader || existingOffer.isHomeHeader,
      createdAt: existingOffer.createdAt
    };
    
    this.offers.set(id, updatedOffer);
    return updatedOffer;
  }

  async deleteOffer(id: number): Promise<boolean> {
    console.log(`Attempting to delete offer with ID: ${id}`);
    console.log(`Current offers before deletion: ${Array.from(this.offers.keys()).join(', ')}`);
    console.log(`Number of offers before deletion: ${this.offers.size}`);
    
    // Force convert id to number
    const numericId = Number(id);
    
    // Make sure the ID exists
    if (!this.offers.has(numericId)) {
      console.log(`Offer ID ${numericId} not found in storage`);
      return false;
    }
    
    // Delete the offer - using explicit numeric ID
    const result = this.offers.delete(numericId);
    console.log(`Delete result for ID ${numericId}: ${result}`);
    console.log(`Offers after deletion: ${Array.from(this.offers.keys()).join(', ')}`);
    console.log(`Number of offers after deletion: ${this.offers.size}`);
    
    return result;
  }

  // Media methods
  async getAllMedia(): Promise<Media[]> {
    return Array.from(this.media.values());
  }

  async getMedia(id: number): Promise<Media | undefined> {
    return this.media.get(id);
  }

  async createMedia(media: InsertMedia): Promise<Media> {
    const id = this.mediaIdCounter++;
    const now = new Date();
    const newMedia: Media = {
      ...media,
      id,
      createdAt: now
    };
    this.media.set(id, newMedia);
    return newMedia;
  }

  async deleteMedia(id: number): Promise<boolean> {
    return this.media.delete(id);
  }

  // Contact methods
  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async getContact(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const id = this.contactIdCounter++;
    const now = new Date();
    const newContact: Contact = {
      ...contact,
      id,
      createdAt: now
    };
    this.contacts.set(id, newContact);
    return newContact;
  }

  // Category methods
  async getCategories(): Promise<string[]> {
    const categories = new Set<string>();
    this.products.forEach((product) => {
      categories.add(product.category);
    });
    return Array.from(categories);
  }
}

export const storage = new MemStorage();
