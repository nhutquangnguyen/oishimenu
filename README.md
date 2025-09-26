# 🍜 OishiMenu

A modern SaaS platform that empowers small restaurants and cafés to express their brand with beautiful, customizable themes and intuitive drag-and-drop menu creation. Built for speed, scalability, and simplicity.

## 🌐 **Live Demo**
- **Main Site**: https://oishimenu.com
- **Admin Panel**: https://admin.oishimenu.com
- **Merchant Dashboard**: https://merchant.oishimenu.com

## 🚀 Features

- **Beautiful Landing Page** - Modern, conversion-focused marketing page
- **Firebase Authentication** - Secure sign-in/sign-up with Google OAuth
- **Dashboard Interface** - Clean, responsive admin dashboard
- **Menu Builder** - Drag-and-drop menu creation (coming soon)
- **Public Menu** - Customer-facing digital menus (coming soon)
- **Order Management** - Real-time order tracking (coming soon)
- **Table Management** - QR code generation for tables (coming soon)
- **Analytics** - Smart insights and reporting (coming soon)

## 🛠 Tech Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS, shadcn/ui, Framer Motion
- **Backend**: Firebase (Auth, Firestore, Functions, Hosting, Storage)
- **Payments**: Stripe integration (coming soon)
- **Deployment**: Firebase Hosting

## 🏗 Project Structure

```
OishiMenu/
├── 📚 docs/                           # All documentation organized
│   ├── README.md                      # Documentation overview
│   ├── DEPLOYMENT_GUIDE.md            # Complete deployment guide
│   ├── QUICK_DEPLOYMENT_STEPS.md      # Fast track deployment
│   ├── MULTI_TENANT_ARCHITECTURE.md   # Subdomain architecture
│   ├── technical/                     # Technical documentation
│   ├── features/                      # Feature documentation
│   └── fixes/                         # Bug fixes & troubleshooting
├── 🚀 deployment/                     # Deployment scripts
│   ├── README.md                      # Deployment overview
│   └── deploy.sh                      # Deployment script
├── ⚙️ config/                         # Configuration files
│   ├── firebase.json                  # Firebase configuration
│   ├── firestore.rules                # Security rules
│   ├── tsconfig.json                  # TypeScript config
│   └── ...                            # Other config files
├── 🛠️ tools/                          # Development tools
│   ├── debug-user.js                  # User debugging
│   ├── delete-user-data.js            # Data cleanup
│   └── generate-demo-data.js          # Demo data generation
├── 💻 src/                           # Source code
│   ├── app/                          # Next.js app directory
│   │   ├── admin/                    # Admin panel routes
│   │   ├── merchant/                 # Merchant routes
│   │   ├── auth/                     # Authentication pages
│   │   ├── dashboard/                # Dashboard pages
│   │   └── page.tsx                  # Landing page
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── admin/                    # Admin-specific components
│   │   ├── merchant/                 # Merchant-specific components
│   │   └── marketing/                # Marketing site components
│   ├── contexts/                     # React contexts
│   ├── hooks/                        # Custom hooks
│   ├── lib/                          # Utility libraries
│   └── types/                        # TypeScript types
├── 🌐 middleware.ts                  # Subdomain routing
├── 📄 README.md                      # Main project README
├── 📦 package.json                   # Dependencies
└── 📁 public/                        # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-menu-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

   # Stripe Configuration (coming soon)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔥 Firebase Setup

1. **Create a Firebase project** at [console.firebase.google.com](https://console.firebase.google.com)

2. **Enable Authentication**
   - Go to Authentication > Sign-in method
   - Enable Email/Password and Google providers

3. **Set up Firestore Database**
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (coming soon)

4. **Configure Hosting** (optional)
   - Install Firebase CLI: `npm install -g firebase-tools`
   - Login: `firebase login`
   - Initialize: `firebase init hosting`

## 📱 Current Status

### ✅ Completed
- [x] Next.js project setup with TypeScript and TailwindCSS
- [x] shadcn/ui component library integration
- [x] Beautiful landing page with hero, features, pricing, testimonials
- [x] Firebase authentication system
- [x] Dashboard layout with navigation
- [x] Responsive design and mobile-first approach

### 🚧 In Progress
- [ ] Menu builder with drag-and-drop functionality
- [ ] Public menu pages with theming
- [ ] Order management system
- [ ] Table management with QR codes
- [ ] Stripe payment integration
- [ ] Analytics dashboard

## 🎨 Design System

The project uses a consistent design system with:
- **Colors**: Blue and purple gradient theme
- **Typography**: Clean, modern fonts
- **Components**: shadcn/ui for consistency
- **Layout**: Mobile-first responsive design
- **Animations**: Subtle Framer Motion animations

## 🚀 Deployment

### Quick Deployment
```bash
# Run the deployment script
./deployment/deploy.sh

# Follow the deployment guide
# See docs/DEPLOYMENT_GUIDE.md for complete instructions
```

### Multi-Tenant Subdomain Structure
- **Main Site**: `oishimenu.com` - Marketing landing page
- **Admin Panel**: `admin.oishimenu.com` - Central admin dashboard
- **Merchant Dashboard**: `merchant.oishimenu.com/{id}/dashboard` - Merchant management
- **Public Menu**: `merchant.oishimenu.com/{id}/menu` - Customer-facing menu

### Documentation
- **[Complete Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Step-by-step deployment
- **[Quick Deployment Steps](docs/QUICK_DEPLOYMENT_STEPS.md)** - Fast track deployment
- **[Multi-Tenant Architecture](docs/MULTI_TENANT_ARCHITECTURE.md)** - Subdomain setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@smartmenuai.com or join our Discord community.

---

Built with ❤️ for small restaurants and cafés worldwide.