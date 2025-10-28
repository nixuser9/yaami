#!/bin/bash

# Yaami Setup Script
# This script sets up the development environment for Yaami

set -e

echo "🗂️  Yaami Setup Script"
echo "====================="
echo ""

# Check Node.js version
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20.x or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Warning: Node.js version is $NODE_VERSION. Recommended version is 20.x or higher."
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check npm
echo "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm $(npm -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Quick Start Commands:"
echo "   npm run dev          - Start development mode"
echo "   npm run build        - Build the application"
echo "   npm run package      - Package for your platform"
echo ""
echo "🐳 Docker Commands:"
echo "   docker-compose up -d - Start in Docker"
echo "   docker-compose down  - Stop Docker container"
echo ""
echo "📚 For more information, see:"
echo "   - README.md for general usage"
echo "   - DEVELOPMENT.md for development guide"
echo ""
echo "Happy coding! 🎉"
