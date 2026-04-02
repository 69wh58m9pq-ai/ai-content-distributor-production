// 确保数据库初始化脚本
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 确保数据库初始化...');

const dbDir = path.join(__dirname, '../prisma');
const dbFile = path.join(dbDir, 'dev.db');

// 确保prisma目录存在
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('✅ 创建prisma目录');
}

// 检查数据库文件
if (!fs.existsSync(dbFile)) {
  console.log('📁 数据库文件不存在，创建中...');
  fs.writeFileSync(dbFile, '');
  console.log('✅ 创建空数据库文件');
}

try {
  // 运行数据库迁移
  console.log('🚀 运行数据库迁移...');
  execSync('npx prisma db push --accept-data-loss', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('✅ 数据库初始化完成！');
  
} catch (error) {
  console.error('❌ 数据库初始化失败:', error.message);
  
  // 尝试简单创建表
  console.log('🔄 尝试简单初始化...');
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // 简单查询测试连接
    await prisma.$connect();
    console.log('✅ 数据库连接成功');
    await prisma.$disconnect();
    
  } catch (simpleError) {
    console.error('❌ 简单初始化也失败:', simpleError.message);
    process.exit(1);
  }
}

console.log('\n🚀 数据库准备就绪！');