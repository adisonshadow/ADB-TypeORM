import 'reflect-metadata';
import { ColumnInfoOptions, METADATA_KEYS } from '../types';

// 用于存储每个类的列信息属性名
const COLUMN_PROPERTIES_KEY = Symbol('columnProperties');

/**
 * ColumnInfo 装饰器
 * 为 TypeORM Column 添加增强的元数据信息
 * 
 * @param options ColumnInfo 配置选项
 * @returns 装饰器函数
 */
export function ColumnInfo(options: ColumnInfoOptions) {
  return function (target: any, propertyKey: string | symbol) {
    // 将元数据存储到类的属性上
    Reflect.defineMetadata(METADATA_KEYS.COLUMN_INFO, options, target, propertyKey);
    
    // 收集属性名到类上
    const existingProperties = Reflect.getMetadata(COLUMN_PROPERTIES_KEY, target.constructor) || [];
    if (!existingProperties.includes(propertyKey)) {
      existingProperties.push(propertyKey);
      Reflect.defineMetadata(COLUMN_PROPERTIES_KEY, existingProperties, target.constructor);
    }
  };
}

/**
 * 获取 Column 的 ColumnInfo 元数据
 * 
 * @param target Entity 类或实例
 * @param propertyKey 属性名
 * @returns ColumnInfo 配置或 undefined
 */
export function getColumnInfo(target: any, propertyKey: string | symbol): ColumnInfoOptions | undefined {
  return Reflect.getMetadata(METADATA_KEYS.COLUMN_INFO, target, propertyKey);
}

/**
 * 检查目标属性是否具有 ColumnInfo 元数据
 * 
 * @param target Entity 类或实例
 * @param propertyKey 属性名
 * @returns 是否具有 ColumnInfo
 */
export function hasColumnInfo(target: any, propertyKey: string | symbol): boolean {
  return Reflect.hasMetadata(METADATA_KEYS.COLUMN_INFO, target, propertyKey);
}

/**
 * 获取所有Column的Info信息
 * 
 * @param target Entity 类
 * @returns ColumnInfo映射
 */
export function getAllColumnInfo(target: any): Record<string, ColumnInfoOptions> {
  const columnInfos: Record<string, ColumnInfoOptions> = {};
  
  // 从类上获取收集的属性名
  const properties = Reflect.getMetadata(COLUMN_PROPERTIES_KEY, target) || [];
  
  for (const property of properties) {
    const columnInfo = getColumnInfo(target.prototype, property);
    if (columnInfo) {
      columnInfos[property] = columnInfo;
    }
  }
  
  return columnInfos;
}

/**
 * 根据扩展类型获取列信息
 * 
 * @param target Entity 类
 * @param extendType 扩展类型
 * @returns 匹配的列信息数组
 */
export function getColumnsByExtendType(target: any, extendType: string): Array<{ property: string; info: ColumnInfoOptions }> {
  const allColumnInfo = getAllColumnInfo(target);
  return Object.entries(allColumnInfo)
    .filter(([_, info]) => info.extendType === extendType)
    .map(([property, info]) => ({ property, info }));
}

/**
 * 获取媒体类型的列
 * 
 * @param target Entity 类
 * @returns 媒体列信息数组
 */
export function getMediaColumns(target: any): Array<{ property: string; info: ColumnInfoOptions }> {
  return getColumnsByExtendType(target, 'adb-media');
}

/**
 * 获取枚举类型的列
 * 
 * @param target Entity 类
 * @returns 枚举列信息数组
 */
export function getEnumColumns(target: any): Array<{ property: string; info: ColumnInfoOptions }> {
return getColumnsByExtendType(target, 'adb-enum');
}

/**
 * 获取自增ID类型的列
 * 
 * @param target Entity 类
 * @returns 自增ID列信息数组
 */
export function getAutoIncrementIdColumns(target: any): Array<{ property: string; info: ColumnInfoOptions }> {
  return getColumnsByExtendType(target, 'adb-auto-increment-id');
}

/**
 * 获取GUID ID类型的列
 * 
 * @param target Entity 类
 * @returns GUID ID列信息数组
 */
export function getGuidIdColumns(target: any): Array<{ property: string; info: ColumnInfoOptions }> {
  return getColumnsByExtendType(target, 'adb-guid-id');
}

/**
 * 获取Snowflake ID类型的列
 * 
 * @param target Entity 类
 * @returns Snowflake ID列信息数组
 */
export function getSnowflakeIdColumns(target: any): Array<{ property: string; info: ColumnInfoOptions }> {
  return getColumnsByExtendType(target, 'adb-snowflake-id');
}

/**
 * 验证列信息
 * 
 * @param target Entity 类
 * @param propertyKey 属性名
 * @returns 验证结果
 */
export function validateColumnInfo(target: any, propertyKey: string | symbol): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const info = getColumnInfo(target, propertyKey);

  if (!info) {
    return { isValid: true, errors: [] }; // ColumnInfo 是可选的
  }

  // 验证必需字段
  if (!info.id) {
    errors.push('ColumnInfo.id is required');
  }
  
  if (!info.label) {
    errors.push('ColumnInfo.label is required');
  }

  // 验证扩展类型配置
  if (info.extendType === 'adb-media' && !info.mediaConfig) {
    errors.push('ADB Media type column must provide mediaConfig');
  }

  if (info.extendType === 'adb-enum' && !info.enumConfig) {
    errors.push('ADB Enum type column must provide enumConfig');
  }

  if (info.extendType === 'adb-auto-increment-id' && !info.autoIncrementIdConfig) {
    errors.push('ADB Auto-increment-id type column must provide autoIncrementIdConfig');
  }

  if (info.extendType === 'adb-guid-id' && !info.guidIdConfig) {
    errors.push('ADB Guid-id type column must provide guidIdConfig');
  }

  if (info.extendType === 'adb-snowflake-id' && !info.snowflakeIdConfig) {
    errors.push('ADB Snowflake-id type column must provide snowflakeIdConfig');
  }

  // 验证媒体配置
  if (info.mediaConfig) {
    const { mediaType, formats, maxSize } = info.mediaConfig;
    
    if (!mediaType) {
      errors.push('MediaConfig.mediaType is required');
    }
    
    if (!formats || formats.length === 0) {
      errors.push('MediaConfig.formats cannot be empty');
    }
    
    if (maxSize !== undefined && maxSize <= 0) {
      errors.push('MediaConfig.maxSize must be greater than 0');
    }
  }

  // 验证枚举配置
  if (info.enumConfig) {
    const { enum: enumRef } = info.enumConfig;
    
    if (!enumRef) {
      errors.push('EnumConfig.enum is required');
    }
  }

  // 验证自增ID配置
  if (info.autoIncrementIdConfig) {
    const { startValue, increment } = info.autoIncrementIdConfig;
    
    if (startValue !== undefined && startValue < 1) {
      errors.push('AutoIncrementIdConfig.startValue must be greater than 0');
    }
    
    if (increment !== undefined && increment < 1) {
      errors.push('AutoIncrementIdConfig.increment must be greater than 0');
    }
  }

  // 验证GUID ID配置
  if (info.guidIdConfig) {
    const { version, format } = info.guidIdConfig;
    
    if (version && !['v1', 'v4', 'v5'].includes(version)) {
      errors.push('GuidIdConfig.version must be one of: v1, v4, v5');
    }
    
    if (format && !['default', 'braced', 'binary', 'urn'].includes(format)) {
      errors.push('GuidIdConfig.format must be one of: default, braced, binary, urn');
    }
  }

  // 验证Snowflake ID配置
  if (info.snowflakeIdConfig) {
    const { machineId, datacenterId, format } = info.snowflakeIdConfig;
    
    if (machineId !== undefined && (machineId < 0 || machineId > 1023)) {
      errors.push('SnowflakeIdConfig.machineId must be between 0 and 1023');
    }
    
    if (datacenterId !== undefined && (datacenterId < 0 || datacenterId > 31)) {
      errors.push('SnowflakeIdConfig.datacenterId must be between 0 and 31');
    }
    
    if (format && !['number', 'string'].includes(format)) {
      errors.push('SnowflakeIdConfig.format must be one of: number, string');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 验证实体所有列信息
 * 
 * @param target Entity 类
 * @returns 验证结果数组
 */
export function validateAllColumnInfo(target: any): Array<{ property: string; result: { isValid: boolean; errors: string[] } }> {
  const allColumnInfo = getAllColumnInfo(target);
  return Object.keys(allColumnInfo).map(property => ({
    property,
    result: validateColumnInfo(target.prototype, property)
  }));
}
