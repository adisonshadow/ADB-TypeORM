import { EntityInfoOptions, ColumnInfoOptions, EnumInfoOptions, EnumItemOptions } from '../types';
import { getEntityInfo, validateEntityInfo, getAllEntityInfo } from '../decorators/EntityInfo';
import { getColumnInfo, validateColumnInfo, getAllColumnInfo } from '../decorators/ColumnInfo';
import { getEnumInfo, getEnumItem, validateEnumInfo, validateEnumItem, getAllEnumItems } from '../decorators/EnumInfo';

// 导出枚举元数据服务
export { EnumMetadataService } from './EnumMetadataService';

// 导出ADB枚举类
export { ADBEnum } from './ADBEnum';

// 导出Function Calling提供器
export { 
  FunctionCallingsProvider,
  getADBFunctionCallings,
  getOpenAIFunctions,
  getClaudeTools,
  getFunctionsByCategory,
  getNamingConventions
} from './FunctionCallingsProvider';

/**
 * 实体信息服务类
 * 提供实体相关的工具函数
 */
export class EntityInfoService {
  /**
   * 获取所有实体信息
   */
  static getAllEntityInfo(entities: any[]): Array<{ entity: any; info: EntityInfoOptions }> {
    return getAllEntityInfo(entities);
  }

  /**
   * 根据代码查找实体
   */
  static getEntityByCode(entities: any[], code: string): { entity: any; info: EntityInfoOptions } | undefined {
    const entityInfo = this.getAllEntityInfo(entities);
    return entityInfo.find(item => item.info.code === code);
  }

  /**
   * 根据标签查找实体
   */
  static getEntitiesByTag(entities: any[], tag: string): Array<{ entity: any; info: EntityInfoOptions }> {
    const entityInfo = this.getAllEntityInfo(entities);
    return entityInfo.filter(item => item.info.tags?.includes(tag));
  }

  /**
   * 验证所有实体
   */
  static validateAllEntities(entities: any[]): Array<{ entity: any; result: { isValid: boolean; errors: string[] } }> {
    return entities.map(entity => ({
      entity,
      result: validateEntityInfo(entity)
    }));
  }

  /**
   * 获取实体完整信息
   */
  static getEntityFullInfo(entity: any): {
    className: string;
    tableName: string;
    entityInfo: EntityInfoOptions;
    columns: Array<{ property: string; columnInfo: ColumnInfoOptions }>;
  } | null {
    const entityInfo = getEntityInfo(entity);
    if (!entityInfo) return null;

    const columns = getAllColumnInfo(entity);
    const columnArray = Object.entries(columns).map(([property, columnInfo]) => ({
      property,
      columnInfo
    }));

    return {
      className: entity.name,
      tableName: entity.name.toLowerCase(),
      entityInfo,
      columns: columnArray
    };
  }
}

/**
 * 列信息服务类
 * 提供列相关的工具函数
 */
export class ColumnInfoService {
  /**
   * 获取实体的所有列信息
   */
  static getAllColumnInfo(entity: any): Record<string, ColumnInfoOptions> {
    return getAllColumnInfo(entity);
  }

  /**
   * 根据扩展类型获取列
   */
  static getColumnsByExtendType(entity: any, extendType: string): Array<{ property: string; info: ColumnInfoOptions }> {
    const allColumnInfo = this.getAllColumnInfo(entity);
    return Object.entries(allColumnInfo)
      .filter(([_, info]) => info.extendType === extendType)
      .map(([property, info]) => ({ property, info }));
  }

  /**
   * 获取媒体类型的列
   */
  static getMediaColumns(entity: any): Array<{ property: string; info: ColumnInfoOptions }> {
    return this.getColumnsByExtendType(entity, 'adb-media');
  }

  /**
   * 获取枚举类型的列
   */
  static getEnumColumns(entity: any): Array<{ property: string; info: ColumnInfoOptions }> {
    return this.getColumnsByExtendType(entity, 'adb-enum');
  }

  /**
   * 获取自增ID类型的列
   */
  static getAutoIncrementIdColumns(entity: any): Array<{ property: string; info: ColumnInfoOptions }> {
    return this.getColumnsByExtendType(entity, 'adb-auto-increment-id');
  }

  /**
   * 获取GUID ID类型的列
   */
  static getGuidIdColumns(entity: any): Array<{ property: string; info: ColumnInfoOptions }> {
    return this.getColumnsByExtendType(entity, 'adb-guid-id');
  }

  /**
   * 获取Snowflake ID类型的列
   */
  static getSnowflakeIdColumns(entity: any): Array<{ property: string; info: ColumnInfoOptions }> {
    return this.getColumnsByExtendType(entity, 'adb-snowflake-id');
  }

  /**
   * 验证实体的所有列信息
   */
  static validateAllColumns(entity: any): Array<{ property: string; result: { isValid: boolean; errors: string[] } }> {
    const allColumnInfo = this.getAllColumnInfo(entity);
    return Object.keys(allColumnInfo).map(property => ({
      property,
      result: validateColumnInfo(entity.prototype, property)
    }));
  }

  /**
   * 获取所有支持的类型列表
   * 包含 ADB 扩展类型和 TypeORM 原生类型
   */
  static getAllSupportedTypes(): Array<{ key: string; label: string; category: 'adb-extend' | 'typeorm-native' }> {
    const adbExtendTypes = [
      { key: 'adb-auto-increment-id', label: 'Auto Increment ID', category: 'adb-extend' as const },
      { key: 'adb-guid-id', label: 'GUID ID', category: 'adb-extend' as const },
      { key: 'adb-snowflake-id', label: 'Snowflake ID', category: 'adb-extend' as const },
      { key: 'adb-enum', label: 'ADB Enum', category: 'adb-extend' as const },
      { key: 'adb-media', label: 'ADB Media', category: 'adb-extend' as const }
    ];

    const typeormNativeTypes = [
      { key: 'varchar', label: 'String', category: 'typeorm-native' as const },
      { key: 'char', label: 'Fixed String', category: 'typeorm-native' as const },
      { key: 'text', label: 'Text', category: 'typeorm-native' as const },
      { key: 'int', label: 'Integer', category: 'typeorm-native' as const },
      { key: 'bigint', label: 'Big Integer', category: 'typeorm-native' as const },
      { key: 'smallint', label: 'Small Integer', category: 'typeorm-native' as const },
      { key: 'tinyint', label: 'Tiny Integer', category: 'typeorm-native' as const },
      { key: 'decimal', label: 'Decimal', category: 'typeorm-native' as const },
      { key: 'float', label: 'Float', category: 'typeorm-native' as const },
      { key: 'double', label: 'Double', category: 'typeorm-native' as const },
      { key: 'boolean', label: 'Boolean', category: 'typeorm-native' as const },
      { key: 'date', label: 'Date', category: 'typeorm-native' as const },
      { key: 'datetime', label: 'DateTime', category: 'typeorm-native' as const },
      { key: 'timestamp', label: 'Timestamp', category: 'typeorm-native' as const },
      { key: 'time', label: 'Time', category: 'typeorm-native' as const },
      { key: 'json', label: 'JSON', category: 'typeorm-native' as const },
      { key: 'simple-array', label: 'Simple Array', category: 'typeorm-native' as const },
      { key: 'simple-json', label: 'Simple JSON', category: 'typeorm-native' as const },
      { key: 'uuid', label: 'UUID', category: 'typeorm-native' as const },
      { key: 'enum', label: 'Enum', category: 'typeorm-native' as const },
      { key: 'blob', label: 'Blob', category: 'typeorm-native' as const },
      { key: 'binary', label: 'Binary', category: 'typeorm-native' as const },
      { key: 'varbinary', label: 'Variable Binary', category: 'typeorm-native' as const }
    ];

    return [...adbExtendTypes, ...typeormNativeTypes];
  }

  /**
   * 获取 ADB 扩展类型列表
   */
  static getADBExtendTypes(): Array<{ key: string; label: string }> {
    return this.getAllSupportedTypes()
      .filter(type => type.category === 'adb-extend')
      .map(type => ({ key: type.key, label: type.label }));
  }

  /**
   * 获取 TypeORM 原生类型列表
   */
  static getTypeORMTypes(): Array<{ key: string; label: string }> {
    return this.getAllSupportedTypes()
      .filter(type => type.category === 'typeorm-native')
      .map(type => ({ key: type.key, label: type.label }));
  }
}

/**
 * 枚举信息服务类
 * 提供枚举相关的工具函数
 */
export class EnumInfoService {
  /**
   * 获取枚举信息
   */
  static getEnumInfo(enumObject: any): EnumInfoOptions | undefined {
    return getEnumInfo(enumObject);
  }

  /**
   * 获取枚举项信息
   */
  static getEnumItem(enumObject: any, propertyKey: string | symbol): EnumItemOptions | undefined {
    return getEnumItem(enumObject, propertyKey);
  }

  /**
   * 获取枚举的所有项信息
   */
  static getAllEnumItems(enumObject: any): Array<{ key: string; value: any; item: EnumItemOptions }> {
    return getAllEnumItems(enumObject);
  }

  /**
   * 获取启用的枚举项
   */
  static getEnabledEnumItems(enumObject: any): Array<{ key: string; value: any; item: EnumItemOptions }> {
    const allItems = this.getAllEnumItems(enumObject);
    return allItems.filter(({ item }) => !item.disabled);
  }

  /**
   * 按排序权重获取枚举项
   */
  static getSortedEnumItems(enumObject: any): Array<{ key: string; value: any; item: EnumItemOptions }> {
    const allItems = this.getAllEnumItems(enumObject);
    return allItems.sort((a, b) => {
      const sortA = a.item.sort ?? 0;
      const sortB = b.item.sort ?? 0;
      return sortA - sortB;
    });
  }

  /**
   * 验证枚举信息
   */
  static validateEnumInfo(enumObject: any): { isValid: boolean; errors: string[] } {
    return validateEnumInfo(enumObject);
  }

  /**
   * 验证枚举所有项信息
   */
  static validateAllEnumItems(enumObject: any): Array<{ key: string; result: { isValid: boolean; errors: string[] } }> {
    const enumKeys = Object.keys(enumObject).filter(key => isNaN(Number(key)));
    return enumKeys.map(key => ({
      key,
      result: validateEnumItem(enumObject, key)
    }));
  }
}

/**
 * 通用工具函数
 */
export class Utils {
  /**
   * 生成短UUID
   */
  static generateShortUUID(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * 验证代码格式
   */
  static validateCodeFormat(code: string): boolean {
    return /^[a-zA-Z0-9:]+$/.test(code);
  }

  /**
   * 深度合并对象
   */
  static deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
          result[key] = this.deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    
    return result;
  }

  /**
   * 格式化错误信息
   */
  static formatErrors(errors: string[]): string {
    return errors.map((error, index) => `${index + 1}. ${error}`).join('\n');
  }
}