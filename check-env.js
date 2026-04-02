// 检查环境变量配置
console.log('检查NextAuth环境变量配置:');
console.log('==========================');

const requiredVars = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL', 
  'DATABASE_URL',
  'OPENAI_API_KEY',
  'STRIPE_SECRET_KEY'
];

// 模拟检查（实际需要在Vercel环境运行）
console.log('必需的环境变量:');
requiredVars.forEach(varName => {
  console.log(`- ${varName}: ${process.env[varName] ? '已设置' : '未设置'}`);
});

console.log('\n常见问题:');
console.log('1. NEXTAUTH_URL必须与部署域名完全匹配');
console.log('2. NEXTAUTH_SECRET必须是强随机字符串');
console.log('3. DATABASE_URL必须可访问');

console.log('\n建议的NEXTAUTH_URL:');
console.log('- 生产环境: https://ai-content-distributor-production.vercel.app');
console.log('- 开发环境: http://localhost:3000');

console.log('\n检查步骤:');
console.log('1. 登录Vercel: https://vercel.com/69wh58m9pq-ai/ai-content-distributor-production/settings/environment-variables');
console.log('2. 确认所有变量已设置');
console.log('3. 确保NEXTAUTH_URL完全匹配生产域名');