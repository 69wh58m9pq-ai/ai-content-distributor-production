# ✅ AI Content Distributor - 部署检查清单

## 🎯 目标: 10分钟内完成生产部署

### 阶段1: GitHub仓库准备 (2分钟)
- [ ] **1.1 创建GitHub仓库**
  - 访问: https://github.com/new
  - 仓库名: `ai-content-distributor`
  - 描述: "AI-powered content distribution platform"
  - 选择: Public 或 Private
  - 点击: Create repository

- [ ] **1.2 推送代码到GitHub**
  ```bash
  # 在项目目录执行
  cd /Users/joker/.openclaw/workspace/ai-content-distributor
  
  # 设置远程仓库 (替换 YOUR_USERNAME)
  git remote add origin https://github.com/YOUR_USERNAME/ai-content-distributor.git
  git branch -M main
  git push -u origin main
  ```

### 阶段2: Vercel部署 (3分钟)
- [ ] **2.1 开始Vercel部署**
  - 访问: https://vercel.com/new
  - 点击: "Import Git Repository"
  - 选择: 你的 `ai-content-distributor` 仓库
  - 点击: "Import"

- [ ] **2.2 项目配置**
  - 项目名: `ai-content-distributor` (自动)
  - 框架: Next.js (自动检测)
  - 根目录: `/` (默认)
  - 构建命令: `npm run build` (自动)
  - 输出目录: `.next` (自动)

### 阶段3: 环境变量配置 (5分钟)
- [ ] **3.1 在Vercel添加环境变量**
  - 项目设置 → Environment Variables
  - 添加以下8个变量:

#### 必需变量:
```bash
# 1. 认证密钥 (生成: openssl rand -base64 32)
NEXTAUTH_SECRET=你的随机密钥

# 2. 生产域名 (部署后可见)
NEXTAUTH_URL=https://你的项目名.vercel.app

# 3. 数据库 (使用Vercel Postgres)
DATABASE_URL=postgresql://自动生成

# 4. OpenAI API
OPENAI_API_KEY=sk-qpVe68Aa6hvghLe856uISGkznT1GB1AVvsCQ4JickmiFueKV
OPENAI_BASE_URL=https://poloai.top/v1

# 5. Stripe测试密钥
STRIPE_SECRET_KEY=STRIPE_SECRET_KEY_PLACEHOLDER
STRIPE_WEBHOOK_SECRET=whsec_test
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=STRIPE_PUBLISHABLE_KEY_PLACEHOLDER
```

- [ ] **3.2 部署应用**
  - 点击: "Deploy"
  - 等待: 2-3分钟构建完成
  - 获取: 生产URL (如: `https://ai-content-distributor.vercel.app`)

### 阶段4: 数据库设置 (2分钟)
- [ ] **4.1 配置Vercel Postgres**
  - Vercel Dashboard → Storage → Postgres
  - 点击: "Create Database"
  - 选择: 默认配置
  - 获取: 连接字符串

- [ ] **4.2 更新DATABASE_URL**
  - 项目设置 → Environment Variables
  - 更新: `DATABASE_URL` 为新的连接字符串
  - 重新部署: 触发自动重新部署

- [ ] **4.3 运行数据库迁移**
  ```bash
  # 通过Vercel CLI或SSH运行
  npx prisma db push
  ```

### 阶段5: 功能测试 (5分钟)
- [ ] **5.1 基础功能测试**
  - 访问: `https://你的项目名.vercel.app`
  - 检查: 页面加载正常
  - 验证: UI显示正确

- [ ] **5.2 用户认证测试**
  - 注册: `/auth/signup` (创建测试账户)
  - 登录: `/auth/signin` (使用测试账户)
  - 验证: 用户会话保持

- [ ] **5.3 内容生成测试**
  - 输入: 测试文本
  - 选择: Twitter平台
  - 生成: 点击生成按钮
  - 验证: AI生成内容正常
  - 检查: 剩余次数减少 (10→9)

- [ ] **5.4 支付流程测试**
  - 访问: `/pricing`
  - 选择: Basic计划 ($19/月)
  - 支付: 使用测试卡号 `4242 4242 4242 4242`
  - 验证: 支付成功，用户升级

### 阶段6: 生产配置 (后续)
- [ ] **6.1 Stripe生产账户**
  - 注册: https://dashboard.stripe.com/register
  - 激活: 完成KYC验证
  - 获取: 生产API密钥
  - 更新: Vercel环境变量

- [ ] **6.2 自定义域名**
  - 购买: 域名 (Namecheap/GoDaddy)
  - 配置: Vercel项目设置 → Domains
  - 设置: DNS记录指向Vercel
  - 等待: SSL证书自动签发

- [ ] **6.3 监控设置**
  - 添加: Google Analytics
  - 配置: Sentry错误追踪
  - 设置: Stripe Dashboard监控
  - 启用: Vercel Analytics

### 阶段7: 商业化启动
- [ ] **7.1 用户获取**
  - 邀请: 5-10个测试用户
  - 收集: 用户反馈
  - 优化: 用户体验

- [ ] **7.2 营销推广**
  - 发布: Product Hunt
  - 分享: LinkedIn/Twitter
  - 创建: 内容营销 (博客)
  - 测试: 社交媒体广告

- [ ] **7.3 收入验证**
  - 目标: 10个付费用户 ($190/月)
  - 跟踪: 转化率数据
  - 优化: 定价策略
  - 扩展: 用户基数

## 🚨 故障排除指南

### 常见问题1: 数据库连接失败
```bash
# 检查连接字符串
echo $DATABASE_URL

# 测试连接
npx prisma db execute --stdin --url "$DATABASE_URL" <<< "SELECT 1;"

# 解决方案:
# 1. 验证DATABASE_URL格式
# 2. 检查网络连接
# 3. 确认数据库服务运行中
```

### 常见问题2: 应用构建失败
```bash
# 查看构建日志
# 在Vercel Dashboard → Deployments → 点击构建

# 常见原因:
# 1. 缺少环境变量
# 2. 依赖安装失败
# 3. TypeScript编译错误
```

### 常见问题3: Stripe支付失败
```
# 测试卡号: 4242 4242 4242 4242
# 有效期: 任意未来日期
# CVC: 任意3位数

# 检查步骤:
# 1. 验证API密钥是否正确
# 2. 检查Webhook配置
# 3. 查看Stripe Dashboard日志
```

### 常见问题4: 用户认证失败
```
# 检查:
# 1. NEXTAUTH_SECRET是否设置
# 2. NEXTAUTH_URL是否正确
# 3. 数据库用户表是否存在
```

## 📞 紧急支持

### Vercel支持
- 文档: https://vercel.com/docs
- 支持: https://vercel.com/support
- 社区: https://vercel.com/community

### Stripe支持
- 文档: https://stripe.com/docs
- 支持: https://support.stripe.com
- 状态: https://status.stripe.com

### 项目支持
- GitHub Issues: 项目仓库
- 文档: 查看 README.md 和 DEPLOY_NOW.md
- 脚本: 使用 check-deployment.sh 检查问题

## 🎉 部署成功标志

### 技术指标
- ✅ 应用可访问: `https://你的域名.vercel.app`
- ✅ 用户可注册/登录
- ✅ 内容生成正常工作
- ✅ 支付流程测试通过
- ✅ 数据库连接正常

### 商业指标
- 🎯 免费用户: 10次限制生效
- 🎯 付费升级: Stripe支付流程完整
- 🎯 收入路径: 免费→付费转化验证
- 🎯 可扩展性: 支持用户增长

## 📊 部署时间预估

| 阶段 | 任务 | 时间 | 状态 |
|------|------|------|------|
| 1 | GitHub仓库 | 2分钟 | ⏳ |
| 2 | Vercel部署 | 3分钟 | ⏳ |
| 3 | 环境变量 | 5分钟 | ⏳ |
| 4 | 数据库 | 2分钟 | ⏳ |
| 5 | 功能测试 | 5分钟 | ⏳ |
| **总计** | **完整部署** | **17分钟** | **⏳** |

## 🏆 完成奖励

完成所有检查项后，你的AI Content Distributor将:
- ✅ 全球可访问
- ✅ 开始创造收入
- ✅ 验证商业模式
- ✅ 开启AI赚钱系统

**立即开始部署，让你的AI赚钱梦想成真！** 🚀