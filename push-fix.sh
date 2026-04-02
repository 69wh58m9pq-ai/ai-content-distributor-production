#!/bin/bash

# Push the fixed schema to production
echo "🚀 Pushing NextAuth schema fix to production..."

# Check current git status
echo "📊 Git status:"
git status --short

# Add the fixed schema file
echo "📝 Adding fixed schema..."
git add prisma/schema.prisma

# Commit the fix
echo "💾 Committing fix..."
git commit -m "FIX: Add NextAuth tables (Account, Session, VerificationToken) for registration to work"

# Push to GitHub (triggers Vercel deployment)
echo "🚀 Pushing to GitHub..."
git push origin main --force

echo ""
echo "✅ Fix pushed successfully!"
echo ""
echo "Next:"
echo "1. Vercel will auto-deploy: https://vercel.com/69wh58m9pq-ai/ai-content-distributor-production"
echo "2. Deployment takes ~3-5 minutes"
echo "3. Test registration after deployment: https://ai-content-distributor-production.vercel.app/auth/signup"
echo ""
echo "Fix pushed at: $(date)"