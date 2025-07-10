#!/bin/bash

# Shop Manager - Local Development Setup Script
# This script automates the setup process for local development

set -e  # Exit on any error

echo "🛍️  Shop Manager - Local Development Setup"
echo "==========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"
        
        # Check if version is 18+
        NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | cut -d'v' -f2)
        if [ "$NODE_MAJOR_VERSION" -lt 18 ]; then
            print_warning "Node.js version 18+ is recommended. Current: $NODE_VERSION"
            print_info "Consider upgrading with: npm install -g n && n latest"
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm is installed: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install Node.js which includes npm."
        exit 1
    fi
}

# Check if Expo CLI is installed
check_expo() {
    if command -v expo &> /dev/null; then
        EXPO_VERSION=$(expo --version)
        print_success "Expo CLI is installed: $EXPO_VERSION"
    else
        print_warning "Expo CLI not found. Installing..."
        npm install -g @expo/cli
        print_success "Expo CLI installed successfully"
    fi
}

# Install dependencies
install_dependencies() {
    print_info "Installing npm dependencies..."
    npm install
    print_success "Dependencies installed successfully"
}

# Install Expo dependencies
install_expo_dependencies() {
    print_info "Installing Expo-specific dependencies..."
    npx expo install
    print_success "Expo dependencies installed successfully"
}

# Check environment file
check_environment() {
    if [ -f ".env" ]; then
        print_success "Environment file (.env) found"
    else
        print_warning "Environment file (.env) not found"
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success "Created .env from .env.example"
        else
            print_error "No .env.example file found. Please create a .env file manually."
        fi
    fi
}

# Check for iOS development tools (Mac only)
check_ios_tools() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        print_info "Checking iOS development tools (Mac detected)..."
        
        if command -v xcodebuild &> /dev/null; then
            XCODE_VERSION=$(xcodebuild -version | head -n 1)
            print_success "Xcode found: $XCODE_VERSION"
        else
            print_warning "Xcode not found. Install from App Store for iOS development."
        fi
        
        if command -v pod &> /dev/null; then
            POD_VERSION=$(pod --version)
            print_success "CocoaPods found: $POD_VERSION"
        else
            print_warning "CocoaPods not found. Install with: sudo gem install cocoapods"
        fi
    else
        print_info "Non-Mac system detected. Skipping iOS tools check."
    fi
}

# Check for Android development tools
check_android_tools() {
    if command -v adb &> /dev/null; then
        print_success "Android Debug Bridge (adb) found"
    else
        print_warning "Android tools not found. Install Android Studio for Android development."
    fi
}

# Display final instructions
show_final_instructions() {
    echo ""
    echo "🎉 Setup Complete!"
    echo "=================="
    echo ""
    echo "Next steps:"
    echo "1. Start the development server:"
    echo "   ${BLUE}npx expo start${NC}"
    echo ""
    echo "2. Choose your platform:"
    echo "   • Press 'i' for iOS simulator"
    echo "   • Press 'a' for Android emulator"
    echo "   • Press 'w' for web browser"
    echo ""
    echo "3. Test the app:"
    echo "   • Create a local account"
    echo "   • Test biometric authentication (on device)"
    echo "   • Explore the dashboard"
    echo ""
    echo "📚 Documentation:"
    echo "   • Setup Guide: SETUP_GUIDE.md"
    echo "   • Architecture: ARCHITECTURE.md"
    echo "   • Implementation: IMPLEMENTATION_GUIDE.md"
    echo ""
    echo "🆘 Need help? Check SETUP_GUIDE.md for troubleshooting!"
}

# Main setup process
main() {
    echo "Starting setup process..."
    echo ""
    
    # System checks
    print_info "Checking system requirements..."
    check_node
    check_npm
    check_expo
    echo ""
    
    # Project setup
    print_info "Setting up project..."
    install_dependencies
    install_expo_dependencies
    check_environment
    echo ""
    
    # Development tools
    print_info "Checking development tools..."
    check_ios_tools
    check_android_tools
    echo ""
    
    # Final instructions
    show_final_instructions
}

# Run main function
main