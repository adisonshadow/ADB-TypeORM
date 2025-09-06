import 'reflect-metadata';
import { EntityInfoOptions, METADATA_KEYS } from '../types';

/**
 * EntityInfo 装饰器
 * 为 TypeORM Entity 添加增强的元数据信息
 * 
 * @param options EntityInfo 配置选项
 * @returns 装饰器函数
 */
export function EntityInfo(options: EntityInfoOptions) {
  return function (target: any) {
    // 设置默认值
    const defaultOptions: EntityInfoOptions = {
      status: 'enabled',
      isLocked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...options
    };

    // 将元数据存储到类的原型上
    Reflect.defineMetadata(METADATA_KEYS.ENTITY_INFO, defaultOptions, target);
    
    // 也可以存储到类本身
    Reflect.defineMetadata(METADATA_KEYS.ENTITY_INFO, defaultOptions, target.prototype);
  };
}

/**
 * 获取 Entity 的 EntityInfo 元数据
 * 
 * @param target Entity 类或实例
 * @returns EntityInfo 配置或 undefined
 */
export function getEntityInfo(target: any): EntityInfoOptions | undefined {
  return Reflect.getMetadata(METADATA_KEYS.ENTITY_INFO, target) || 
         Reflect.getMetadata(METADATA_KEYS.ENTITY_INFO, target.prototype);
}

/**
 * 检查目标是否具有 EntityInfo 元数据
 * 
 * @param target Entity 类或实例
 * @returns 是否具有 EntityInfo
 */
export function hasEntityInfo(target: any): boolean {
  return Reflect.hasMetadata(METADATA_KEYS.ENTITY_INFO, target) || 
         Reflect.hasMetadata(METADATA_KEYS.ENTITY_INFO, target.prototype);
}

/**
 * 获取所有具有 EntityInfo 的实体类
 * 
 * @param entities 实体类数组
 * @returns 具有 EntityInfo 的实体信息数组
 */
export function getAllEntityInfo(entities: any[]): Array<{ entity: any; info: EntityInfoOptions }> {
  return entities
    .filter(entity => hasEntityInfo(entity))
    .map(entity => ({
      entity,
      info: getEntityInfo(entity)!
    }));
}

/**
 * 根据 code 查找实体
 * 
 * @param entities 实体类数组
 * @param code 实体代码
 * @returns 匹配的实体信息或 undefined
 */
export function getEntityByCode(entities: any[], code: string): { entity: any; info: EntityInfoOptions } | undefined {
  const entityInfo = getAllEntityInfo(entities);
  return entityInfo.find(item => item.info.code === code);
}

/**
 * 根据标签查找实体
 * 
 * @param entities 实体类数组
 * @param tag 标签
 * @returns 匹配的实体信息数组
 */
export function getEntitiesByTag(entities: any[], tag: string): Array<{ entity: any; info: EntityInfoOptions }> {
  const entityInfo = getAllEntityInfo(entities);
  return entityInfo.filter(item => item.info.tags?.includes(tag));
}

/**
 * 验证实体信息
 * 
 * @param target Entity 类
 * @returns 验证结果
 */
export function validateEntityInfo(target: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const info = getEntityInfo(target);

  if (!info) {
    return { isValid: false, errors: ['Entity is missing EntityInfo metadata'] };
  }

  // 验证必需字段
  if (!info.id) {
    errors.push('EntityInfo.id is required');
  }
  
  if (!info.code) {
    errors.push('EntityInfo.code is required');
  }
  
  if (!info.label) {
    errors.push('EntityInfo.label is required');
  }

  // 验证 code 格式
  if (info.code && !/^[a-zA-Z0-9:]+$/.test(info.code)) {
    errors.push('EntityInfo.code can only contain letters, numbers and colons');
  }

  // 验证 status
  if (info.status && !['enabled', 'disabled', 'archived'].includes(info.status)) {
    errors.push('EntityInfo.status must be enabled, disabled or archived');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
