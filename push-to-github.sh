#!/bin/bash

echo "🚀 GitHub代码推送脚本"
echo "====================="

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
    echo "⚠️  有未提交的更改:"
    echo "$git_status"
    read -p "是否提交这些更改? (y/n): " commit_choice
    if [ "$commit_choice" = "y" ]; then
        git add .
        git commit -m "Auto-commit before GitHub push"
    fi
fi

# 获取GitHub用户名
echo ""
echo "📝 请输入GitHub信息:"
read -p "GitHub用户名: " github_username
read -p "仓库名 (默认: ai-content-distributor): " repo_name
repo_name=${repo_name:-ai-content-distributor}

# 设置远程仓库
echo ""
echo "🔗 设置远程仓库..."
if git remote | grep -q origin; then
    echo "✅ 远程仓库已存在，更新URL..."
    git remote set-url origin "https://github.com/$github_username/$repo_name.git"
else
    echo "➕ 添加远程仓库..."
    git remote add origin "https://github.com/$github_username/$repo_name.git"
fi

# 推送代码
echo ""
echo "📤 推送代码到GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 代码推送成功!"
    echo ""
    echo "🌐 仓库地址: https://github.com/$github_username/$repo_name"
    echo ""
    echo "🚀 下一步:"
    echo "1. 访问 https://vercel.com/new"
    echo "2. 点击 'Import Git Repository'"
    echo "3. 选择你的 '$repo_name' 仓库"
    echo "4. 点击 'Import' 开始部署"
    echo ""
    echo "💡 提示: 部署后记得配置环境变量 (见 DEPLOY_NOW.md)"
else
    echo ""
    echo "❌ 代码推送失败"
    echo "可能的原因:"
    echo "1. GitHub仓库不存在 - 请先创建: https://github.com/new"
    echo "2. 网络连接问题"
    echo "3. 认证问题 - 可能需要GitHub token"
    echo ""
    echo "🔧 手动解决方案:"
    echo "1. 创建仓库: https://github.com/new"
    echo "2. 手动推送:"
    echo "   git remote add origin https://github.com/$github_username/$repo_name.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
fi