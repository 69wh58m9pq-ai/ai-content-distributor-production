#!/bin/bash

echo "🚀 GitHub代码推送脚本 (使用Token)"
echo "================================"

# 检查当前目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 不在项目根目录"
    exit 1
fi

echo "✅ 项目目录正确"

# 检查Git状态
if [ ! -d ".git" ]; then
    echo "❌ 错误: 不是Git仓库"
    exit 1
fi

echo "🔍 检查Git状态..."
git_status=$(git status --porcelain)
if [ -n "$git_status" ]; then
    echo "⚠️  有未提交的更改，自动提交..."
    git add .
    git commit -m "Auto-commit before push"
fi

# 获取GitHub Token
echo ""
echo "🔑 请输入GitHub Personal Access Token"
echo "获取地址: https://github.com/settings/tokens"
echo "需要权限: repo (完全控制仓库)"
echo ""
read -s -p "GitHub Token: " github_token
echo ""

if [ -z "$github_token" ]; then
    echo "❌ 错误: Token不能为空"
    exit 1
fi

# 设置推送URL
echo "🔗 配置推送URL..."
remote_url="https://69wh58m9pq-ai:$github_token@github.com/69wh58m9pq-ai/ai-content-distributor.git"

# 推送代码
echo "📤 推送代码到GitHub..."
echo "仓库: https://github.com/69wh58m9pq-ai/ai-content-distributor"
echo ""

git push $remote_url main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 代码推送成功!"
    echo ""
    echo "🌐 仓库地址: https://github.com/69wh58m9pq-ai/ai-content-distributor"
    echo ""
    echo "🚀 下一步操作:"
    echo "1. 访问 https://vercel.com/new"
    echo "2. 点击 'Import Git Repository'"
    echo "3. 搜索 'ai-content-distributor'"
    echo "4. 点击 'Import' 开始部署"
    echo ""
    echo "📋 部署配置已保存到: DEPLOY_CONFIG.txt"
    echo ""
    echo "💡 提示: Token已使用，建议在GitHub上撤销旧Token并生成新Token"
else
    echo ""
    echo "❌ 代码推送失败"
    echo ""
    echo "🔧 可能的原因:"
    echo "1. Token无效或权限不足"
    echo "2. 网络连接问题"
    echo "3. 仓库不存在或无权访问"
    echo ""
    echo "🛠️ 解决方案:"
    echo "1. 验证Token权限包含 'repo'"
    echo "2. 检查网络连接"
    echo "3. 确认仓库 https://github.com/69wh58m9pq-ai/ai-content-distributor 存在"
    echo ""
    echo "📞 获取帮助:"
    echo "- GitHub Token文档: https://docs.github.com/authentication"
    echo "- 查看 DEPLOY_CONFIG.txt 获取详细配置"
fi