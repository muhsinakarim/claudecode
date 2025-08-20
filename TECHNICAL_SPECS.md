# 🔧 Alamy Image Manager - Technical Specifications

## System Architecture

### Frontend Architecture
```typescript
// Next.js 15 App Router Structure
src/app/
├── layout.tsx                 // Root layout with dark mode
├── page.tsx                   // Homepage with hero section
├── globals.css               // Global styles and dark mode
├── login/page.tsx            // Authentication
├── register/page.tsx         // User registration  
├── quality-check/page.tsx    // Image upload & validation
├── dashboard/
│   ├── layout.tsx            // Dashboard navigation
│   ├── page.tsx              // Analytics overview
│   ├── upload/page.tsx       // Image upload interface
│   ├── images/page.tsx       // Image management table
│   ├── sales/page.tsx        // Revenue tracking
│   └── settings/page.tsx     // Account management
└── api/
    ├── auth/
    │   ├── register/route.ts // User registration API
    │   ├── login/route.ts    // Authentication API
    │   └── logout/route.ts   // Session cleanup
    ├── quality-check/route.ts // Image processing
    └── bank-details/route.ts  // Payment info
```

### Database Schema
```prisma
// Prisma Schema (prisma/schema.prisma)
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id                    String        @id @default(cuid())
  name                  String
  email                 String        @unique
  password              String
  qualityCheckPassed    Boolean?
  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt
  images               Image[]
  sales                Sale[]
  bankDetails          BankDetails?
  notifications        Notification[]
}

model Image {
  id          String   @id @default(cuid())
  title       String
  description String?
  tags        String   // JSON array stored as string
  filename    String
  filepath    String
  filesize    Int
  dimensions  String   // "width x height"
  price       Float    @default(25.00)
  status      String   @default("pending") // pending, approved, rejected
  views       Int      @default(0)
  downloads   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  sales       Sale[]
}

model Sale {
  id          String   @id @default(cuid())
  amount      Float
  commission  Float
  licenseType String   // "standard", "extended"
  buyerEmail  String
  saleDate    DateTime @default(now())
  status      String   @default("completed") // pending, completed, refunded
  imageId     String
  image       Image    @relation(fields: [imageId], references: [id], onDelete: Cascade)
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model BankDetails {
  id                String @id @default(cuid())
  accountNumber     String
  routingNumber     String
  accountHolderName String
  bankName          String
  createdAt         DateTime @default(now())
  userId            String @unique
  user              User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Notification {
  id        String   @id @default(cuid())
  title     String
  message   String
  type      String   // "success", "info", "warning", "error"
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Design System Specifications

### Color Palette
```css
:root {
  /* Alamy dark mode - primary theme */
  --background: #000000;
  --foreground: #ffffff;
  --gray-50: #0a0a0a;
  --gray-100: #171717;
  --gray-200: #262626;
  --gray-300: #404040;
  --gray-400: #525252;
  --gray-500: #737373;
  --gray-600: #a3a3a3;
  --gray-700: #d1d1d1;
  --gray-800: #e4e4e4;
  --gray-900: #f4f4f4;
  
  /* Alamy's signature neon green */
  --alamy-green: #00ff66;
  --alamy-green-light: #33ff80;
  --alamy-green-dark: #00cc52;
  --alamy-green-hover: #00e55c;
  
  /* Accent colors for interactive elements */
  --accent-light: #1a1a1a;
  --accent-hover: #2a2a2a;
  --accent-active: #3a3a3a;
  --success: var(--alamy-green);
  --warning: #fbbf24;
  --error: #ef4444;
}
```

### Typography System
```css
/* Font Integration */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');

body {
  font-family: "Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-feature-settings: "rlig" 1, "calt" 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* Typography Scale */
.text-xs     { font-size: 0.75rem; }    /* 12px */
.text-sm     { font-size: 0.875rem; }   /* 14px */
.text-base   { font-size: 1rem; }       /* 16px */
.text-lg     { font-size: 1.125rem; }   /* 18px */
.text-xl     { font-size: 1.25rem; }    /* 20px */
.text-2xl    { font-size: 1.5rem; }     /* 24px */
.text-3xl    { font-size: 1.875rem; }   /* 30px */
.text-4xl    { font-size: 2.25rem; }    /* 36px */
.text-5xl    { font-size: 3rem; }       /* 48px */
.text-6xl    { font-size: 3.75rem; }    /* 60px */
```

### Component Library
```css
/* Button Components */
.btn-primary {
  background: #ffffff !important;
  color: #000000 !important;
  border: 1px solid #ffffff !important;
  border-radius: 0.75rem;
  padding: 0.875rem 2rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-alamy {
  background: var(--alamy-green);
  color: var(--foreground);
  border: 1px solid var(--alamy-green);
  border-radius: 0.75rem;
  padding: 0.875rem 2rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-secondary {
  background: transparent !important;
  color: #ffffff !important;
  border: 2px solid #ffffff !important;
  border-radius: 0.75rem;
  padding: 0.875rem 2rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

/* Card Components */
.card {
  background: #1a1a1a !important;
  border: 1px solid #404040 !important;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.card:hover {
  border-color: #525252 !important;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Form Components */
input, select, textarea {
  background: #2a2a2a !important;
  border: 1px solid #404040 !important;
  color: #ffffff !important;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
}

input:focus, select:focus, textarea:focus {
  border-color: #00ff66 !important;
  box-shadow: 0 0 0 3px rgba(0, 255, 102, 0.1) !important;
  outline: none;
}
```

## Animation Specifications

### Framer Motion Configurations
```typescript
// Common animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const cardHover = {
  whileHover: { scale: 1.02, y: -2 },
  transition: { type: "spring", stiffness: 300 }
}

export const buttonPress = {
  whileTap: { scale: 0.98 },
  whileHover: { scale: 1.02 }
}
```

### CSS Transitions
```css
/* Global smooth transitions */
* {
  transition: background-color 0.2s ease, 
              border-color 0.2s ease, 
              color 0.2s ease,
              box-shadow 0.2s ease, 
              transform 0.2s ease, 
              opacity 0.2s ease;
}
```

## API Specifications

### Authentication Endpoints
```typescript
// POST /api/auth/register
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    qualityCheckPassed: boolean | null;
  };
  error?: string;
}

// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    qualityCheckPassed: boolean | null;
  };
  error?: string;
}
```

### Quality Check Endpoints
```typescript
// POST /api/quality-check
interface QualityCheckRequest {
  images: File[];
}

interface QualityCheckResponse {
  success: boolean;
  message: string;
  processedImages?: {
    filename: string;
    status: 'pending' | 'approved' | 'rejected';
    feedback?: string;
  }[];
}
```

## Performance Specifications

### Bundle Analysis
```bash
# Build analysis
npm run build

# Expected metrics:
- First Load JS: < 200 KB
- Route bundles: < 50 KB each
- CSS bundle: < 20 KB
- Images optimized with Next.js Image component
```

### Loading Performance
- **Time to First Byte (TTFB)**: < 100ms
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

### Optimization Strategies
```typescript
// Image optimization
import Image from 'next/image'

// Code splitting
const DynamicComponent = dynamic(() => import('./Component'), {
  loading: () => <LoadingSpinner />
})

// Font optimization
import { Noto_Sans } from 'next/font/google'
const notoSans = Noto_Sans({ subsets: ['latin'] })
```

## Security Specifications

### Authentication Security
```typescript
// JWT token configuration
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '7d',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
}

// Password hashing
import bcrypt from 'bcryptjs'
const saltRounds = 12
const hashedPassword = await bcrypt.hash(password, saltRounds)
```

### Data Validation
```typescript
// Input validation with Zod
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
})
```

## Deployment Specifications

### Environment Configuration
```bash
# Environment variables
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secure-secret-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Production Build
```bash
# Build commands
npm run build    # Creates optimized production build
npm run start    # Starts production server
npm run lint     # Runs code quality checks

# Expected build output:
✓ Compiled successfully
- Static pages: 8
- Server pages: 12
- API routes: 6
```

### Hosting Requirements
- **Node.js**: v18.17+
- **Memory**: 512MB minimum
- **Storage**: 1GB for application + database
- **Bandwidth**: CDN recommended for images
- **Database**: SQLite for development, PostgreSQL for production

---

*This technical specification serves as a comprehensive guide for development, deployment, and maintenance of the Alamy Image Manager platform.*