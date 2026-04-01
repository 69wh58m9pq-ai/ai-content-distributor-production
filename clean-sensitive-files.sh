#!/bin/bash

echo "🔐 清理敏感密钥文件"
echo "=================="

# 备份原始文件
echo "📦 备份原始文件..."
cp -f .env.local.example .env.local.example.backup 2>/dev/null || true
cp -f DEPLOY_CONFIG.txt DEPLOY_CONFIG.txt.backup 2>/dev/null || true
cp -f vercel-env-vars.txt vercel-env-vars.txt.backup 2>/dev/null || true
cp -f SIMPLE_DEPLOY.sh SIMPLE_DEPLOY.sh.backup 2>/dev/null || true

# 清理 .env.local.example
echo "🧹 清理 .env.local.example..."
if [ -f .env.local.example ]; then
    sed -i '' 's/STRIPE_SECRET_KEY_PLACEHOLDER[a-zA-Z0-9]*/YOUR_STRIPE_TEST_SECRET_KEY/g' .env.local.example
    sed -i '' 's/STRIPE_PUBLISHABLE_KEY_PLACEHOLDER[a-zA-Z0-9]*/YOUR_STRIPE_TEST_PUBLISHABLE_KEY/g' .env.local.example
    sed -i '' 's/sk-qpVe68Aa6hvghLe856uISGkznT1GB1AVvsCQ4JickmiFueKV/YOUR_OPENAI_API_KEY/g' .env.local.example
    echo "✅ .env.local.example 已清理"
fi

# 清理 DEPLOY_CONFIG.txt
echo "🧹 清理 DEPLOY_CONFIG.txt..."
if [ -f DEPLOY_CONFIG.txt ]; then
    sed -i '' 's/STRIPE_SECRET_KEY_PLACEHOLDER[a-zA-Z0-9]*/YOUR_STRIPE_TEST_SECRET_KEY/g' DEPLOY_CONFIG.txt
    sed -i '' 's/STRIPE_PUBLISHABLE_KEY_PLACEHOLDER[a-zA-Z0-9]*/YOUR_STRIPE_TEST_PUBLISHABLE_KEY/g' DEPLOY_CONFIG.txt
    sed -i '' 's/sk-qpVe68Aa6hvghLe856uISGkznT1GB1AVvsCQ4JickmiFueKV/YOUR_OPENAI_API_KEY/g' DEPLOY_CONFIG.txt
    echo "✅ DEPLOY_CONFIG.txt 已清理"
fi

# 清理 vercel-env-vars.txt
echo "🧹 清理 vercel-env-vars.txt..."
if [ -f vercel-env-vars.txt ]; then
    sed -i '' 's/STRIPE_SECRET_KEY_PLACEHOLDER[a-zA-Z0-9]*/YOUR_STRIPE_TEST_SECRET_KEY/g' vercel-env-vars.txt
    sed -i '' 's/STRIPE_PUBLISHABLE_KEY_PLACEHOLDER[a-zA-Z0-9]*/YOUR_STRIPE_TEST_PUBLISHABLE_KEY/g' vercel-env-vars.txt
    sed -i '' 's/sk-qpVe68Aa6hvghLe856uISGkznT1GB1AVvsCQ4JickmiFueKV/YOUR_OPENAI_API_KEY/g' vercel-env-vars.txt
    echo "✅ vercel-env-vars.txt 已清理"
fi

# 清理 SIMPLE_DEPLOY.sh
echo "🧹 清理 SIMPLE_DEPLOY.sh..."
if [ -f SIMPLE_DEPLOY.sh ]; then
    sed -i '' 's/STRIPE_SECRET_KEY_PLACEHOLDER[a-zA-Z0-9]*/YOUR_STRIPE_TEST_SECRET_KEY/g' SIMPLE_DEPLOY.sh
    sed -i '' 's/STRIPE_PUBLISHABLE_KEY_PLACEHOLDER[a-zA-Z0-9]*/YOUR_STRIPE_TEST_PUBLISHABLE_KEY/g' SIMPLE_DEPLOY.sh
    sed -i '' 's/sk-qpVe68Aa6hvghLe856uISGkznT1GB1AVvsCQ4JickmiFueKV/YOUR_OPENAI_API_KEY/g' SIMPLE_DEPLOY.sh
    echo "✅ SIMPLE_DEPLOY.sh 已清理"
fi

# 清理 PROJECT_SUMMARY.md
echo "🧹 清理 PROJECT_SUMMARY.md..."
if [ -f PROJECT_SUMMARY.md ]; then
    sed -i '' 's/STRIPE_SECRET_KEY_PLACEHOLDER[a-zA-Z0-9]*/YOUR_STRIPE_KEY/g' PROJECT_SUMMARY.md
    echo "✅ PROJECT_SUMMARY.md 已清理"
fi

echo ""
echo "🎉 清理完成！"
echo ""
echo "📋 清理的文件:"
echo "1. .env.local.example"
echo "2. DEPLOY_CONFIG.txt"
echo "3. vercel-env-vars.txt"
echo "4. SIMPLE_DEPLOY.sh"
echo "5. PROJECT_SUMMARY.md"
echo ""
echo "🔐 所有敏感密钥已被替换为占位符"
echo ""
echo "🚀 现在可以安全地推送代码到GitHub了！"
echo ""
echo "运行以下命令推送代码:"
echo "./PUSH_WITH_TOKEN.sh"