// ADB-TypeORM 主入口文件

// 导入类型定义
export * from './types';

// 导入装饰器
export * from './decorators/EntityInfo';
export * from './decorators/ColumnInfo';
export * from './decorators/EnumInfo';

// 导入实体
export * from './entities';

// 导入工具类
export * from './utils';

// 重新导出 TypeORM 的核心装饰器，确保兼容性
export { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// 默认导出
export default {
  // 装饰器
  EntityInfo: require('./decorators/EntityInfo').EntityInfo,
  ColumnInfo: require('./decorators/ColumnInfo').ColumnInfo,
  EnumInfo: require('./decorators/EnumInfo').EnumInfo,
  // EnumItem: 已废弃，不再在默认导出中包含
  
  // 实体
  EnumMetadata: require('./entities').EnumMetadata,
  
  // 工具类
  EntityInfoService: require('./utils').EntityInfoService,
  ColumnInfoService: require('./utils').ColumnInfoService,
  EnumInfoService: require('./utils').EnumInfoService,
  EnumMetadataService: require('./utils').EnumMetadataService,
  ADBEnum: require('./utils').ADBEnum,
  Utils: require('./utils').Utils,
};
