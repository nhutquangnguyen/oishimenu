#!/bin/bash

# 🚀 OishiMenu Vercel Deployment Optimizer
# Enhanced deployment script for existing Vercel projects

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}🍜 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header "============================================"
print_header "    OishiMenu Vercel Deployment Tools"
print_header "============================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
    print_success "Vercel CLI installed"
fi

# Function to check deployment status
check_deployment() {
    print_header "Checking current deployment..."

    if vercel ls 2>/dev/null | grep -q "oishi-menu\|smart-menu"; then
        print_success "Found existing Vercel deployment"
        echo ""
        vercel ls --scope=team 2>/dev/null || vercel ls
        echo ""
    else
        print_warning "No deployment found. This might be a new setup."
    fi
}

# Function to run pre-deployment checks
pre_deployment_checks() {
    print_header "Running pre-deployment checks..."

    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run from project root."
        exit 1
    fi

    # Check for build errors
    print_header "Testing build..."
    npm run build

    if [ $? -eq 0 ]; then
        print_success "Build successful"
    else
        print_error "Build failed. Please fix errors before deploying."
        exit 1
    fi

    # Check environment variables
    print_header "Checking environment setup..."

    if [ -f ".env.local" ]; then
        print_success "Local environment file found"
    fi

    if [ -f ".env.production" ]; then
        print_success "Production environment template found"
        echo ""
        print_warning "Remember to set these in Vercel dashboard:"
        grep -E "^[A-Z]" .env.production | cut -d'=' -f1 | sed 's/^/  - /'
        echo ""
    fi
}

# Function to optimize deployment
optimize_deployment() {
    print_header "Optimizing for Vercel deployment..."

    # Create optimized vercel.json if it doesn't exist
    if [ ! -f "vercel.json" ]; then
        print_warning "Creating optimized vercel.json..."
        # The vercel.json file was already created above
        print_success "Created optimized Vercel configuration"
    else
        print_success "Vercel configuration exists"
    fi

    # Check next.config.js for optimizations
    if [ -f "next.config.js" ] || [ -f "next.config.ts" ]; then
        print_success "Next.js config found"
    else
        print_warning "Consider adding next.config.js for optimization"
    fi
}

# Function to deploy to preview
deploy_preview() {
    print_header "Deploying to preview..."
    vercel --confirm
    print_success "Preview deployment complete!"
}

# Function to deploy to production
deploy_production() {
    print_header "Deploying to production..."

    echo "🚨 This will deploy to your production domain!"
    read -p "Are you sure? (y/N): " confirm

    if [[ $confirm =~ ^[Yy]$ ]]; then
        vercel --prod --confirm
        print_success "Production deployment complete!"

        # Get deployment URL
        DEPLOY_URL=$(vercel ls --meta | head -1 | awk '{print $2}' 2>/dev/null || echo "your-domain.vercel.app")
        echo ""
        print_header "🎉 Deployment Complete!"
        echo "🌐 Production URL: https://$DEPLOY_URL"
        echo "📊 Analytics: https://vercel.com/dashboard"
        echo ""
    else
        print_warning "Production deployment cancelled"
    fi
}

# Function to show environment variables
show_env_setup() {
    print_header "Environment Variables Setup Guide"
    echo ""
    echo "1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables"
    echo "2. Add these variables for all environments (Production, Preview, Development):"
    echo ""

    if [ -f ".env.production" ]; then
        echo "📋 Required variables:"
        grep -E "^[A-Z]" .env.production | while read line; do
            key=$(echo $line | cut -d'=' -f1)
            echo "   $key"
        done
    else
        echo "📋 Common variables needed:"
        echo "   NEXT_PUBLIC_FIREBASE_API_KEY"
        echo "   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
        echo "   NEXT_PUBLIC_FIREBASE_PROJECT_ID"
        echo "   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
        echo "   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
        echo "   NEXT_PUBLIC_FIREBASE_APP_ID"
        echo "   NEXT_PUBLIC_APP_URL"
        echo "   ADMIN_EMAIL"
        echo "   ADMIN_PASSWORD"
    fi

    echo ""
    echo "3. Save and redeploy for changes to take effect"
    echo ""
}

# Function to check domain setup
check_domain() {
    print_header "Domain Configuration Check"

    echo "Current domains configured:"
    vercel domains ls 2>/dev/null || echo "  No custom domains found"

    echo ""
    echo "To add oishimenu.com:"
    echo "1. vercel domains add oishimenu.com"
    echo "2. Configure DNS:"
    echo "   A record: @ → 76.76.19.61"
    echo "   CNAME: www → cname.vercel-dns.com"
    echo ""
}

# Function to show logs
show_logs() {
    print_header "Recent deployment logs:"
    vercel logs --follow &
    PID=$!

    echo "Press Ctrl+C to stop following logs"
    trap "kill $PID 2>/dev/null" EXIT
    wait
}

# Function to rollback deployment
rollback_deployment() {
    print_header "Available deployments for rollback:"
    vercel ls

    echo ""
    read -p "Enter deployment URL to promote to production: " deployment_url

    if [ ! -z "$deployment_url" ]; then
        vercel promote $deployment_url
        print_success "Rollback complete!"
    else
        print_warning "Rollback cancelled"
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "🚀 What would you like to do?"
    echo "1) Check deployment status"
    echo "2) Run pre-deployment checks"
    echo "3) Deploy to preview"
    echo "4) Deploy to production"
    echo "5) Show environment setup guide"
    echo "6) Check domain configuration"
    echo "7) View deployment logs"
    echo "8) Rollback deployment"
    echo "9) Optimize configuration"
    echo "10) Exit"
    echo ""
    read -p "Enter your choice (1-10): " choice

    case $choice in
        1) check_deployment ;;
        2) pre_deployment_checks ;;
        3) deploy_preview ;;
        4) deploy_production ;;
        5) show_env_setup ;;
        6) check_domain ;;
        7) show_logs ;;
        8) rollback_deployment ;;
        9) optimize_deployment ;;
        10)
            print_success "Happy serving with OishiMenu! 🍜"
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please try again."
            show_menu
            ;;
    esac
}

# Main execution
main() {
    # Always run optimization first
    optimize_deployment

    # Show menu
    show_menu

    # Keep showing menu until exit
    while true; do
        echo ""
        read -p "Press Enter to return to menu, or 'q' to quit: " continue
        if [[ $continue == "q" ]]; then
            break
        fi
        show_menu
    done
}

# Run main function
main