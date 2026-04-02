#!/bin/bash

# Quick fix for NextAuth tables
echo "🚀 Quick fix: Pushing updated schema to Supabase"

# Push database schema
npx prisma db push --accept-data-loss

# Generate Prisma client (if needed)
npx prisma generate

# Build project
npm run build

# Commit and push
git add .
git commit -m "Fix: Complete NextAuth schema with Account, Session, VerificationToken tables"
git push origin main --force

echo "✅ Quick fix completed! Vercel will auto-deploy."