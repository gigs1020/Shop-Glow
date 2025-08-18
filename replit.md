# Overview

Shop&Glow is a curated marketplace for premium beauty, mother care, and pet grooming products. It's a full-stack e-commerce platform built with React frontend and Express backend, designed as a multi-vendor marketplace where partners can sell their products through the platform. The application features a modern design system with purple/emerald branding, product catalogs, partner management, and promotional features like flash sales.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client-side is built with **React 18** using functional components and modern patterns:

- **Routing**: Uses Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Comprehensive design system built on Radix UI primitives with shadcn/ui styling
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build System**: Vite for fast development and optimized builds

The design system uses a purple/emerald color scheme with custom CSS variables for consistent theming. Components follow atomic design principles with reusable UI primitives in the `/components/ui` directory.

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

## Build and Development

- **Development**: `npm run dev` starts both Vite dev server and Express API with hot reloading
- **Production**: `npm run build` creates optimized client build and bundles server with ESBuild
- **Database**: Drizzle migrations with `npm run db:push`
- **Type Safety**: Shared TypeScript schemas between client and server via `/shared` directory