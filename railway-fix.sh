#!/bin/bash

echo "🚀 Railway部署修复脚本"
echo "======================"

# 如果Railway部署失败，运行这个脚本修复常见问题

echo "1. 检查package.json..."
if grep -q '"build": "prisma generate && next build"' package.json; then
    echo "✅ 构建命令正确"
else
    echo "⚠️  修复构建命令..."
    sed -i '' 's/"build": "next build"/"build": "prisma generate && next build"/' package.json
fi

echo "2. 检查Prisma配置..."
if [ -f "prisma/schema.prisma" ]; then
    echo "✅ Prisma schema存在"
else
    echo "❌ 缺少Prisma schema"
fi

echo "3. 生成Railway配置文件..."
cat > railway.json << 'EOF'
{
    "$schema": "https://railway.app/railway.schema.json",
    "build": {
        "builder": "NIXPACKS",
        "buildCommand": "npm run build"
    },
    "deploy": {
        "startCommand": "npm start",
        "healthcheckPath": "/",
        "healthcheckTimeout": 100
    }
}
EOF
echo "✅ railway.json已创建"

echo ""
echo "🎉 修复完成！重新推送到GitHub:"
echo "git add ."
echo "git commit -m 'Fix for Railway deployment'"
echo "git push origin main"
echo ""
echo "然后Railway会自动重新部署。"