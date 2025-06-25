# National Furniture & Interiors - Full Stack Application

## Overview

This is a full-stack web application for National Furniture & Interiors, a furniture store based in HSR Layout, Bangalore. The application serves as both a customer-facing website and an admin management system for managing products, offers, and media content.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI components with shadcn/ui styling
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Authentication**: Passport.js with local strategy using bcrypt
- **Session Management**: Express sessions with memory store
- **File Uploads**: Multer for handling media uploads
- **API Design**: RESTful API with proper error handling

### Database & ORM
- **Database**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM with TypeScript-first approach
- **Schema**: Shared schema definitions between client and server
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### Authentication System
- Admin-only authentication using username/password
- Session-based authentication with secure cookies
- Protected routes for admin functionality
- Password hashing with bcrypt

### Product Management
- CRUD operations for furniture products
- Category-based organization
- Featured products system
- Image upload and management
- Price and discount handling

### Offer Management
- Promotional offers and deals
- Expiry date tracking
- Home header featured offers
- Active/inactive status management

### Media Management
- File upload system for images
- Media library with search functionality
- Image optimization and storage

### Contact System
- Contact form submissions
- Admin dashboard for managing inquiries

### SEO Optimization
- Meta tags and structured data
- Sitemap generation
- SEO-friendly URLs
- Google Maps integration for business location

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **API Layer**: Express.js routes handle incoming requests
3. **Authentication**: Passport.js middleware validates admin sessions
4. **Data Access**: Drizzle ORM queries PostgreSQL database
5. **Response**: JSON data returned to client with proper error handling
6. **State Management**: TanStack Query caches and synchronizes server state

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **drizzle-orm**: TypeScript ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components
- **react-hook-form**: Form handling with validation
- **zod**: Schema validation
- **passport**: Authentication middleware
- **multer**: File upload handling

### Development Tools
- **vite**: Build tool and dev server
- **typescript**: Type safety across the stack
- **tailwindcss**: Utility-first CSS framework
- **drizzle-kit**: Database migration tool

## Deployment Strategy

### Development Environment
- Replit-based development with hot reload
- PostgreSQL database provisioned automatically
- Environment variables for database connection
- Development-specific Vite plugins for debugging

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild compiles TypeScript server to `dist/index.js`
3. **Static Assets**: Served from built frontend directory
4. **Database**: Production PostgreSQL via connection string

### Production Configuration
- Node.js production server
- Static file serving for built frontend
- Environment-based configuration
- Proper error handling and logging

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 25, 2025. Initial setup