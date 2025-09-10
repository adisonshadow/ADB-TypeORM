#!/usr/bin/env node

/**
 * 发布前检查脚本
 * 确保所有必要的文件都存在且构建正常
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 开始发布前检查...\n');

// 检查必要文件
const requiredFiles = [
  'package.json',
  'README.md',
  'LICENSE',
  'dist/index.js',
  'dist/index.d.ts',
  '.npmignore'
];

console.log('📁 检查必要文件...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.error(`  ❌ ${file} 不存在`);
    process.exit(1);
  }
});

// 检查构建产物
console.log('\n🔨 检查构建产物...');
const distFiles = [
  'dist/index.js',
  'dist/index.d.ts',
  'dist/decorators/index.js',
  'dist/decorators/index.d.ts',
  'dist/entities/index.js',
  'dist/entities/index.d.ts',
  'dist/utils/index.js',
  'dist/utils/index.d.ts',
  'dist/types/index.js',
  'dist/types/index.d.ts'
];

distFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.error(`  ❌ ${file} 不存在`);
    process.exit(1);
  }
});

// 运行测试
console.log('\n🧪 运行测试...');
try {
  execSync('npm test', { stdio: 'inherit' });
  console.log('  ✅ 所有测试通过');
} catch (error) {
  console.error('  ❌ 测试失败');
  process.exit(1);
}

// 运行构建
console.log('\n🔨 运行构建...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('  ✅ 构建成功');
} catch (error) {
  console.error('  ❌ 构建失败');
  process.exit(1);
}

// 检查包大小
console.log('\n📦 检查包大小...');
try {
  const result = execSync('npm pack --dry-run', { encoding: 'utf8' });
  const lines = result.split('\n');
  const sizeLine = lines.find(line => line.includes('tarball'));
  if (sizeLine) {
    console.log(`  📊 ${sizeLine}`);
  }
} catch (error) {
  console.error('  ❌ 包大小检查失败');
}

// 检查 package.json 版本
console.log('\n📋 检查版本信息...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log(`  📦 包名: ${packageJson.name}`);
console.log(`  🏷️  版本: ${packageJson.version}`);
console.log(`  📝 描述: ${packageJson.description}`);
console.log(`  👤 作者: ${packageJson.author}`);
console.log(`  📄 许可证: ${packageJson.license}`);

// 检查仓库信息
if (packageJson.repository && packageJson.repository.url) {
  if (packageJson.repository.url.includes('your-actual-username')) {
    console.log('  ⚠️  警告: 请更新 package.json 中的仓库 URL');
  } else {
    console.log(`  🔗 仓库: ${packageJson.repository.url}`);
  }
}

console.log('\n✅ 发布前检查完成！');
console.log('\n📋 发布步骤:');
console.log('1. 更新 package.json 中的仓库 URL');
console.log('2. 登录 npm: npm login');
console.log('3. 发布: npm publish');
console.log('4. 验证: npm view adb-typeorm');
