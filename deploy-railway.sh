#!/bin/bash

# Railway MySQL Migration Deployment Script
# Run this after Railway MySQL database is created and connection string is obtained

set -e

echo "🚀 Starting Railway MySQL Migration Deployment"

# Check if DATABASE_URL is provided
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is required"
    echo "Please set DATABASE_URL before running this script:"
    echo "export DATABASE_URL='mysql://username:password@host:port/database_name'"
    exit 1
fi

echo "✅ DATABASE_URL is set"

# Backup current .env file
if [ -f ".env" ]; then
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Backed up current .env file"
fi

# Update .env file with Railway MySQL connection
cat > .env << EOF
# Environment variables for AI Content Distributor
# Updated for Railway MySQL

DATABASE_URL="$DATABASE_URL"
NEXTAUTH_SECRET="Y0Yk5hKRgQQeOUq5Xq1Lw0SF361MWD9B0eGeDxh5Rgo="
NEXTAUTH_URL="https://ai-content-distributor-production.vercel.app"
OPENAI_API_KEY="sk-qpVe68Aa6hvghLe856uISGkznT1GB1AVvsCQ4JickmiFueKV"
OPENAI_BASE_URL="https://poloai.top/v1"
STRIPE_SECRET_KEY="sk_test_4eC39HqLyjWDarjtT1zdp7dc"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_TYooMQauvdEDq54NiTphI7jx"
EOF

echo "✅ Updated .env file with Railway MySQL configuration"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🚀 Pushing database schema to Railway MySQL..."
npx prisma db push

# Build the project
echo "🏗️ Building project..."
npm run build

echo "✅ Build completed successfully!"

# Git operations
echo "📝 Committing changes..."
git add .
git commit -m "Database: Migrate to Railway MySQL - $(date '+%Y-%m-%d %H:%M:%S')"

echo "🚀 Pushing to GitHub..."
git push origin main --force

echo ""
echo "🎉 Migration deployment completed!"
echo ""
echo "Next steps:"
echo "1. Vercel will automatically deploy from GitHub"
echo "2. Monitor deployment at: https://vercel.com/69wh58m9pq-ai/ai-content-distributor-production"
echo "3. Test production: https://ai-content-distributor-production.vercel.app"
echo "4. Verify registration/login functionality"
echo ""
echo "To check deployment status:"
echo "curl -I https://ai-content-distributor-production.vercel.app"
echo ""
echo "To test registration:"
echo "curl -X POST https://ai-content-distributor-production.vercel.app/api/auth/register"
echo ""
echo "Migration completed at: $(date)"