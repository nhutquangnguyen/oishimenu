#!/bin/bash

# 🔧 Vercel Environment Variables Setup
# Automatically configure environment variables for Vercel deployment

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}🔧 $1${NC}"
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

print_header "==============================================="
print_header "     Vercel Environment Variables Setup"
print_header "==============================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI not found. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

# Check if we're in a Vercel project
if ! vercel ls &>/dev/null; then
    print_error "This doesn't seem to be a Vercel project. Please run 'vercel' first to set up."
    exit 1
fi

# Function to set environment variables from file
set_env_from_file() {
    local env_file=$1
    local environment=$2

    if [ ! -f "$env_file" ]; then
        print_warning "File $env_file not found. Skipping..."
        return
    fi

    print_header "Setting variables from $env_file for $environment environment..."

    while IFS='=' read -r key value; do
        # Skip comments and empty lines
        if [[ $key =~ ^#.*$ ]] || [[ -z $key ]]; then
            continue
        fi

        # Remove quotes from value
        value=$(echo "$value" | sed 's/^"//;s/"$//')

        # Skip if value is a placeholder
        if [[ $value =~ ^your_.*|^example.*|^placeholder.*$ ]]; then
            print_warning "Skipping placeholder value for $key"
            continue
        fi

        print_header "Setting $key for $environment..."
        if vercel env add "$key" "$environment" <<< "$value" &>/dev/null; then
            print_success "Set $key"
        else
            print_warning "Failed to set $key (may already exist)"
        fi
    done < "$env_file"
}

# Function to set individual environment variable
set_single_env() {
    local key=$1
    local environment=$2

    echo ""
    read -p "Enter value for $key: " value

    if [ ! -z "$value" ]; then
        if vercel env add "$key" "$environment" <<< "$value" &>/dev/null; then
            print_success "Set $key for $environment"
        else
            print_warning "Failed to set $key (may already exist)"
        fi
    else
        print_warning "Skipped $key (empty value)"
    fi
}

# Function to list current environment variables
list_current_env() {
    print_header "Current environment variables:"
    vercel env ls
}

# Function to remove environment variable
remove_env_var() {
    print_header "Current environment variables:"
    vercel env ls

    echo ""
    read -p "Enter the variable name to remove: " var_name
    read -p "Enter environment (production/preview/development): " env_name

    if [ ! -z "$var_name" ] && [ ! -z "$env_name" ]; then
        if vercel env rm "$var_name" "$env_name"; then
            print_success "Removed $var_name from $env_name"
        else
            print_error "Failed to remove $var_name"
        fi
    fi
}

# Function to setup required OishiMenu variables
setup_oishimenu_vars() {
    local environment=$1

    print_header "Setting up OishiMenu variables for $environment environment..."

    # Firebase variables
    echo ""
    echo "🔥 Firebase Configuration:"
    set_single_env "NEXT_PUBLIC_FIREBASE_API_KEY" "$environment"
    set_single_env "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" "$environment"
    set_single_env "NEXT_PUBLIC_FIREBASE_PROJECT_ID" "$environment"
    set_single_env "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" "$environment"
    set_single_env "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" "$environment"
    set_single_env "NEXT_PUBLIC_FIREBASE_APP_ID" "$environment"

    # App configuration
    echo ""
    echo "🌐 App Configuration:"
    set_single_env "NEXT_PUBLIC_APP_URL" "$environment"

    # Admin configuration
    echo ""
    echo "👤 Admin Configuration:"
    set_single_env "ADMIN_EMAIL" "$environment"
    set_single_env "ADMIN_PASSWORD" "$environment"

    print_success "OishiMenu variables setup complete for $environment!"
}

# Function to copy environment between environments
copy_environment() {
    echo ""
    echo "📋 Available environments: production, preview, development"
    read -p "Copy FROM environment: " from_env
    read -p "Copy TO environment: " to_env

    if [ -z "$from_env" ] || [ -z "$to_env" ]; then
        print_error "Both environments must be specified"
        return
    fi

    print_header "Copying environment variables from $from_env to $to_env..."

    # Get environment variables (this is a simplified approach)
    print_warning "Note: You'll need to manually copy sensitive values."
    print_warning "Use Vercel dashboard for easier copying: https://vercel.com/dashboard"

    vercel env ls
}

# Function to validate environment setup
validate_env_setup() {
    print_header "Validating environment setup..."

    # Check if required variables are set
    local required_vars=(
        "NEXT_PUBLIC_FIREBASE_API_KEY"
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
        "NEXT_PUBLIC_APP_URL"
    )

    echo ""
    print_header "Checking for required variables in production..."

    for var in "${required_vars[@]}"; do
        if vercel env ls | grep -q "$var.*production"; then
            print_success "$var is set"
        else
            print_error "$var is missing"
        fi
    done

    echo ""
    print_header "Environment validation complete!"
    print_warning "Remember to redeploy after changing environment variables"
}

# Main menu
show_menu() {
    echo ""
    echo "🔧 Environment Variables Management:"
    echo "1) List current environment variables"
    echo "2) Setup OishiMenu variables (production)"
    echo "3) Setup OishiMenu variables (preview)"
    echo "4) Setup OishiMenu variables (development)"
    echo "5) Set variables from .env.production file"
    echo "6) Set variables from .env.local file"
    echo "7) Remove environment variable"
    echo "8) Copy environment variables between environments"
    echo "9) Validate environment setup"
    echo "10) Exit"
    echo ""
    read -p "Enter your choice (1-10): " choice

    case $choice in
        1) list_current_env ;;
        2) setup_oishimenu_vars "production" ;;
        3) setup_oishimenu_vars "preview" ;;
        4) setup_oishimenu_vars "development" ;;
        5) set_env_from_file ".env.production" "production" ;;
        6) set_env_from_file ".env.local" "development" ;;
        7) remove_env_var ;;
        8) copy_environment ;;
        9) validate_env_setup ;;
        10)
            print_success "Environment setup complete! 🎉"
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
    echo ""
    print_header "Welcome to Vercel Environment Variables Setup!"
    echo ""
    echo "This tool helps you configure environment variables for your OishiMenu deployment."
    echo "Make sure you have your Firebase configuration and other credentials ready."
    echo ""

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