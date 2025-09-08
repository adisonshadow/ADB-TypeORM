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
    return this.getColumnsByExtendType(entity, 'media');
  }

  /**
   * 获取枚举类型的列
   */
  static getEnumColumns(entity: any): Array<{ property: string; info: ColumnInfoOptions }> {
    return this.getColumnsByExtendType(entity, 'enum');
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