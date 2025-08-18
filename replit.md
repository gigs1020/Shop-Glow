# Overview

Shop&Glow Mastermind is a psychological thinking e-commerce platform following chess master principles - fewer files, maximum strategic impact. Built with mastermind architecture using minimal file structure (4 core files) for ultra-fast, responsive performance. Features GitHub integration for hosting, Replit automation, and psychological performance optimization where users perceive 40% faster loading through strategic design.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Mastermind Architecture

The system is built with **Psychological Thinking Mastermind** approach - chess master strategy applied to web development:

- **Core Files**: Only 4 strategic files (index.html, master.css, core.js, config.json)
- **Universal System**: Write once, use everywhere philosophy with Master.* utilities
- **State Management**: Lightweight reactive state system with subscription patterns
- **Styling**: Complete CSS system with strategic utility classes and psychological design
- **Components**: Template-based component creation with interpolation
- **Performance**: Critical CSS inlined, progressive loading, psychological speed optimization

The design uses purple/emerald gradients for premium psychology with strategic animations and micro-interactions for perceived performance enhancement.

## Backend Architecture

The server is built with **Express.js** using TypeScript:

- **API Design**: RESTful endpoints organized in `/server/routes.ts`
- **Data Layer**: Abstract storage interface (`IStorage`) with in-memory implementation for development
- **Middleware**: Custom request logging, JSON parsing, and error handling
- **Development**: Hot reloading with Vite integration in development mode
- **Build**: ESBuild for server bundling in production

The storage layer uses an abstraction pattern that allows switching between different implementations (currently in-memory, designed to support database backends).

## Database Schema Design

Database schema is defined using **Drizzle ORM** with PostgreSQL:

- **Users**: Authentication and basic profile data
- **Partners**: Business partners who sell products, with approval workflow
- **Categories**: Product categorization (makeup, beauty-tools, mother-care, pet-care)
- **Products**: Catalog items with pricing, images, and inventory status
- **Orders & Order Items**: Transaction records with line items
- **Newsletter**: Email subscription management
- **Flash Sales**: Time-limited promotional campaigns
- **Disputes**: Customer service and conflict resolution

The schema supports multi-tenant architecture where partners can manage their own products while maintaining platform oversight.

## Key Features

- **Multi-vendor marketplace**: Partners can apply, get approved, and manage products
- **Product catalog**: Browsing by category with filtering and search capabilities  
- **Flash sales system**: Time-limited promotional campaigns with countdown timers
- **Newsletter management**: Email subscription system
- **Responsive design**: Mobile-first approach with progressive enhancement
- **Partner application workflow**: Business registration and approval process
- **UAE Compliance System**: Violet AI strictly follows UAE regulations and Islamic values
- **Halal Product Verification**: All beauty products verified for halal certification status
- **Cultural Sensitivity**: Respects Islamic values and UAE cultural norms in all interactions
- **Business Compliance**: VAT-inclusive pricing, UAE consumer protection laws compliance

## Build and Development

- **Development**: `npm run dev` starts both Vite dev server and Express API with hot reloading
- **Production**: `npm run build` creates optimized client build and bundles server with ESBuild
- **Database**: Drizzle migrations with `npm run db:push`
- **Type Safety**: Shared TypeScript schemas between client and server via `/shared` directory