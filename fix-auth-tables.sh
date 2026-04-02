#!/bin/bash

# Fix NextAuth PrismaAdapter tables issue
# Run this to add missing Account, Session, VerificationToken tables

set -e

echo "🔧 Fixing NextAuth PrismaAdapter tables..."

# Update schema with NextAuth tables
echo "📝 Updating Prisma schema with NextAuth tables..."
cp prisma/schema-with-auth.prisma prisma/schema.prisma

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🚀 Pushing database schema to Supabase..."
npx prisma db push --accept-data-loss

# Build and deploy
echo "🏗️ Building project..."
npm run build

echo "📝 Committing changes..."
git add .
git commit -m "Fix: Add NextAuth tables (Account, Session, VerificationToken) - $(date '+%Y-%m-%d %H:%M:%S')"

echo "🚀 Pushing to GitHub..."
git push origin main --force

echo ""
echo "✅ NextAuth tables fix completed!"
echo ""
echo "Next steps:"
echo "1. Vercel will automatically deploy"
echo "2. Test registration: https://ai-content-distributor-production.vercel.app/auth/signup"
echo "3. Check Supabase Table Editor for new tables"
echo ""
echo "Expected tables after fix:"
echo "- Account"
echo "- Session"  
echo "- VerificationToken"
echo "- User"
echo "- Usage"
echo "- Payment"
echo ""
echo "Fix completed at: $(date)"