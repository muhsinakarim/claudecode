# 🌟 Alamy Image Manager

> **A cutting-edge stock photography contributor platform combining Alamy's professional brand identity with Apple's renowned user experience design.**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.13.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

## 🚀 Live Demo

🌐 **[View Live Demo](http://localhost:3000)** (Development Server)

### Quick Navigation
- 🏠 [Homepage](http://localhost:3000) - Hero section with Alamy branding
- 📊 [Dashboard](http://localhost:3000/dashboard) - Contributor analytics
- 📁 [My Images](http://localhost:3000/dashboard/images) - Image management
- 💰 [Sales & Revenue](http://localhost:3000/dashboard/sales) - Earnings tracking
- ⚙️ [Account Settings](http://localhost:3000/dashboard/settings) - Profile management

---

## ✨ Key Features

### 🎨 **Hybrid Design System**
- **Alamy's Professional Identity**: Signature neon green (#00ff66), monochromatic palette
- **Apple's UX Excellence**: Smooth animations, intuitive interactions
- **Complete Dark Mode**: Photographer-focused interface with proper contrast

### 🔐 **Secure Authentication**
- JWT-based authentication with HTTP-only cookies
- Protected routes with automatic redirects
- Quality check onboarding flow

### 📈 **Advanced Analytics Dashboard**
- Real-time performance metrics
- Revenue tracking and forecasting
- Image performance insights
- Contributor growth tools

### 🖼️ **Intelligent Image Management**
- Drag-and-drop upload interface
- AI-powered quality assessment simulation
- Status tracking (pending, live, rejected)
- Metadata management system

### 💵 **Comprehensive Sales System**
- Transaction history with detailed breakdowns
- Commission tracking per image
- License type management (Standard, Extended)
- Revenue trend analysis

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS v4 with custom design system
- **Animations**: Framer Motion for smooth interactions
- **Icons**: Lucide React icon library

### **Backend & Database**
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with secure cookie storage
- **File Handling**: Sharp for image processing
- **API**: Next.js API routes

### **Development**
- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode
- **Hot Reload**: Turbopack for development

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd contributor-platform-claude-code
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🎨 Design System

### **Color Palette**
```css
/* Light Mode */
--background: #ffffff
--foreground: #000000
--alamy-green: #00ff66

/* Dark Mode (Primary) */
--background: #000000
--foreground: #ffffff
--card-background: #1a1a1a
--border-color: #404040
```

### **Typography**
- **Primary Font**: Noto Sans (Alamy's official font)
- **Fallback**: System fonts (-apple-system, BlinkMacSystemFont)
- **Weights**: 100-900 with italic variants

---

<div align="center">

**Built with ❤️ using Next.js 15, TypeScript, and Tailwind CSS v4**

*Combining Alamy's professional brand identity with Apple's user experience excellence*

</div>