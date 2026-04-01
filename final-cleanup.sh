#!/bin/bash

echo "🔐 最终彻底清理 - 移除所有测试密钥"
echo "=================================="

# 创建清理分支
echo "🌿 创建清理分支..."
git checkout -b clean-deploy 2>/dev/null || git checkout clean-deploy

echo "🧹 开始清理所有文件..."

# 1. 清理 .env.local (如果存在)
if [ -f .env.local ]; then
    echo "清理 .env.local..."
    # 创建新的.env.local，只保留模板
    cat > .env.local << 'EOF'
# 🚀 AI Content Distributor - 环境变量
# 生产环境请替换为真实密钥

# 认证
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# 数据库
DATABASE_URL=file:./dev.db

# OpenAI API (使用您自己的密钥)
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_BASE_URL=https://api.openai.com/v1

# Stripe (测试模式 - 从Stripe Dashboard获取)
STRIPE_SECRET_KEY=your-stripe-test-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
EOF
    echo "✅ .env.local 已清理"
fi

# 2. 清理 lib/stripe.ts
echo "清理 lib/stripe.ts..."
if [ -f lib/stripe.ts ]; then
    # 完全移除硬编码的测试密钥，只使用环境变量
    sed -i '' "s/process.env.STRIPE_SECRET_KEY || 'STRIPE_SECRET_KEY_PLACEHOLDER[^']*'/process.env.STRIPE_SECRET_KEY || ''/" lib/stripe.ts
    # 添加明确的注释
    sed -i '' "1i\\
// 重要: Stripe密钥必须通过环境变量 STRIPE_SECRET_KEY 提供\\
// 生产环境: 在Vercel/Railway设置环境变量\\
// 开发环境: 在 .env.local 中设置" lib/stripe.ts
    echo "✅ lib/stripe.ts 已清理"
fi

# 3. 清理所有文档文件
echo "清理文档文件..."

# DEPLOY_CONFIG.txt
if [ -f DEPLOY_CONFIG.txt ]; then
    sed -i '' 's/STRIPE_SECRET_KEY_PLACEHOLDER[a-zA-Z0-9]*/YOUR_STRIPE_TEST_SECRET_KEY/g' DEPLOY_CONFIG.txt
    sed -i '' 's/STRIPE_PUBLISHABLE_KEY_PLACEHOLDER[a-zA-Z0-9]*/YOUR_STRIPE_TEST_PUBLISHABLE_KEY/g' DEPLOY_CONFIG.txt
    sed -i '' 's/sk-qpVe68Aa6hvghLe856uISGkznT1GB1AVvsCQ4JickmiFueKV/YOUR_OPENAI_API_KEY/g' DEPLOY_CONFIG.txt
    echo "✅ DEPLOY_CONFIG.txt 已清理"
fi

# DEPLOY_NOW.md
if [ -f DEPLOY_NOW.md ]; then
    sed -i '' 's/STRIPE_SECRET_KEY_PLACEHOLDER[a-zA-Z0-9]*/YOUR_STRIPE_TEST_SECRET_KEY/g' DEPLOY_NOW.md
    sed -i '' 's/STRIPE_PUBLISHABLE_KEY_PLACEHOLDER[a-zA-Z0-9]*/YOUR_STRIPE_TEST_PUBLISHABLE_KEY/g' DEPLOY_NOW.md
    sed -i '' 's/sk-qpVe68Aa6hvghLe856uISGkznT1GB1AVvsCQ4JickmiFueKV/YOUR_OPENAI_API_KEY/g' DEPLOY_NOW.md
    echo "✅ DEPLOY_NOW.md 已清理"
fi

# README.md
if [ -f README.md ]; then
    sed -i '' 's/STRIPE_SECRET_KEY_PLACEHOLDER[a-zA-Z0-9]*/YOUR_STRIPE_TEST_SECRET_KEY/g' README.md
    sed -i '' 's/STRIPE_PUBLISHABLE_KEY_PLACEHOLDER[a-zA-Z0-9]*/YOUR_STRIPE_TEST_PUBLISHABLE_KEY/g' README.md
    sed -i '' 's/sk-qpVe68Aa6hvghLe856uISGkznT1GB1AVvsCQ4JickmiFueKV/YOUR_OPENAI_API_KEY/g' README.md
    echo "✅ README.md 已清理"
fi

# 4. 清理其他可能包含密钥的文件
echo "检查其他文件..."

# PROJECT_SUMMARY.md
if [ -f PROJECT_SUMMARY.md ]; then
    sed -i '' 's/STRIPE_SECRET_KEY_PLACEHOLDER[a-zA-Z0-9]*/STRIPE_KEY_PLACEHOLDER/g' PROJECT_SUMMARY.md
    echo "✅ PROJECT_SUMMARY.md 已清理"
fi

# vercel-env-vars.txt
if [ -f vercel-env-vars.txt ]; then
    sed -i '' 's/STRIPE_SECRET_KEY_PLACEHOLDER[a-zA-Z0-9]*/YOUR_STRIPE_TEST_SECRET_KEY/g' vercel-env-vars.txt
    sed -i '' 's/STRIPE_PUBLISHABLE_KEY_PLACEHOLDER[a-zA-Z0-9]*/YOUR_STRIPE_TEST_PUBLISHABLE_KEY/g' vercel-env-vars.txt
    echo "✅ vercel-env-vars.txt 已清理"
fi

# SIMPLE_DEPLOY.sh
if [ -f SIMPLE_DEPLOY.sh ]; then
    sed -i '' 's/STRIPE_SECRET_KEY_PLACEHOLDER[a-zA-Z0-9]*/YOUR_STRIPE_TEST_SECRET_KEY/g' SIMPLE_DEPLOY.sh
    sed -i '' 's/STRIPE_PUBLISHABLE_KEY_PLACEHOLDER[a-zA-Z0-9]*/YOUR_STRIPE_TEST_PUBLISHABLE_KEY/g' SIMPLE_DEPLOY.sh
    echo "✅ SIMPLE_DEPLOY.sh 已清理"
fi

echo ""
echo "🔍 验证清理结果..."
echo "检查是否还有硬编码的测试密钥:"
grep -r "STRIPE_SECRET_KEY_PLACEHOLDER" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.md" --include="*.txt" --include="*.sh" . 2>/dev/null | grep -v node_modules | grep -v ".next" || echo "✅ 未找到硬编码的测试密钥"

echo ""
echo "🎉 彻底清理完成！"
echo ""
echo "📋 已清理的文件:"
echo "1. .env.local - 替换为模板"
echo "2. lib/stripe.ts - 移除硬编码密钥"
echo "3. 所有文档文件 - 替换为占位符"
echo ""
echo "🚀 现在可以安全推送了！"
echo ""
echo "运行以下命令推送清理后的代码:"
echo "git add ."
echo "git commit -m '彻底移除所有硬编码测试密钥'"
echo "git push origin clean-deploy"
echo ""
echo "或者合并到main分支:"
echo "git checkout main"
echo "git merge clean-deploy"
echo "git push origin main"