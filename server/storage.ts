import { type User, type InsertUser, type Partner, type InsertPartner, type Category, type Product, type InsertProduct, type Order, type InsertOrder, type OrderItem, type Dispute, type FlashSale, type Newsletter, type InsertNewsletter, type ChatSession, type InsertChatSession, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Partners
  getPartner(id: string): Promise<Partner | undefined>;
  getPartnersByCategory(category: string): Promise<Partner[]>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  approvePartner(id: string): Promise<Partner | undefined>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  
  // Products
  getProducts(limit?: number, category?: string, featured?: boolean): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByPartner(partnerId: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Orders
  getOrder(id: string): Promise<Order | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  // Newsletter
  subscribeNewsletter(email: InsertNewsletter): Promise<Newsletter>;
  
  // Flash Sales
  getActiveFlashSale(): Promise<FlashSale | undefined>;
  
  // Chat
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSession(sessionId: string): Promise<ChatSession | undefined>;
  updateChatSessionAdminMode(sessionId: string, isAdminMode: boolean): Promise<void>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(sessionId: string, limit?: number): Promise<ChatMessage[]>;
  updateChatSessionActivity(sessionId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private partners: Map<string, Partner> = new Map();
  private categories: Map<string, Category> = new Map();
  private products: Map<string, Product> = new Map();
  private orders: Map<string, Order> = new Map();
  private newsletter: Map<string, Newsletter> = new Map();
  private flashSales: Map<string, FlashSale> = new Map();
  private chatSessions: Map<string, ChatSession> = new Map();
  private chatMessages: Map<string, ChatMessage> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize categories
    const categories = [
      {
        id: randomUUID(),
        name: "Makeup",
        slug: "makeup",
        description: "Premium makeup collections featuring innovative formulas and stunning color payoff",
        imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        maxPartners: 2,
        currentPartners: 0,
      },
      {
        id: randomUUID(),
        name: "Beauty Tools",
        slug: "beauty-tools",
        description: "Professional-grade brushes and tools trusted by makeup artists worldwide",
        imageUrl: "https://images.unsplash.com/photo-1573461160327-b450ce3d8e7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        maxPartners: 2,
        currentPartners: 0,
      },
      {
        id: randomUUID(),
        name: "Mother Care",
        slug: "mother-care",
        description: "Gentle, natural skincare products designed for expecting and new mothers",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        maxPartners: 2,
        currentPartners: 0,
      },
      {
        id: randomUUID(),
        name: "Pet Care",
        slug: "pet-care",
        description: "Luxury grooming products that keep your pets looking and feeling their best",
        imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        maxPartners: 2,
        currentPartners: 0,
      },
    ];

    categories.forEach(category => this.categories.set(category.id, category));

    // Initialize flash sale
    const flashSale: FlashSale = {
      id: randomUUID(),
      name: "Sitewide Flash Sale",
      discountPercentage: "30.00",
      startTime: new Date(Date.now() - 86400000), // Started yesterday
      endTime: new Date(Date.now() + 172800000), // Ends in 2 days
      active: true,
      createdAt: new Date(),
    };
    this.flashSales.set(flashSale.id, flashSale);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      isPartner: false,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async getPartner(id: string): Promise<Partner | undefined> {
    return this.partners.get(id);
  }

  async getPartnersByCategory(category: string): Promise<Partner[]> {
    return Array.from(this.partners.values()).filter(partner => 
      partner.category === category && partner.status === "approved"
    );
  }

  async createPartner(insertPartner: InsertPartner): Promise<Partner> {
    const id = randomUUID();
    const partner: Partner = { 
      ...insertPartner, 
      id, 
      website: insertPartner.website || null,
      status: "pending",
      creditCardOnFile: false,
      approvedAt: null,
      createdAt: new Date() 
    };
    this.partners.set(id, partner);
    return partner;
  }

  async approvePartner(id: string): Promise<Partner | undefined> {
    const partner = this.partners.get(id);
    if (!partner) return undefined;
    
    const approvedPartner = { 
      ...partner, 
      status: "approved" as const, 
      approvedAt: new Date() 
    };
    this.partners.set(id, approvedPartner);
    return approvedPartner;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async getProducts(limit = 20, category?: string, featured?: boolean): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    if (category) {
      const cat = await this.getCategoryBySlug(category);
      if (cat) {
        products = products.filter(p => p.categoryId === cat.id);
      }
    }
    
    if (featured !== undefined) {
      products = products.filter(p => p.featured === featured);
    }
    
    return products.slice(0, limit);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByPartner(partnerId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.partnerId === partnerId);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      featured: insertProduct.featured || null,
      salePrice: insertProduct.salePrice || null,
      galleryUrls: insertProduct.galleryUrls || null,
      inStock: insertProduct.inStock !== undefined ? insertProduct.inStock : null,
      rating: "0.00",
      reviewCount: 0,
      createdAt: new Date() 
    };
    this.products.set(id, product);
    return product;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id, 
      status: "pending",
      deliveryConfirmed: false,
      deliveryConfirmedAt: null,
      autoApprovedAt: null,
      createdAt: new Date() 
    };
    this.orders.set(id, order);
    return order;
  }

  async subscribeNewsletter(insertNewsletter: InsertNewsletter): Promise<Newsletter> {
    const id = randomUUID();
    const subscription: Newsletter = { 
      ...insertNewsletter, 
      id, 
      subscribedAt: new Date(),
      active: true 
    };
    this.newsletter.set(id, subscription);
    return subscription;
  }

  async getActiveFlashSale(): Promise<FlashSale | undefined> {
    const now = new Date();
    return Array.from(this.flashSales.values()).find(sale => 
      sale.active && sale.startTime <= now && sale.endTime >= now
    );
  }

  // Chat methods
  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = randomUUID();
    const session: ChatSession = {
      ...insertSession,
      id,
      userId: insertSession.userId || null,
      isAdminMode: insertSession.isAdminMode || false,
      createdAt: new Date(),
      lastActivityAt: new Date()
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async getChatSession(sessionId: string): Promise<ChatSession | undefined> {
    return Array.from(this.chatSessions.values()).find(session => session.sessionId === sessionId);
  }

  async updateChatSessionAdminMode(sessionId: string, isAdminMode: boolean): Promise<void> {
    const session = await this.getChatSession(sessionId);
    if (session) {
      session.isAdminMode = isAdminMode;
      session.lastActivityAt = new Date();
      this.chatSessions.set(session.id, session);
    }
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      messageType: insertMessage.messageType || 'text',
      metadata: insertMessage.metadata || null,
      createdAt: new Date()
    };
    this.chatMessages.set(id, message);
    
    // Update session activity
    await this.updateChatSessionActivity(insertMessage.sessionId);
    
    return message;
  }

  async getChatMessages(sessionId: string, limit: number = 50): Promise<ChatMessage[]> {
    const messages = Array.from(this.chatMessages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => (a.createdAt || new Date()).getTime() - (b.createdAt || new Date()).getTime());
    
    return limit > 0 ? messages.slice(-limit) : messages;
  }

  async updateChatSessionActivity(sessionId: string): Promise<void> {
    const session = await this.getChatSession(sessionId);
    if (session) {
      session.lastActivityAt = new Date();
      this.chatSessions.set(session.id, session);
    }
  }
}

export const storage = new MemStorage();
