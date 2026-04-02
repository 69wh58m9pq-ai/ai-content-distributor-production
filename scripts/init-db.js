// 数据库初始化脚本
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 初始化SQLite数据库...');

const dbPath = path.join(__dirname, '../prisma/dev.db');

// 检查数据库文件是否存在
if (!fs.existsSync(dbPath)) {
  console.log('创建SQLite数据库文件...');
  
  try {
    // 运行Prisma迁移
    execSync('npx prisma db push --accept-data-loss', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    console.log('✅ 数据库初始化完成！');
    
    // 创建测试用户（可选）
    console.log('\n测试数据:');
    console.log('- 邮箱: test@example.com');
    console.log('- 密码: password123');
    console.log('- 免费额度: 10次内容生成');
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ 数据库文件已存在');
}

console.log('\n🚀 应用已准备好！');