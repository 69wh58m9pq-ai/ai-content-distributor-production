#!/bin/bash

echo "🚀 AI Content Distributor - Complete Deployment Script"
echo "======================================================"

# 检查环境
echo "📋 Checking environment..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm"
    exit 1
fi

echo "✅ Node.js $(node -v)"
echo "✅ npm $(npm -v)"

# 安装依赖
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Dependency installation failed"
    exit 1
fi

# 生成Prisma客户端
echo "🗄️ Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Prisma generation failed"
    exit 1
fi

# 运行数据库迁移
echo "🔄 Running database migrations..."
npx prisma db push

if [ $? -ne 0 ]; then
    echo "❌ Database migration failed"
    exit 1
fi

# 构建应用
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check errors above."
    exit 1
fi

echo "✅ Build successful!"

# 显示环境变量要求
echo ""
echo "🌐 REQUIRED ENVIRONMENT VARIABLES:"
echo "=================================="
echo ""
echo "1. DATABASE_URL"
echo "   - Local: 'file:./dev.db' (SQLite)"
echo "   - Production: PostgreSQL connection string"
echo ""
echo "2. NEXTAUTH_SECRET"
echo "   - Generate: openssl rand -base64 32"
echo "   - Example: $(openssl rand -base64 32 2>/dev/null || echo 'your-secret-key-here')"
echo ""
echo "3. NEXTAUTH_URL"
echo "   - Local: http://localhost:3001"
echo "   - Production: https://your-domain.vercel.app"
echo ""
echo "4. OPENAI_API_KEY"
echo "   - Your GPT-5 API key"
echo "   - Current: sk-qpVe68Aa6hvghLe856uISGkznT1GB1AVvsCQ4JickmiFueKV"
echo ""
echo "5. OPENAI_BASE_URL"
echo "   - Current: https://poloai.top/v1"
echo ""
echo "6. STRIPE_SECRET_KEY"
echo "   - Test: STRIPE_SECRET_KEY_PLACEHOLDER"
echo "   - Production: From Stripe Dashboard"
echo ""
echo "7. STRIPE_WEBHOOK_SECRET"
echo "   - Test: whsec_test"
echo "   - Production: From Stripe Webhooks"
echo ""
echo "8. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo "   - Test: STRIPE_PUBLISHABLE_KEY_PLACEHOLDER"
echo "   - Production: From Stripe Dashboard"
echo ""

# 部署选项
echo "🚀 DEPLOYMENT OPTIONS:"
echo "======================"
echo "1. Deploy to Vercel (Recommended for Next.js)"
echo "2. Deploy to Railway (Easy PostgreSQL + Deployment)"
echo "3. Run locally for testing"
echo "4. Manual deployment instructions"
echo ""

read -p "Select option (1-4): " deploy_option

case $deploy_option in
    1)
        echo "☁️ Deploying to Vercel..."
        
        # 检查Vercel CLI
        if ! command -v vercel &> /dev/null; then
            echo "📦 Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        echo ""
        echo "📝 Vercel Deployment Steps:"
        echo "1. Run: vercel login"
        echo "2. Run: vercel"
        echo "3. Follow prompts to link project"
        echo "4. Set environment variables in Vercel Dashboard"
        echo ""
        
        read -p "Press Enter to continue with Vercel deployment..." 
        
        # 先预览部署
        echo "🚀 Starting Vercel deployment..."
        vercel
        
        echo ""
        echo "✅ Vercel deployment initiated!"
        echo "📋 Next steps in Vercel Dashboard:"
        echo "   - Set all environment variables"
        echo "   - Configure custom domain (optional)"
        echo "   - Enable auto-deploy from Git"
        ;;
    2)
        echo "🚂 Deploying to Railway..."
        
        # 检查Railway CLI
        if ! command -v railway &> /dev/null; then
            echo "📦 Installing Railway CLI..."
            npm install -g @railway/cli
        fi
        
        echo ""
        echo "📝 Railway Deployment Steps:"
        echo "1. Run: railway login"
        echo "2. Run: railway init"
        echo "3. Run: railway up"
        echo "4. Add PostgreSQL plugin"
        echo "5. Set environment variables"
        echo ""
        
        read -p "Press Enter to continue with Railway deployment..." 
        railway up
        ;;
    3)
        echo "💻 Running locally..."
        
        # 检查环境变量
        if [ ! -f .env.local ]; then
            echo "⚠️  .env.local not found. Creating from example..."
            if [ -f .env.local.example ]; then
                cp .env.local.example .env.local
                echo "✅ Created .env.local from example"
                echo "⚠️  Please update .env.local with your actual values"
            else
                echo "❌ .env.local.example not found"
                exit 1
            fi
        fi
        
        echo "🚀 Starting development server..."
        echo "📌 Application will be available at: http://localhost:3001"
        echo "📌 API will be available at: http://localhost:3001/api/*"
        echo ""
        echo "Press Ctrl+C to stop the server"
        echo ""
        
        npm run dev
        ;;
    4)
        echo "📋 MANUAL DEPLOYMENT INSTRUCTIONS:"
        echo "=================================="
        echo ""
        echo "1. Push code to GitHub:"
        echo "   git add ."
        echo "   git commit -m 'Deploy AI Content Distributor'"
        echo "   git push origin main"
        echo ""
        echo "2. Choose hosting platform:"
        echo "   - Vercel (Recommended): https://vercel.com"
        echo "   - Railway: https://railway.app"
        echo "   - Fly.io: https://fly.io"
        echo "   - Render: https://render.com"
        echo ""
        echo "3. Connect your Git repository"
        echo ""
        echo "4. Set environment variables (see list above)"
        echo ""
        echo "5. Configure database:"
        echo "   - Production: PostgreSQL (Neon, Supabase, Railway)"
        echo "   - Update DATABASE_URL in environment"
        echo ""
        echo "6. Deploy and test"
        echo ""
        echo "7. Configure custom domain (optional)"
        echo ""
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎉 DEPLOYMENT PROCESS COMPLETE!"
echo "================================"
echo ""
echo "📋 POST-DEPLOYMENT CHECKLIST:"
echo "1. ✅ Test user registration: /auth/signup"
echo "2. ✅ Test user login: /auth/signin"
echo "3. ✅ Test free content generation (10 credits)"
echo "4. ✅ Test payment flow: /pricing"
echo "5. ✅ Test Stripe webhooks (if using payments)"
echo "6. ✅ Configure analytics (optional)"
echo "7. ✅ Set up monitoring (optional)"
echo ""
echo "🔧 TROUBLESHOOTING:"
echo "- Check Vercel/Railway logs for errors"
echo "- Verify all environment variables are set"
echo "- Test database connection"
echo "- Check Stripe webhook configuration"
echo ""
echo "📞 SUPPORT:"
echo "- Check README.md for documentation"
echo "- Review error logs in hosting platform"
echo "- Test locally first if production has issues"
echo ""
echo "🚀 Your AI Content Distributor is ready to launch!"