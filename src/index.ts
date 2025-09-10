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

// 导入所有模块用于默认导出
import { EntityInfo } from './decorators/EntityInfo';
import { ColumnInfo } from './decorators/ColumnInfo';
import { EnumInfo } from './decorators/EnumInfo';
import { EnumMetadata } from './entities';
import { 
  EntityInfoService, 
  ColumnInfoService, 
  EnumInfoService, 
  EnumMetadataService, 
  ADBEnum, 
  Utils,
  FunctionCallingsProvider,
  getADBFunctionCallings,
  getOpenAIFunctions,
  getClaudeTools,
  getFunctionsByCategory,
  getNamingConventions
} from './utils';

// 默认导出
export default {
  // 装饰器
  EntityInfo,
  ColumnInfo,
  EnumInfo,
  
  // 实体
  EnumMetadata,
  
  // 工具类
  EntityInfoService,
  ColumnInfoService,
  EnumInfoService,
  EnumMetadataService,
  ADBEnum,
  Utils,
  
  // Function Calling 支持
  FunctionCallingsProvider,
  getADBFunctionCallings,
  getOpenAIFunctions,
  getClaudeTools,
  getFunctionsByCategory,
  getNamingConventions,
};
