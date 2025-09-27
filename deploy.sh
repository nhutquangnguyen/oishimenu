#!/bin/bash

# 🚀 OishiMenu Enhanced Deployment Script
# Supports multiple deployment targets: Vercel, Netlify, and production builds
# Author: OishiMenu Team
# Version: 2.0

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_header() {
    echo -e "${PURPLE}🍜 $1${NC}"
}

# Main header
clear
print_header "============================================"
print_header "       OishiMenu Deployment Script v2.0    "
print_header "============================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from your project root."
    exit 1
fi

print_status "Found package.json"

# Function to check dependencies
check_dependencies() {
    print_info "Checking system dependencies..."

    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi

    NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ required. Current: $(node --version)"
        exit 1
    fi

    print_status "Node.js $(node --version) ✓"

    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi

    print_status "npm $(npm --version) ✓"

    # Check git
    if ! command -v git &> /dev/null; then
        print_warning "Git is not installed. Some features may not work."
    else
        print_status "Git $(git --version | cut -d ' ' -f 3) ✓"
    fi
}

# Function to setup environment
setup_environment() {
    print_info "Setting up environment..."

    # Check for environment files
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local not found. Creating template..."
        cp .env.production .env.local 2>/dev/null || cat > .env.local << 'EOF'
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin Configuration
ADMIN_EMAIL=admin@oishimenu.com
ADMIN_PASSWORD=your_secure_password

# Environment
NODE_ENV=development
EOF
        print_warning "Created .env.local template. Please update with your actual values."
        print_info "You can copy values from .env.production if available."
    else
        print_status "Environment file .env.local exists"
    fi
}

# Function to install dependencies
install_dependencies() {
    print_info "Installing dependencies..."

    # Clean install
    if [ -d "node_modules" ]; then
        print_info "Cleaning existing node_modules..."
        rm -rf node_modules
    fi

    if [ -f "package-lock.json" ]; then
        print_info "Using npm ci for clean install..."
        npm ci
    else
        print_info "Installing with npm install..."
        npm install
    fi

    print_status "Dependencies installed successfully"
}

# Function to run linting and type checking
run_quality_checks() {
    print_info "Running code quality checks..."

    # Type checking
    if command -v npx &> /dev/null; then
        print_info "Running TypeScript type check..."
        npx tsc --noEmit || {
            print_warning "TypeScript type checking found issues (continuing anyway)"
        }
    fi

    # Linting
    if npm run lint &> /dev/null; then
        print_info "Running ESLint..."
        npm run lint || {
            print_warning "Linting found issues (continuing anyway)"
        }
    fi

    print_status "Quality checks completed"
}

# Function to build the application
build_application() {
    print_info "Building OishiMenu application..."

    # Set production environment for build
    export NODE_ENV=production

    # Run the build
    npm run build

    if [ $? -eq 0 ]; then
        print_status "Build completed successfully!"
    else
        print_error "Build failed. Please fix the errors above."
        exit 1
    fi
}

# Function to prepare git repository
prepare_git() {
    print_info "Preparing Git repository..."

    if [ ! -d ".git" ]; then
        print_info "Initializing Git repository..."
        git init

        # Create .gitignore if it doesn't exist
        if [ ! -f ".gitignore" ]; then
            cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Environment variables
.env*.local
.env.production

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Local development
.env.local
.env.development.local
.env.test.local
.env.production.local
EOF
        fi

        git add .
        git commit -m "Initial commit: OishiMenu v$(node -p "require('./package.json').version")"
        print_status "Git repository initialized"
    else
        print_status "Git repository already exists"

        # Check if there are uncommitted changes
        if ! git diff-index --quiet HEAD --; then
            print_info "Found uncommitted changes. Committing..."
            git add .
            git commit -m "Pre-deployment commit: $(date '+%Y-%m-%d %H:%M:%S')"
            print_status "Changes committed"
        fi
    fi
}

# Function to deploy to Vercel
deploy_vercel() {
    print_info "Deploying to Vercel..."

    if ! command -v vercel &> /dev/null; then
        print_info "Installing Vercel CLI..."
        npm install -g vercel
    fi

    print_info "Running Vercel deployment..."

    # Set environment variables for Vercel
    if [ -f ".env.production" ]; then
        print_info "Environment variables will be set from .env.production"
        echo "Please manually add these to your Vercel dashboard:"
        echo "1. Go to your project settings in Vercel"
        echo "2. Navigate to Environment Variables"
        echo "3. Add the variables from .env.production"
        echo ""
        read -p "Press Enter when you've added the environment variables..."
    fi

    # Deploy
    vercel --prod

    print_status "Vercel deployment completed!"
}

# Function to create production build
create_production_build() {
    print_info "Creating production build package..."

    # Create build directory
    BUILD_DIR="oishimenu-production-$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BUILD_DIR"

    # Copy necessary files
    cp -r .next "$BUILD_DIR/"
    cp -r public "$BUILD_DIR/"
    cp package.json "$BUILD_DIR/"
    cp package-lock.json "$BUILD_DIR/" 2>/dev/null || true
    cp next.config.* "$BUILD_DIR/" 2>/dev/null || true

    # Copy environment template
    cp .env.production "$BUILD_DIR/.env.example" 2>/dev/null || true

    # Create deployment instructions
    cat > "$BUILD_DIR/DEPLOY.md" << 'EOF'
# OishiMenu Production Deployment

## Quick Start
1. Copy `.env.example` to `.env.production`
2. Update environment variables with your values
3. Run: `npm install --production`
4. Run: `npm start`

## Requirements
- Node.js 18+
- npm

## Environment Variables
Update `.env.production` with your:
- Firebase configuration
- Domain settings
- Admin credentials

## Start Application
```bash
npm install --production
npm start
```

Your OishiMenu application will be available at http://localhost:3000
EOF

    # Create package archive
    tar -czf "$BUILD_DIR.tar.gz" "$BUILD_DIR"

    print_status "Production build created: $BUILD_DIR.tar.gz"
    print_info "Upload this file to your server and follow DEPLOY.md instructions"
}

# Function to show deployment options
show_deployment_menu() {
    echo ""
    echo "🚀 Choose your deployment option:"
    echo "1) Full preparation + Vercel deployment"
    echo "2) Full preparation + Production build package"
    echo "3) Quick build and test"
    echo "4) Environment setup only"
    echo "5) Exit"
    echo ""
    read -p "Enter your choice (1-5): " choice

    case $choice in
        1)
            print_header "Starting full Vercel deployment..."
            check_dependencies
            setup_environment
            install_dependencies
            run_quality_checks
            build_application
            prepare_git
            deploy_vercel
            ;;
        2)
            print_header "Creating production build package..."
            check_dependencies
            setup_environment
            install_dependencies
            run_quality_checks
            build_application
            prepare_git
            create_production_build
            ;;
        3)
            print_header "Quick build and test..."
            check_dependencies
            install_dependencies
            build_application
            print_status "Quick build completed successfully!"
            ;;
        4)
            print_header "Environment setup only..."
            setup_environment
            print_status "Environment setup completed!"
            ;;
        5)
            print_info "Goodbye! 👋"
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
}

# Function to show post-deployment instructions
show_post_deployment() {
    echo ""
    print_header "🎉 Deployment Process Complete!"
    echo ""
    print_info "Next steps:"
    echo ""
    echo "📝 For Vercel deployment:"
    echo "   • Your app should be live at the provided URL"
    echo "   • Configure custom domain in Vercel dashboard"
    echo "   • Set up monitoring and analytics"
    echo ""
    echo "📦 For production build:"
    echo "   • Upload the .tar.gz file to your server"
    echo "   • Extract and follow DEPLOY.md instructions"
    echo "   • Configure reverse proxy (nginx/Apache)"
    echo ""
    echo "🔧 Important reminders:"
    echo "   • Update DNS records for your domain"
    echo "   • Configure SSL certificates"
    echo "   • Set up monitoring and backups"
    echo "   • Test all features in production"
    echo ""
    echo "📖 For detailed documentation, check:"
    echo "   • deployment/README.md"
    echo "   • https://docs.oishimenu.com"
    echo ""
    print_status "Happy serving with OishiMenu! 🍜"
}

# Main execution
main() {
    show_deployment_menu
    show_post_deployment
}

# Run the main function
main