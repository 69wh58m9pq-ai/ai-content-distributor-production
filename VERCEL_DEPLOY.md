# Vercel 部署指南

## 步骤1：导入仓库
1. 访问 https://vercel.com/new
2. 点击 "Import Git Repository"
3. 选择：`69wh58m9pq-ai/ai-content-distributor-production`
4. 点击 "Import"

## 步骤2：配置项目
- 项目名称：`ai-content-distributor`（自动）
- 框架：Next.js（自动检测）
- 根目录：`/`（默认）

## 步骤3：环境变量（Project → Settings → Environment Variables）
```
OPENAI_API_KEY=sk-qpVe68Aa6hvghLe856uISGkznT1GB1AVvsCQ4JickmiFueKV
OPENAI_BASE_URL=https://poloai.top/v1
NEXTAUTH_SECRET=Y0Yk5hKRgQQeOUq5Xq1Lw0SF361MWD9B0eGeDxh5Rgo=
NEXTAUTH_URL=https://你的-vercel-域名.vercel.app
STRIPE_SECRET_KEY=sk_test_4eC39HqLyjWDarjtT1zdp7dc
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_TYooMQauvdEDq54NiTphI7jx
```

## 步骤4：数据库（Vercel Postgres）
1. Vercel Dashboard → Storage → Postgres
2. 创建新数据库
3. 自动注入 `POSTGRES_URL` 环境变量
4. 重命名为 `DATABASE_URL`

## 步骤5：部署
1. 点击 "Deploy"
2. 等待构建完成（约3-5分钟）
3. 访问分配的域名

## 步骤6：初始化数据库
部署成功后，在Vercel项目的Deployment中：
1. 点击最新部署
2. 点击 "Run Command"
3. 输入：`npx prisma db push`
4. 执行初始化数据库

## 步骤7：Stripe Webhook
1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://你的-vercel-域名.vercel.app/api/webhook`
3. 订阅事件: `checkout.session.completed`
4. 复制Signing secret → 添加到Vercel环境变量：`STRIPE_WEBHOOK_SECRET`

## 验证部署
1. 访问应用：注册账号
2. 使用10次免费额度生成内容
3. 测试付费流程（测试卡：4242 4242 4242 4242）
4. 验证用户等级和积分更新