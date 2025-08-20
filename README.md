# Alamy Image Manager - Contributor Platform

A modern, Apple-inspired image management platform where contributors can upload, manage, and sell their images on Alamy. Built with Next.js, TypeScript, and Tailwind CSS.

## 🎯 Features

### ✅ Completed Features

- **User Authentication & Registration**
  - Secure sign-up and login system
  - JWT-based authentication with HTTP-only cookies
  - Password hashing with bcrypt

- **Quality Check System**
  - AI-powered image quality assessment
  - Automated scoring based on resolution, file size, and format
  - Manual review capability for edge cases
  - Notification system for pass/fail results

- **Contributor Dashboard**
  - Overview of portfolio performance
  - Analytics: views, downloads, earnings, collections
  - Recent images overview with status tracking
  - Performance tips and suggestions

- **Bank Details Management**
  - Secure encrypted storage of payment information
  - Bank-grade security assurance UI
  - PCI DSS compliant data handling

- **Responsive Design**
  - Mobile-first approach with Tailwind CSS
  - Smooth animations using Framer Motion
  - Apple-inspired minimalistic design
  - Dark mode compatible

### 🚧 Planned Features

- **Image Upload System**
  - Drag & drop interface
  - AI-generated metadata (keywords, descriptions)
  - Bulk upload capability
  - Progress tracking

- **Sales & Revenue Tracking**
  - Detailed sales analytics
  - Revenue breakdown by image
  - Payout history and status
  - Tax document generation

- **Notification System**
  - Email notifications
  - WhatsApp integration
  - Mobile push notifications
  - Real-time updates

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Database**: SQLite (Prisma ORM)
- **Authentication**: JWT, bcrypt
- **Icons**: Lucide React
- **Image Processing**: Sharp

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. Create `.env` file:
   ```
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-jwt-key-here"
   NEXTAUTH_SECRET="your-nextauth-secret-here"
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## 📱 User Flow

1. **Registration**: Users create an account with basic information
2. **Quality Check**: Upload 1-5 sample images for AI quality assessment
3. **Bank Details**: Add encrypted payment information after approval
4. **Dashboard**: Manage portfolio, view analytics, upload new images

## 🔐 Security Features

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens stored in HTTP-only cookies
- Bank details encrypted before storage
- SQL injection protection via Prisma
- XSS protection via Next.js

## 📊 Database Schema

- **Users**: Basic profile, quality check status
- **Images**: Metadata, analytics, AI-generated tags
- **Sales**: Transaction history, payouts
- **BankDetails**: Encrypted payment information
- **Notifications**: Multi-channel messaging

## 🎨 Design Philosophy

- **Minimalism**: Clean, uncluttered interfaces
- **Performance**: Fast loading, smooth animations
- **Mobile-First**: Responsive design for all devices
- **Accessibility**: WCAG 2.1 AA compliance
- **User-Centric**: Intuitive navigation and workflows

## 📈 Development Roadmap

- [ ] Complete image upload system with AI metadata
- [ ] Implement comprehensive sales tracking
- [ ] Add real-time notifications
- [ ] Build admin dashboard for manual reviews
- [ ] Add advanced analytics and reporting
- [ ] Implement batch operations for images
- [ ] Add social features (likes, follows)
- [ ] Create mobile app with React Native

## 🤝 Contributing

This is a demonstration project showcasing modern web development practices for an image management platform. The codebase emphasizes:

- Type safety with TypeScript
- Modern React patterns
- Responsive design
- Security best practices
- Performance optimization

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
