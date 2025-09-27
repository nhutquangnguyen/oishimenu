#!/bin/bash

# 🚀 Quick Deploy Script for OishiMenu
# This script handles the complete deployment workflow

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}🔹 $1${NC}"
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

echo ""
echo -e "${BLUE}🚀 OishiMenu Quick Deploy${NC}"
echo "=============================="

# Step 1: Check for uncommitted changes
print_step "Checking git status..."
if [[ -n $(git status --porcelain) ]]; then
    echo ""
    git status --short
    echo ""

    read -p "You have uncommitted changes. Do you want to commit them? (y/n): " commit_choice

    if [[ $commit_choice == "y" || $commit_choice == "Y" ]]; then
        echo ""
        read -p "Enter commit message (or press Enter for default): " commit_msg

        if [[ -z "$commit_msg" ]]; then
            commit_msg="Update: Deploy $(date '+%Y-%m-%d %H:%M')"
        fi

        print_step "Adding all changes..."
        git add .

        print_step "Committing changes..."
        git commit -m "$commit_msg

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

        print_success "Changes committed"
    else
        print_warning "Deploying without committing local changes"
        echo "Note: Vercel will deploy from the last committed version in git"
    fi
else
    print_success "No uncommitted changes found"
fi

# Step 2: Push to git
print_step "Pushing to git repository..."
if git push; then
    print_success "Code pushed to git"
else
    print_error "Failed to push to git"
    exit 1
fi

# Step 3: Deploy to Vercel
echo ""
read -p "Deploy to production? (y/n): " deploy_choice

if [[ $deploy_choice == "y" || $deploy_choice == "Y" ]]; then
    print_step "Deploying to Vercel production..."

    if vercel --prod --yes; then
        print_success "Deployment successful! 🎉"
        echo ""
        echo -e "${GREEN}🌐 Your site is live at: https://oishimenu.com${NC}"
    else
        print_error "Deployment failed"
        exit 1
    fi
else
    print_step "Deploying to Vercel preview..."

    if vercel --yes; then
        print_success "Preview deployment successful! 🎉"
        echo ""
        echo -e "${YELLOW}🔍 Check your preview deployment above${NC}"
    else
        print_error "Preview deployment failed"
        exit 1
    fi
fi

echo ""
print_success "Deploy script completed! 🚀"