import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage, type IStorage } from "./storage";
import { insertUserSchema, insertPartnerSchema, insertProductSchema, insertNewsletterSchema, insertChatSessionSchema, insertChatMessageSchema, type Category } from "@shared/schema";
import { generateVioletResponse, analyzeCustomerIntent, type VioletContext } from "./violet-ai";
import { randomUUID } from "crypto";

// Helper function to dynamically count partners across all categories
async function getTotalPartnersCount(storage: IStorage, categories: Category[]): Promise<number> {
  let total = 0;
  for (const category of categories) {
    const partners = await storage.getPartnersByCategory(category.id);
    total += partners.length;
  }
  return total;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching categories: " + error.message });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching category: " + error.message });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { limit, category, featured } = req.query;
      const products = await storage.getProducts(
        limit ? parseInt(limit as string) : undefined,
        category as string,
        featured ? featured === "true" : undefined
      );
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching products: " + error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product: " + error.message });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating product: " + error.message });
    }
  });

  // Partners
  app.get("/api/partners", async (req, res) => {
    try {
      const { category } = req.query;
      if (category) {
        const partners = await storage.getPartnersByCategory(category as string);
        res.json(partners);
      } else {
        res.status(400).json({ message: "Category parameter required" });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching partners: " + error.message });
    }
  });

  app.post("/api/partners", async (req, res) => {
    try {
      const partnerData = insertPartnerSchema.parse(req.body);
      const partner = await storage.createPartner(partnerData);
      res.status(201).json(partner);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating partner application: " + error.message });
    }
  });

  // Flash Sales
  app.get("/api/flash-sale", async (req, res) => {
    try {
      const flashSale = await storage.getActiveFlashSale();
      res.json(flashSale);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching flash sale: " + error.message });
    }
  });

  // Newsletter
  app.post("/api/newsletter", async (req, res) => {
    try {
      const newsletterData = insertNewsletterSchema.parse(req.body);
      const subscription = await storage.subscribeNewsletter(newsletterData);
      res.status(201).json({ message: "Successfully subscribed to newsletter", subscription });
    } catch (error: any) {
      res.status(400).json({ message: "Error subscribing to newsletter: " + error.message });
    }
  });

  // Users
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating user: " + error.message });
    }
  });

  // Chat API routes
  app.post("/api/chat/session", async (req, res) => {
    try {
      const sessionId = randomUUID();
      const sessionData = insertChatSessionSchema.parse({
        sessionId,
        isAdminMode: false,
        userId: req.body.userId || null
      });
      const session = await storage.createChatSession(sessionData);
      res.status(201).json(session);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating chat session: " + error.message });
    }
  });

  app.get("/api/chat/messages/:sessionId", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(req.params.sessionId, 50);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching messages: " + error.message });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    let currentSessionId: string | null = null;
    
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'join':
            if (typeof message.sessionId === 'string') {
              currentSessionId = message.sessionId;
              ws.send(JSON.stringify({
                type: 'joined',
                sessionId: currentSessionId
              }));
            } else {
              ws.send(JSON.stringify({ type: 'error', message: 'Invalid session ID' }));
            }
            break;
            
          case 'message':
            if (!currentSessionId) {
              ws.send(JSON.stringify({ type: 'error', message: 'No active session' }));
              return;
            }

            // Save user message
            const userMessage = await storage.createChatMessage({
              sessionId: currentSessionId,
              sender: 'user',
              message: message.content,
              messageType: 'text'
            });

            // Get current session and context
            const session = await storage.getChatSession(currentSessionId);
            const chatHistory = await storage.getChatMessages(currentSessionId, 10);
            const products = await storage.getProducts(20);
            const categories = await storage.getCategories();
            const flashSale = await storage.getActiveFlashSale();

            const context: VioletContext = {
              products,
              categories,
              flashSale: flashSale || undefined,
              chatHistory: chatHistory.slice(0, -1), // Exclude the current message
              isAdminMode: session?.isAdminMode || false,
              websiteStats: {
                totalProducts: products.length,
                totalPartners: await getTotalPartnersCount(storage, categories),
                activeFlashSales: flashSale ? 1 : 0
              }
            };

            // Generate Violet's response
            const response = await generateVioletResponse(message.content, context);
            
            // Update admin mode if needed
            if (response.shouldEnterAdminMode && session) {
              await storage.updateChatSessionAdminMode(currentSessionId, true);
            }

            // Save Violet's response
            const violetMessage = await storage.createChatMessage({
              sessionId: currentSessionId,
              sender: 'violet',
              message: response.message,
              messageType: 'text'
            });

            // Send messages back to client
            ws.send(JSON.stringify({
              type: 'message',
              message: userMessage
            }));
            
            ws.send(JSON.stringify({
              type: 'message', 
              message: violetMessage
            }));

            // If admin mode was activated, send notification
            if (response.shouldEnterAdminMode) {
              ws.send(JSON.stringify({
                type: 'admin_mode_activated',
                sessionId: currentSessionId
              }));
            }
            break;
            
          default:
            ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
        }
      } catch (error) {
        console.error('WebSocket error:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Server error' }));
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      message: 'Connected to Violet AI Chat'
    }));
  });

  return httpServer;
}
