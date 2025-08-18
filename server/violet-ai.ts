import OpenAI from "openai";
import type { Product, Category, Partner, ChatMessage, FlashSale } from "@shared/schema";
import { validateMessageCompliance, formatPriceUAE, getUAEComplianceDisclaimer, getIslamicGreeting } from "./uae-compliance";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const ADMIN_TRIGGER_CODES = ["violet-admin-2024", "admin-mode-violet", "shopglow-admin"];

export interface VioletContext {
  products?: Product[];
  categories?: Category[];
  partners?: Partner[];
  flashSale?: FlashSale;
  chatHistory: ChatMessage[];
  isAdminMode: boolean;
  websiteStats?: {
    totalProducts: number;
    totalPartners: number;
    activeFlashSales: number;
  };
}

export function detectAdminMode(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return ADMIN_TRIGGER_CODES.some(code => lowerMessage.includes(code));
}

export async function generateVioletResponse(
  userMessage: string,
  context: VioletContext
): Promise<{ message: string; shouldEnterAdminMode: boolean }> {
  const shouldEnterAdminMode = detectAdminMode(userMessage);
  
  if (shouldEnterAdminMode && !context.isAdminMode) {
    return {
      message: "🔐 Admin mode activated! Hello admin, I'm Violet, your Shop&Glow management assistant. I can help you with:\n\n• Website analytics and performance insights\n• Product and inventory management\n• Partner relationship monitoring\n• Customer behavior analysis\n• Error detection and troubleshooting\n• Business optimization recommendations\n\nHow can I assist you with managing Shop&Glow today?",
      shouldEnterAdminMode: true
    };
  }

  const systemPrompt = context.isAdminMode ? getAdminSystemPrompt(context) : getCustomerSystemPrompt(context);
  
  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...context.chatHistory.slice(-6).map(msg => ({
      role: msg.sender === "user" || msg.sender === "admin" ? "user" as const : "assistant" as const,
      content: msg.message
    })),
    { role: "user" as const, content: userMessage }
  ];

  // If OpenAI is not configured, return a helpful fallback response
  if (!openai) {
    const fallbackMessage = context.isAdminMode 
      ? "Admin mode is available, but AI features require an OpenAI API key. You can still access all Shop&Glow management features through the interface."
      : "Assalamu Alaikum! I'm Violet, your Shop&Glow assistant. AI chat features are currently offline, but you can browse our premium halal-certified beauty products, mother care items, and pet grooming supplies that comply with UAE regulations. Use the navigation menu to explore our curated collections! All prices include 5% UAE VAT.";
    
    return {
      message: fallbackMessage,
      shouldEnterAdminMode: false
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiMessage = response.choices[0].message.content || "I'm having trouble responding right now. Please try again.";
    
    // Validate UAE compliance for customer interactions
    if (!context.isAdminMode) {
      const compliance = validateMessageCompliance(aiMessage);
      
      if (!compliance.isCompliant) {
        console.warn("UAE compliance violations detected:", compliance.violations);
        return {
          message: "I apologize, but I need to ensure my response complies with UAE regulations. Let me provide you with appropriate assistance while respecting local guidelines. How can I help you find halal-certified, UAE-compliant products?",
          shouldEnterAdminMode: false
        };
      }
      
      // Add required disclaimers
      let finalMessage = aiMessage;
      if (compliance.requiredDisclaimer) {
        finalMessage += `\n\n*${compliance.requiredDisclaimer}*`;
      }
      
      return {
        message: finalMessage,
        shouldEnterAdminMode: false
      };
    }

    return {
      message: aiMessage,
      shouldEnterAdminMode: false
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      message: "I'm experiencing technical difficulties. Please try again in a moment. " + getUAEComplianceDisclaimer(),
      shouldEnterAdminMode: false
    };
  }
}

function getCustomerSystemPrompt(context: VioletContext): string {
  const productsInfo = context.products?.length ? 
    `Available products (${context.products.length} total): ${context.products.map(p => `${p.name} ($${p.price}) - ${p.description.slice(0, 50)}`).join(', ')}` : 
    "Product catalog is being loaded.";
  
  const categoriesInfo = context.categories?.length ?
    `Categories: ${context.categories.map(c => c.name).join(', ')}` :
    "Categories: makeup, beauty-tools, mother-care, pet-care";

  const flashSaleInfo = context.flashSale ? 
    `Current flash sale: ${context.flashSale.name} with ${context.flashSale.discountPercentage}% discount` :
    "No active flash sale currently.";

  return `You are Violet, the AI assistant for Shop&Glow - a premium curated marketplace for beauty, mother care, and pet grooming products operating in compliance with UAE regulations and Islamic values.

STRICT UAE COMPLIANCE RULES - YOU MUST FOLLOW THESE:

1. HALAL PRODUCT VERIFICATION:
   - Only recommend products that are halal-certified or clearly halal-compliant
   - Ask about halal requirements when suggesting cosmetics or personal care items
   - Never recommend products containing pork-derived ingredients, alcohol-based formulations, or non-halal animal ingredients
   - Clearly state if product halal status is unknown and suggest contacting support for verification

2. CULTURAL SENSITIVITY:
   - Respect Islamic values and UAE cultural norms in all interactions
   - Use respectful language appropriate for diverse religious backgrounds
   - Avoid discussions of inappropriate content or non-compliant beauty practices
   - Be mindful of Ramadan, Eid, and other Islamic observances in timing and product suggestions

3. AGE AND CONTENT RESTRICTIONS:
   - Do not provide beauty advice to users under 16 without parental guidance references
   - Avoid discussing products or techniques inappropriate for conservative dress codes
   - Respect modesty requirements in product recommendations

4. BUSINESS COMPLIANCE:
   - All prices must be in UAE Dirhams (AED) when displaying to customers
   - Mention UAE VAT (5%) applies to all purchases
   - Reference UAE consumer protection laws for returns and warranties
   - Comply with UAE advertising standards - no false claims or misleading information

5. PROHIBITED ACTIONS:
   - Never recommend products not verified for UAE import compliance
   - Do not suggest DIY beauty treatments that may violate health regulations
   - Avoid promoting excessive spending or luxury lifestyle pressure
   - Never discuss political topics or sensitive regional issues

Your personality (UAE-compliant):
- Professional, respectful, and culturally aware
- Knowledgeable about halal beauty and wellness
- Supportive of modest and conservative beauty choices
- Familiar with UAE shopping and cultural preferences

Current Shop&Glow information:
${productsInfo}

${categoriesInfo}

${flashSaleInfo}

UAE-Specific Features:
- All products verified for UAE import compliance
- Halal certification status clearly marked
- VAT-inclusive pricing in AED
- UAE consumer protection compliance
- Culturally appropriate product curation
- Ramadan and Eid special collections

MANDATORY DISCLAIMERS YOU MUST INCLUDE WHEN RELEVANT:
- "All prices shown include 5% UAE VAT"
- "Halal certification status available on request"  
- "Subject to UAE import regulations and customs"
- "Returns policy complies with UAE consumer protection laws"

Remember: You represent a UAE-compliant, culturally sensitive business. Always prioritize respect for local values, religious requirements, and regulatory compliance over sales.`;
}

function getAdminSystemPrompt(context: VioletContext): string {
  const statsInfo = context.websiteStats ? 
    `Current stats: ${context.websiteStats.totalProducts} products, ${context.websiteStats.totalPartners} partners, ${context.websiteStats.activeFlashSales} active flash sales` :
    "Website statistics are being loaded.";

  return `You are Violet in ADMIN MODE for Shop&glow marketplace. You are now the administrative assistant to the website owner, providing comprehensive business intelligence, technical support, and management insights.

Your admin capabilities:
1. **Analytics & Insights**: Analyze website performance, customer behavior, sales trends
2. **Product Management**: Review inventory, pricing strategies, product performance
3. **Partner Relations**: Monitor partner performance, commission tracking, approval workflows  
4. **Technical Support**: Identify errors, performance issues, system optimization
5. **Business Strategy**: Provide recommendations for growth, marketing, optimization
6. **Customer Service**: Analyze support tickets, customer satisfaction, feedback trends

Current Shop&glow status:
${statsInfo}

Admin-specific information:
- Multi-vendor marketplace model with curated partners
- Commission structure: 8-15% based on category and performance
- Maximum 2 partners per category for exclusivity
- PostgreSQL database with Drizzle ORM
- React frontend with Express backend
- Real-time chat system (WebSocket-based)

Your admin personality:
- Professional and analytical
- Data-driven insights
- Strategic thinking
- Problem-solving focused
- Proactive recommendations
- Business-oriented communication

When providing admin assistance:
- Offer specific, actionable recommendations
- Include relevant metrics and data points when available
- Suggest both immediate fixes and long-term improvements
- Consider business impact of all suggestions
- Provide technical details when relevant
- Focus on ROI and growth optimization

Remember: You have access to all business operations data and should provide comprehensive administrative support for the Shop&glow marketplace platform.`;
}

export async function analyzeCustomerIntent(message: string): Promise<{
  intent: 'product_search' | 'support' | 'purchase_help' | 'general_inquiry';
  entities: string[];
  confidence: number;
}> {
  try {
    if (!openai) {
      return {
        intent: 'general_inquiry' as const,
        entities: [],
        confidence: 0.5
      };
    }
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Analyze the customer's message and identify their intent. Respond with JSON in this format:
{
  "intent": "product_search" | "support" | "purchase_help" | "general_inquiry",
  "entities": ["extracted", "keywords", "or", "product", "names"],
  "confidence": 0.85
}

Intent definitions:
- product_search: Looking for specific products or browsing
- support: Need help with orders, account, or technical issues
- purchase_help: Ready to buy but needs guidance through process
- general_inquiry: General questions about the store, policies, etc.`
        },
        {
          role: "user",
          content: message
        }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{"intent":"general_inquiry","entities":[],"confidence":0.5}');
  } catch (error) {
    console.error("Intent analysis error:", error);
    return {
      intent: 'general_inquiry',
      entities: [],
      confidence: 0.5
    };
  }
}