#!/bin/bash

# 🚀 Open DPIA Assistant - GitHub & Vercel Setup Script
# This script helps you connect your project to GitHub and deploy to Vercel

set -e

echo "🛡️ Open DPIA Assistant - GitHub & Vercel Setup"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_error "Git repository not initialized!"
    echo "Please run: git init"
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    print_warning "No GitHub remote configured!"
    echo ""
    echo "To connect to GitHub:"
    echo "1. Create a new repository on GitHub"
    echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo "3. Run: git push -u origin main"
    echo ""
    read -p "Press Enter to continue after setting up GitHub..."
fi

# Check current git status
print_status "Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes!"
    echo "Current changes:"
    git status --short
    echo ""
    read -p "Do you want to commit these changes? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "Setup: GitHub and Vercel configuration"
        print_success "Changes committed!"
    fi
fi

# Push to GitHub
print_status "Pushing to GitHub..."
if git push origin main; then
    print_success "Successfully pushed to GitHub!"
else
    print_error "Failed to push to GitHub!"
    echo "Please check your GitHub connection and try again."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not installed!"
    echo "Installing Vercel CLI..."
    npm install -g vercel
    print_success "Vercel CLI installed!"
fi

# Login to Vercel
print_status "Logging into Vercel..."
if vercel login; then
    print_success "Successfully logged into Vercel!"
else
    print_error "Failed to login to Vercel!"
    echo "Please try again or login manually at https://vercel.com"
    exit 1
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."
echo ""
echo "📋 Vercel Deployment Configuration:"
echo "   Framework: Next.js (auto-detected)"
echo "   Build Command: npm run build"
echo "   Output Directory: .next"
echo "   Install Command: npm install"
echo ""

if vercel --prod; then
    print_success "Successfully deployed to Vercel!"
    echo ""
    echo "🎉 Deployment Complete!"
    echo "======================"
    echo ""
    echo "Your app is now live at:"
    vercel ls --prod | grep "$(pwd | xargs basename)" | awk '{print "https://" $2}'
    echo ""
    echo "📝 Next Steps:"
    echo "1. Set up your backend (Railway/Render/Fly.io)"
    echo "2. Update NEXT_PUBLIC_API_URL in Vercel environment variables"
    echo "3. Configure CORS_ORIGINS in your backend"
    echo ""
    echo "🔧 Environment Variables to set in Vercel:"
    echo "   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app"
    echo ""
    echo "📖 For detailed instructions, see DEPLOYMENT.md"
else
    print_error "Failed to deploy to Vercel!"
    echo "Please check the error messages above and try again."
    exit 1
fi

print_success "Setup complete! 🚀"
