#!/bin/bash

# 🚀 OishiMenu Deployment Script
# This script helps you prepare and deploy your OishiMenu application

echo "🍜 OishiMenu Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from your project root."
    exit 1
fi

echo "✅ Found package.json"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Creating template..."
    cat > .env.local << EOF
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Configuration
ADMIN_EMAIL=admin@oishimenu.com
ADMIN_PASSWORD=your_secure_password
EOF
    echo "📝 Created .env.local template. Please update with your actual values."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run build to check for errors
echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix the errors above."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: OishiMenu application"
fi

echo ""
echo "🎉 Preparation complete!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub:"
echo "   git remote add origin https://github.com/yourusername/oishimenu.git"
echo "   git push -u origin main"
echo ""
echo "2. Deploy to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Configure environment variables"
echo "   - Deploy!"
echo ""
echo "3. Connect your domain:"
echo "   - Add oishimenu.com in Vercel dashboard"
echo "   - Configure DNS in Spaceship"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
