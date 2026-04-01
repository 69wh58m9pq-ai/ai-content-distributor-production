# 🚀 AI Content Distributor

**Transform one piece of content into optimized versions for multiple platforms using GPT-5**

## ✨ 功能特性

### 🎯 核心功能
- **多平台内容优化**: Twitter, LinkedIn, Blog 一键适配
- **GPT-5驱动**: 高质量内容生成
- **实时预览**: 即时查看优化结果
- **一键复制**: 快速发布到各平台

### 💰 商业模式
- **免费层**: 10次/月内容生成 (用户获取)
- **基础层**: $19/月 (无限使用)
- **专业层**: $49/月 (团队功能 + API访问)

### 🔒 用户系统
- **邮箱注册/登录**: NextAuth认证
- **使用限制**: 免费用户10次，付费用户无限
- **实时统计**: 剩余次数实时显示
- **支付集成**: Stripe全流程支付

## 🏗️ 技术栈

### 前端
- **Next.js 15**: React框架 + App Router
- **TypeScript**: 类型安全
- **Tailwind CSS**: 现代化UI
- **React Hooks**: 状态管理

### 后端
- **Next.js API Routes**: 服务器端API
- **Prisma**: 数据库ORM
- **NextAuth.js**: 用户认证
- **Stripe**: 支付处理

### 数据库
- **开发**: SQLite (本地测试)
- **生产**: PostgreSQL (推荐Vercel Postgres/Neon)

### 部署
- **Vercel**: 全球CDN + 自动部署
- **Railway**: 简单部署 + 内置PostgreSQL
- **Docker**: 容器化支持 (可选)

## 🚀 快速开始

### 本地开发
```bash
# 1. 克隆仓库
git clone https://github.com/your-username/ai-content-distributor.git
cd ai-content-distributor

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 添加你的API密钥

# 4. 初始化数据库
npx prisma db push

# 5. 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 生产部署

#### 选项A: Vercel (推荐)
1. **推送代码到GitHub**
2. **访问** https://vercel.com/new
3. **导入你的仓库**
4. **配置环境变量** (见下方清单)
5. **部署完成**

#### 选项B: Railway
1. **访问** https://railway.app/new
2. **选择"Deploy from GitHub"**
3. **添加PostgreSQL插件**
4. **配置环境变量**
5. **部署**

## 🔧 环境变量

### 必需变量
```bash
# 认证
NEXTAUTH_SECRET=你的随机密钥 (openssl rand -base64 32)
NEXTAUTH_URL=你的生产域名

# 数据库
DATABASE_URL=postgresql://用户名:密码@主机:端口/数据库名

# OpenAI
OPENAI_API_KEY=你的GPT-5 API密钥
OPENAI_BASE_URL=https://poloai.top/v1

# Stripe (测试模式)
STRIPE_SECRET_KEY=YOUR_STRIPE_TEST_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_test
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_TEST_PUBLISHABLE_KEY
```

### 生产配置
1. **Stripe生产密钥**: 从Stripe Dashboard获取
2. **自定义域名**: 在Vercel/Railway配置
3. **监控工具**: 添加Sentry/Google Analytics

## 📁 项目结构

```
ai-content-distributor/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   │   ├── auth/          # 认证API
│   │   ├── generate/      # 内容生成API
│   │   └── webhook/       # Stripe Webhook
│   ├── auth/              # 认证页面
│   ├── pricing/           # 定价页面
│   └── page.tsx           # 主页
├── components/            # React组件
│   ├── AuthProvider.tsx   # 认证Provider
│   ├── ContentDistributor.tsx # 主内容组件
│   └── UserAuth.tsx       # 用户认证组件
├── lib/                   # 工具函数
│   ├── auth.ts            # 认证配置
│   ├── openai.ts          # OpenAI客户端
│   ├── prisma.ts          # 数据库客户端
│   └── stripe.ts          # Stripe配置
├── prisma/                # 数据库配置
│   ├── schema.prisma      # 数据模型
│   └── dev.db             # SQLite数据库 (开发)
├── public/                # 静态资源
└── 部署文件
    ├── deploy.sh          # 部署脚本
    ├── check-deployment.sh # 部署检查
    ├── DEPLOY_NOW.md      # 部署指南
    └── vercel.json        # Vercel配置
```

## 💰 收入模式

### 定价策略
| 套餐 | 价格 | 功能 |
|------|------|------|
| 免费 | $0 | 10次/月，基础平台 |
| 基础 | $19/月 | 无限使用，所有平台 |
| 专业 | $49/月 | 团队功能，API访问 |

### 收入预测
- **100个免费用户** → **10%转化率** → **10个付费用户**
- **10个付费用户** × **$19** = **$190/月**
- **规模化后**: 1000用户 → $1,900/月

### 资金流向
```
用户支付 → Stripe网关 → 你的Stripe账户 → 你的银行账户
```
**费率**: 2.9% + $0.30 per transaction

## 🌍 全球部署

### 技术优势
- **Next.js**: 自动CDN分发，全球访问快
- **Vercel**: 边缘网络，100+数据中心
- **Stripe**: 支持200+国家支付
- **多语言就绪**: 架构支持i18n国际化

### 自定义域名
1. **购买域名**: Namecheap/GoDaddy
2. **配置DNS**: 指向Vercel CNAME
3. **SSL证书**: 自动签发 (Let's Encrypt)

## 🚨 故障排除

### 常见问题
1. **数据库连接失败**
   ```bash
   # 检查连接字符串
   echo $DATABASE_URL
   # 测试连接
   npx prisma db execute --stdin --url "$DATABASE_URL" <<< "SELECT 1;"
   ```

2. **Stripe支付失败**
   - 检查API密钥
   - 验证Webhook配置
   - 测试卡号: `4242 4242 4242 4242`

3. **内容生成失败**
   - 检查OpenAI API密钥
   - 验证API配额
   - 查看服务器日志

### 监控工具
- **Vercel Analytics**: 性能监控
- **Sentry**: 错误追踪
- **Stripe Dashboard**: 支付监控
- **Google Analytics**: 用户分析

## 📈 商业化路线图

### 第1阶段: MVP验证 (已完成)
- ✅ 用户认证系统
- ✅ 内容生成核心功能
- ✅ Stripe支付集成
- ✅ 多平台适配

### 第2阶段: 用户增长 (进行中)
- 🎯 生产部署
- 🎯 用户获取渠道
- 🎯 收入验证
- 🎯 用户反馈收集

### 第3阶段: 功能扩展
- 🔄 更多平台支持 (Instagram, TikTok)
- 🔄 图片生成集成
- 🔄 团队协作功能
- 🔄 API开放平台

### 第4阶段: 规模化
- 📊 企业级功能
- 📊 多语言支持
- 📊 市场扩展
- 📊 合作伙伴生态

## 🤝 贡献指南

1. **Fork仓库**
2. **创建功能分支** (`git checkout -b feature/amazing-feature`)
3. **提交更改** (`git commit -m 'Add amazing feature'`)
4. **推送到分支** (`git push origin feature/amazing-feature`)
5. **创建Pull Request**

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 📞 联系支持

- **问题反馈**: GitHub Issues
- **功能请求**: GitHub Discussions
- **商业合作**: 通过GitHub联系

---

## 🎉 开始赚钱！

你的AI Content Distributor已100%准备就绪：

1. **部署**: 通过Vercel一键部署
2. **测试**: 验证所有功能
3. **推广**: 获取第一批用户
4. **赚钱**: 开始创造收入

**立即行动，让你的AI赚钱系统上线运行！** 🚀

> 💡 提示: 查看 `DEPLOY_NOW.md` 获取详细部署步骤
> 🔧 工具: 使用 `check-deployment.sh` 检查部署准备度
> 📊 监控: 部署后设置监控和数据分析