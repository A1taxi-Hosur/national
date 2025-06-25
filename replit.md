# National Furniture & Interiors Website

## Project Overview
Comprehensive furniture website for "NATIONAL FURNITURE & INTERIORS" with admin functionality, Google reviews integration, and e-commerce features.

**Business Details:**
- Name: National Furniture & Interiors
- Address: 1315, 24th Main Road, Opposite Purva Fairmont Apartment, Sector - 2, HSR Layout, Bangalore - 560102
- Phone: +919663628302
- Tagline: 15+ years of Excellence

## Recent Changes
- **2025-06-25**: Fixed photo upload issue by adding missing `/api/admin/media` API routes
- **2025-06-25**: Updated address throughout the application to new location
- **2025-06-25**: Enhanced SEO with complete metadata, sitemap generation, and structured data
- **2025-06-25**: Created media selector component for product image management
- **2025-06-25**: Improved product form with media library integration

## Project Architecture

### Backend (Node.js + Express)
- **Authentication**: Passport.js with local strategy, session-based auth
- **Database**: PostgreSQL with Drizzle ORM (falling back to MemStorage for development)
- **File Upload**: Multer for handling image uploads to `/uploads` directory
- **API Routes**: RESTful API for products, offers, media, contacts, categories

### Frontend (React + Vite)
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **UI Components**: Shadcn/ui with Tailwind CSS
- **Forms**: React Hook Form with Zod validation

### Key Features
1. **Admin Panel**: Full CRUD operations for products, offers, media management
2. **SEO Optimization**: Meta tags, sitemap.xml, robots.txt, structured data
3. **Media Management**: Upload, organize, and select images for products
4. **Google Integration**: Reviews display and contact information
5. **WhatsApp Integration**: Direct enquiry links for products
6. **Responsive Design**: Mobile-first approach with Tailwind CSS

### Admin Credentials
- Username: NLfurniture
- Password: 2025@NLF

## User Preferences
- Business focus: High-quality furniture with 15+ years experience
- Communication: WhatsApp integration for customer enquiries
- Design: Professional, clean, furniture-focused aesthetic
- SEO: Strong emphasis on search engine optimization
- Media: Emphasis on high-quality product photography

## Current Issues Resolved
- ✅ Photo upload functionality in admin panel
- ✅ Image display on main website from uploaded media
- ✅ Address updates across all pages
- ✅ SEO implementation with structured data
- ✅ Media selector integration in product forms

## Technical Implementation Notes
- Using DatabaseStorage for persistent data when database is available
- Fallback to MemStorage for development/testing
- Media files served from `/uploads` directory with proper static file serving
- Admin routes protected with authentication middleware
- All forms use Zod validation schemas from shared schema file