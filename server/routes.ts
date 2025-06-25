import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { 
  insertProductSchema, 
  insertOfferSchema, 
  insertMediaSchema, 
  insertContactSchema 
} from "@shared/schema";
import { ZodError } from "zod";

// Configure multer for file uploads
const generateUniqueFilename = (originalname: string) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(originalname);
  return `${timestamp}-${randomString}${extension}`;
};

const storage_engine = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, generateUniqueFilename(file.originalname));
  }
});

const upload = multer({ storage: storage_engine });

// Helper for zod validation
const validateRequest = (schema: any, body: any) => {
  try {
    return { success: true, data: schema.parse(body) };
  } catch (error) {
    if (error instanceof ZodError) {
      return { 
        success: false, 
        error: error.errors.map(e => `${e.path}: ${e.message}`).join(', ')
      };
    }
    return { success: false, error: 'Invalid request data' };
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Middleware to check if user is authenticated
  const ensureAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // API Routes
  // Products API
  app.get('/api/products', async (req, res) => {
    try {
      const category = req.query.category as string;
      const featured = req.query.featured === 'true';
      
      let products;
      if (category) {
        products = await storage.getProductsByCategory(category);
      } else if (featured) {
        products = await storage.getFeaturedProducts();
      } else {
        products = await storage.getAllProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post('/api/products', ensureAuthenticated, async (req, res) => {
    try {
      const validation = validateRequest(insertProductSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error });
      }
      
      const product = await storage.createProduct(validation.data);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put('/api/products/:id', ensureAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const validation = validateRequest(insertProductSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error });
      }
      
      const product = await storage.updateProduct(id, validation.data);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete('/api/products/:id', ensureAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      console.log(`Received DELETE request for product ID: ${id}`);
      
      // First check if the product exists
      const product = await storage.getProduct(id);
      if (!product) {
        console.log(`Product with ID ${id} not found when trying to delete.`);
        return res.status(404).json({ message: "Product not found" });
      }
      
      console.log(`Found product to delete:`, product);
      
      // Attempt to delete - force numeric ID conversion
      const numericId = Number(id);
      const deleted = await storage.deleteProduct(numericId);
      console.log(`Delete result for product ${numericId}: ${deleted}`);
      
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete product" });
      }
      
      // Double check that the product is actually gone
      const checkDeleted = await storage.getProduct(numericId);
      console.log(`After deletion, product ${numericId} exists:`, !!checkDeleted);
      
      res.status(200).json({ message: "Product deleted successfully", success: true });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Offers API
  app.get('/api/offers', async (req, res) => {
    try {
      const offers = await storage.getAllOffers();
      res.json(offers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch offers" });
    }
  });

  app.post('/api/offers', ensureAuthenticated, async (req, res) => {
    try {
      const validation = validateRequest(insertOfferSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error });
      }
      
      const offer = await storage.createOffer(validation.data);
      res.status(201).json(offer);
    } catch (error) {
      res.status(500).json({ message: "Failed to create offer" });
    }
  });

  app.put('/api/offers/:id', ensureAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid offer ID" });
      }
      
      const validation = validateRequest(insertOfferSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error });
      }
      
      const offer = await storage.updateOffer(id, validation.data);
      if (!offer) {
        return res.status(404).json({ message: "Offer not found" });
      }
      
      res.json(offer);
    } catch (error) {
      res.status(500).json({ message: "Failed to update offer" });
    }
  });

  app.delete('/api/offers/:id', ensureAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid offer ID" });
      }
      
      console.log(`Received DELETE request for offer ID: ${id}`);
      
      // First check if the offer exists
      const offer = await storage.getOffer(id);
      if (!offer) {
        console.log(`Offer with ID ${id} not found when trying to delete.`);
        return res.status(404).json({ message: "Offer not found" });
      }
      
      console.log(`Found offer to delete:`, offer);
      
      // Attempt to delete - force numeric ID conversion
      const numericId = Number(id);
      const deleted = await storage.deleteOffer(numericId);
      console.log(`Delete result for offer ${numericId}: ${deleted}`);
      
      if (!deleted) {
        return res.status(500).json({ message: "Failed to delete offer" });
      }
      
      // Double check that the offer is actually gone
      const checkDeleted = await storage.getOffer(numericId);
      console.log(`After deletion, offer ${numericId} exists:`, !!checkDeleted);
      
      res.status(200).json({ message: "Offer deleted successfully", success: true });
    } catch (error) {
      console.error("Error deleting offer:", error);
      res.status(500).json({ message: "Failed to delete offer" });
    }
  });

  // Media API
  app.get('/api/media', async (req, res) => {
    try {
      const media = await storage.getAllMedia();
      res.json(media);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });

  // Admin Media API (for media upload form)
  app.get('/api/admin/media', ensureAuthenticated, async (req, res) => {
    try {
      const media = await storage.getAllMedia();
      res.json(media);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });

  app.post('/api/admin/media', ensureAuthenticated, async (req, res) => {
    try {
      const validation = validateRequest(insertMediaSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error });
      }
      
      const media = await storage.createMedia(validation.data);
      res.status(201).json(media);
    } catch (error) {
      res.status(500).json({ message: "Failed to create media" });
    }
  });

  app.post('/api/media', ensureAuthenticated, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const mediaData = {
        name: req.body.name || req.file.originalname,
        filename: req.file.filename,
        type: req.file.mimetype,
        url: `/uploads/${req.file.filename}`
      };
      
      const validation = validateRequest(insertMediaSchema, mediaData);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error });
      }
      
      const media = await storage.createMedia(validation.data);
      res.status(201).json(media);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload media" });
    }
  });

  app.delete('/api/media/:id', ensureAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid media ID" });
      }
      
      const media = await storage.getMedia(id);
      if (!media) {
        return res.status(404).json({ message: "Media not found" });
      }
      
      // Delete the file
      const filePath = path.resolve(process.cwd(), 'uploads', media.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      const deleted = await storage.deleteMedia(id);
      if (!deleted) {
        return res.status(404).json({ message: "Media not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete media" });
    }
  });

  // Contact Form API
  app.post('/api/contact', async (req, res) => {
    try {
      const validation = validateRequest(insertContactSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error });
      }
      
      const contact = await storage.createContact(validation.data);
      res.status(201).json(contact);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  app.get('/api/contacts', ensureAuthenticated, async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  // Categories API
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Admin stats API
  app.get('/api/admin/stats', ensureAuthenticated, async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      const offers = await storage.getAllOffers();
      const contacts = await storage.getAllContacts();
      const media = await storage.getAllMedia();
      const categories = await storage.getCategories();
      
      const stats = {
        productCount: products.length,
        categoryCount: categories.length,
        offerCount: offers.length,
        messageCount: contacts.length,
        mediaCount: media.length
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin statistics" });
    }
  });

  // Static file serving is moved to index.ts to ensure it's not overridden by Vite

  // SEO Routes - Sitemap and Robots.txt
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      const baseUrl = process.env.BASE_URL || 'https://nationalfurniture.in'; // Fall back to a default
      const currentDate = new Date().toISOString().split('T')[0];
      
      // Start sitemap XML
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
      
      // Static pages
      const staticPages = [
        { url: '/', priority: '1.0', changeFreq: 'daily' },
        { url: '/products', priority: '0.9', changeFreq: 'daily' },
        { url: '/about', priority: '0.7', changeFreq: 'weekly' },
        { url: '/contact', priority: '0.8', changeFreq: 'weekly' },
      ];
      
      // Add static pages
      staticPages.forEach(page => {
        xml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
      });
      
      // Add products pages
      products.forEach(product => {
        xml += `
  <url>
    <loc>${baseUrl}/products/${product.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });
      
      // Close sitemap
      xml += `
</urlset>`;
      
      res.setHeader('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });
  
  app.get('/robots.txt', (req, res) => {
    const baseUrl = process.env.BASE_URL || 'https://nationalfurniture.in';
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /auth
Disallow: /admin

Sitemap: ${baseUrl}/sitemap.xml
`;
    
    res.setHeader('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
