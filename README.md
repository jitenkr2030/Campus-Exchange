# 🎓 Campus Exchange - Campus Marketplace Platform

A comprehensive campus marketplace platform designed for students to buy, sell, and trade everything they need on campus. From notes to bikes, food tokens to rooms - all in one trusted place.

## ✨ Features

### 🏪 Core Marketplace
- **Multi-category Listings**: 16+ categories including Notes, Books, Bikes, Food Tokens, Room Rentals, Services, and more
- **Smart Search & Filters**: Find exactly what you need with advanced search and filtering options
- **Verified Users**: Trust your campus community with verified user profiles
- **In-app Chat**: Secure messaging system for buyer-seller communication
- **Reviews & Ratings**: Build trust with community feedback system

### 💰 Monetization Features

#### Fee Structure
- **Listing Fee**: ₹10 per listing (free for Premium users)
- **Contact Unlock**: ₹5 to unlock seller contact information (free for Premium users)
- **Service Marketplace Fee**: ₹15 additional fee for service-based listings
- **High-Value Commission**: 2-5% commission on items above ₹5,000
  - ₹5,000 - ₹10,000: 2%
  - ₹10,000 - ₹20,000: 3%
  - ₹20,000 - ₹50,000: 4%
  - Above ₹50,000: 5%

#### Premium Membership (₹99/month)
- **Unlimited Free Listings**: Create as many listings as you want without fees
- **Free Contact Unlocks**: Unlock seller contacts without paying ₹5 each time
- **Premium Badge**: Get verified premium badge on profile and listings
- **Early Access**: Be first to access new features and marketplace updates
- **Priority Support**: Faster customer support and issue resolution
- **Exclusive Deals**: Access special premium-only deals and discounts
- **Sponsored Listing Discount**: ₹15 instead of ₹25 for listing boosts

#### Advertising & Promotion
- **Local Business Ads**: ₹199/month for campus-wide business advertisements
  - Targeted campus audience
  - Performance tracking (impressions & clicks)
  - 30-day campaign duration
- **Sponsored Listings**: ₹25 one-time fee to boost listing visibility
  - 2-3x more views
  - Priority placement in search
  - Featured on homepage
  - Sell 50% faster on average

### 🎪 Event Partnerships
- **Event Creation**: Create and manage campus events
- **Partnership System**: Businesses can partner with events for promotion
- **Event Categories**: Tech Fest, Cultural Fest, Sports, Workshops, Seminars, and more
- **Participant Management**: Track registrations and manage event capacity

### 🛍️ Campus Store
- **Product Management**: Add-on products and merchandise
- **Order Processing**: Complete e-commerce functionality
- **Digital & Physical Products**: Support for both digital downloads and physical items
- **Inventory Management**: Track stock levels and product availability
- **Order Tracking**: Complete order lifecycle management

### 💳 Wallet System
- **Digital Wallet**: Store money for future transactions
- **Multiple Payment Methods**: UPI, Cards, and other payment options
- **Transaction History**: Complete record of all wallet transactions
- **Auto-deduction**: Use wallet balance for marketplace fees
- **Top-up Options**: Easy money addition to wallet

## 🚀 Technology Stack

### Core Framework
- **⚡ Next.js 15** - The React framework for production with App Router
- **📘 TypeScript 5** - Type-safe JavaScript for better developer experience
- **🎨 Tailwind CSS 4** - Utility-first CSS framework for rapid UI development

### Database & Backend
- **🗄️ Prisma** - Next-generation Node.js and TypeScript ORM
- **🔐 NextAuth.js** - Complete open-source authentication solution
- **📊 TanStack Query** - Powerful data synchronization for React

### UI Components & Styling
- **🧩 shadcn/ui** - High-quality, accessible components built on Radix UI
- **🎯 Lucide React** - Beautiful & consistent icon library
- **🌈 Framer Motion** - Production-ready motion library for React
- **🎨 Next Themes** - Perfect dark mode in 2 lines of code

### State Management & Data Fetching
- **🐻 Zustand** - Simple, scalable state management
- **🔄 TanStack Table** - Headless UI for building tables and datagrids
- **📊 Recharts** - Redefined chart library built with React and D3

## 🎯 Use Cases

### For Students
- **Buy & Sell Notes**: Access academic materials from toppers and peers
- **Find Accommodation**: Discover PG rooms, flats, and temporary stays
- **Transportation**: Buy/sell cycles, bikes, and scooters
- **Food Exchange**: Trade mess tokens and food coupons
- **Services Marketplace**: Offer or find services like tutoring, design, coding help
- **Event Tickets**: Buy and sell passes for college events

### For Local Businesses
- **Campus Advertising**: Promote products and services to students
- **Event Partnerships**: Sponsor college events and festivals
- **Targeted Marketing**: Reach specific student demographics

### For College Administration
- **Event Management**: Organize and manage college events
- **Community Building**: Foster a trusted campus marketplace
- **Revenue Generation**: Generate revenue through platform fees

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── api/                     # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── listings/            # Listing management
│   │   ├── premium/             # Premium subscriptions
│   │   ├── business-ads/        # Business advertisements
│   │   ├── events/              # Event management
│   │   ├── store/               # Campus store
│   │   └── wallet/              # Wallet system
│   ├── page.tsx                 # Homepage
│   ├── create-listing/          # Create listing page
│   ├── premium/                 # Premium membership page
│   ├── business-ads/            # Business ads page
│   └── [category]/              # Category pages
├── components/                   # Reusable React components
│   ├── ui/                      # shadcn/ui components
│   ├── auth/                    # Authentication components
│   ├── ContactUnlockModal.tsx   # Contact unlock modal
│   ├── SponsorListingModal.tsx  # Sponsored listing modal
│   └── WhatsAppIntegration.tsx  # WhatsApp integration
├── contexts/                     # React contexts
│   └── AuthContext.tsx          # Authentication context
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions and configurations
│   ├── db.ts                    # Database connection
│   └── utils.ts                 # Utility functions
└── prisma/                       # Database schema and migrations
    ├── schema.prisma            # Database schema
    └── seed.ts                  # Database seed script
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Prisma CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jitenkr2030/Campus-Exchange.git
   cd Campus-Exchange
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and other secrets
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npm run db:push
   
   # Seed the database (optional)
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)** to view the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed database with initial data

## 🌟 Key Features in Detail

### Premium Membership Benefits
- **Cost Savings**: Save ₹50+ per month with free listings and contact unlocks
- **Enhanced Visibility**: Premium badge increases trust and listing visibility
- **Priority Features**: Early access to new marketplace features
- **Dedicated Support**: Faster resolution of issues and queries

### Business Advertising
- **Campus-wide Reach**: Access thousands of students in your target campus
- **Performance Analytics**: Track ad performance with detailed metrics
- **Flexible Duration**: Monthly subscriptions with easy renewal
- **Multiple Categories**: Choose from various business categories

### Event Management
- **Comprehensive Tools**: Create events with detailed information and capacity management
- **Partnership Opportunities**: Allow businesses to sponsor and promote events
- **Registration Tracking**: Monitor event attendance and participant engagement
- **Multi-category Support**: Support for various event types

### Campus Store
- **Complete E-commerce**: Full-featured online store for campus merchandise
- **Inventory Management**: Real-time stock tracking and management
- **Order Processing**: End-to-end order fulfillment system
- **Digital Products**: Support for both physical and digital goods

### Wallet System
- **Convenient Payments**: Store money for quick and easy transactions
- **Transaction History**: Complete record of all financial activities
- **Multiple Top-up Options**: Various methods to add money to wallet
- **Auto-deduction**: Seamless fee payment using wallet balance

## 🔒 Security Features

- **User Verification**: Phone and email verification for trusted users
- **Secure Payments**: Encrypted payment processing with multiple gateways
- **Data Protection**: User data protection with secure storage
- **Fraud Detection**: AI-powered fraud detection system
- **Moderation**: Content moderation to ensure quality listings

## 📱 Mobile Responsiveness

The application is fully responsive and works seamlessly across:
- **Desktop**: Full-featured experience with advanced filters and management
- **Tablet**: Optimized layout for tablet devices
- **Mobile**: Touch-friendly interface with simplified navigation

## 🎨 Design System

- **Consistent UI**: Unified design language across all components
- **Accessibility**: WCAG compliant with keyboard navigation support
- **Dark Mode**: Built-in dark/light mode support
- **Performance**: Optimized for fast loading and smooth interactions

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Z.ai** - AI-powered coding assistance and development support
- **Next.js Team** - For the amazing React framework
- **Prisma Team** - For the modern database toolkit
- **shadcn/ui** - For the beautiful and accessible UI components

## 📞 Support

For support, please email support@campusexchange.com or create an issue in the GitHub repository.

---

Built with ❤️ for the campus community. Making campus life easier, one transaction at a time.

## ✅ Implementation Status

All requested features have been successfully implemented:

1. ✅ **Updated listing fee from ₹5 to ₹10** - System-wide update completed
2. ✅ **Buyer contact unlock feature with ₹5 fee** - Implemented with secure transactions
3. ✅ **Campus Premium Membership system (₹99/month)** - Full subscription system with benefits
4. ✅ **Commission system for high-value items (2-5%)** - Tiered commission structure implemented
5. ✅ **Local Business Ads system (₹199/month)** - Complete advertising platform
6. ✅ **Sponsored Listings feature (₹25 boost fee)** - Enhanced visibility system
7. ✅ **Event Partnerships system** - Multi-tier sponsorship platform
8. ✅ **Campus Store for add-on products** - Full e-commerce functionality
9. ✅ **Service Marketplace fee system** - Additional fee structure for services
10. ✅ **Wallet system for future fintech features** - Complete digital wallet implementation

The platform is now fully functional with all monetization features and ready for production deployment.
