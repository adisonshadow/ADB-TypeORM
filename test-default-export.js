// 测试默认导出
const ADBTypeORM = require('./dist/index.js');

console.log('✅ 默认导出测试');
console.log('ADBTypeORM:', typeof ADBTypeORM);
console.log('ADBTypeORM.default:', typeof ADBTypeORM.default);

if (ADBTypeORM.default) {
  console.log('✅ 默认导出存在');
  console.log('EntityInfo:', typeof ADBTypeORM.default.EntityInfo);
  console.log('ColumnInfo:', typeof ADBTypeORM.default.ColumnInfo);
  console.log('ADBEnum:', typeof ADBTypeORM.default.ADBEnum);
} else {
  console.log('❌ 默认导出不存在');
}

// 测试命名导出
console.log('\n✅ 命名导出测试');
console.log('EntityInfo:', typeof ADBTypeORM.EntityInfo);
console.log('ColumnInfo:', typeof ADBTypeORM.ColumnInfo);
console.log('ADBEnum:', typeof ADBTypeORM.ADBEnum);
