# HubTP – Materials & Equipment Management Platform

##HubTP is a Next.js 14 application for managing construction materials, products, and equipment. It provides suppliers, contractors, and project managers with real-time dashboards, analytics, and tools to streamline procurement, pricing, and project planning. Built with Supabase, HubTP ensures live updates, authentication, and structured storage for all materials and equipment data.

## Detailed Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **State Management**: React Context + Server Actions
- **Database**: Supabase PostgreSQL with Row-Level Security
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Supabase Auth with email/password and OAuth
- **Form Handling**: React Hook Form with Zod validation
- **Deployment**: Vercel with Edge Functions

## Core Features

- **Materials Dashboard**: Real-time view of supplier materials
- **Product Management**:
  - CRUD operations for products
  - Bulk import/export
  - Advanced filtering
- **API Integration**:
  - RESTful endpoints in `/app/api`
  - Type-safe database queries

## Project Structure

```
app/
├─ api/               # API routes
│  └─ products/       # Product-related endpoints
├─ dashboard/         # Main application views
├─ services/          # Business logic
components/
├─ supplier/          # Supplier UI components
│  └─ materials/      # Material-specific components
├─ supplier-materials/ # Shared components
lib/
├─ supabase.ts        # Supabase client setup
├─ utils.ts           # Utility functions
```

## Detailed Setup

1. **Environment Variables**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key # For migrations
```

2. **Database Setup**:

```bash
# Run migrations
supabase migration up
```

3. **Development Commands**:

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## API Documentation

### Products API (`/app/api/products/route.ts`) - Mock data

- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Get product details
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Remove product

## Key Components

1. **MaterialsDashboard.tsx**:

   - Main supplier view
   - Real-time data updates
   - Advanced filtering

2. **NewProductForm.tsx**:

   - Form validation with Zod
   - Image upload support
   - Auto-suggest fields

3. **ProductsOverview.tsx**:
   - Paginated product list
   - Bulk actions
   - Export functionality

## Deployment Notes

1. **Vercel Configuration**:

   - Enable Edge Functions
   - Set up production database connection
   - Configure environment variables

2. **CI/CD Pipeline**:
   - Automatic builds on push
   - Preview deployments for PRs
   - Production deployment from main branch

## Getting Help

For support, contact: [contact@elaris-soliution.com](mailto:contact@elaris-soliution.com)
