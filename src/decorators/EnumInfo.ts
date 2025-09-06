import 'reflect-metadata';
import { EnumInfoOptions, EnumItemOptions, METADATA_KEYS } from '../types';

/**
 * EnumInfo 装饰器
 * 为枚举添加增强的元数据信息
 * 
 * @param options EnumInfo 配置选项
 * @returns 装饰器函数
 */
export function EnumInfo(options: EnumInfoOptions) {
  return function (target: any) {
    // 将元数据存储到枚举对象上
    Reflect.defineMetadata(METADATA_KEYS.ENUM_INFO, options, target);
  };
}

/**
 * EnumItem 装饰器
 * @deprecated 不再推荐使用，请使用 EnumInfo 的 items 配置代替
 * 为枚举项添加增强的元数据信息
 * 
 * @param options EnumItem 配置选项
 * @returns 装饰器函数
 */
export function EnumItem(options: EnumItemOptions) {
  return function (target: any, propertyKey: string | symbol) {
    console.warn(`@EnumItem 装饰器已废弃，请在 @EnumInfo 的 items 配置中定义 ${String(propertyKey)} 的元数据`);
    // 将元数据存储到枚举项上（向后兼容）
    Reflect.defineMetadata(METADATA_KEYS.ENUM_ITEM, options, target, propertyKey);
  };
}

/**
 * 获取枚举的 EnumInfo 元数据
 * 
 * @param target 枚举对象
 * @returns EnumInfo 配置或 undefined
 */
export function getEnumInfo(target: any): EnumInfoOptions | undefined {
  return Reflect.getMetadata(METADATA_KEYS.ENUM_INFO, target);
}

/**
 * 获取枚举项的 EnumItem 元数据
 * 优先从 EnumInfo 的 items 配置中获取，如果没有则从旧的元数据中获取
 * 
 * @param target 枚举对象
 * @param propertyKey 枚举项名
 * @returns EnumItem 配置或 undefined
 */
export function getEnumItem(target: any, propertyKey: string | symbol): EnumItemOptions | undefined {
  // 首先尝试从 EnumInfo 的 items 配置中获取
  const enumInfo = getEnumInfo(target);
  if (enumInfo?.items && typeof propertyKey === 'string') {
    const itemConfig = enumInfo.items[propertyKey];
    if (itemConfig) {
      return itemConfig;
    }
  }
  
  // 如果 items 中没有，则从旧的元数据中获取（向后兼容）
  return Reflect.getMetadata(METADATA_KEYS.ENUM_ITEM, target, propertyKey);
}

/**
 * 检查枚举是否具有 EnumInfo 元数据
 * 
 * @param target 枚举对象
 * @returns 是否具有 EnumInfo
 */
export function hasEnumInfo(target: any): boolean {
  return Reflect.hasMetadata(METADATA_KEYS.ENUM_INFO, target);
}

/**
 * 检查枚举项是否具有 EnumItem 元数据
 * 
 * @param target 枚举对象
 * @param propertyKey 枚举项名
 * @returns 是否具有 EnumItem
 */
export function hasEnumItem(target: any, propertyKey: string | symbol): boolean {
  return Reflect.hasMetadata(METADATA_KEYS.ENUM_ITEM, target, propertyKey);
}

/**
 * 获取枚举的所有项信息
 * 优先从 EnumInfo 的 items 配置中获取，如果没有则从旧的元数据中获取
 * 
 * @param target 枚举对象
 * @returns 枚举项信息数组
 */
export function getAllEnumItems(target: any): Array<{ key: string; value: any; item: EnumItemOptions }> {
  const items: Array<{ key: string; value: any; item: EnumItemOptions }> = [];
  
  // 获取枚举的所有键值对
  const enumKeys = Object.keys(target).filter(key => isNaN(Number(key)));
  
  // 首先尝试从 EnumInfo 的 items 配置中获取
  const enumInfo = getEnumInfo(target);
  if (enumInfo?.items) {
    for (const key of enumKeys) {
      const itemConfig = enumInfo.items[key];
      if (itemConfig) {
        items.push({
          key,
          value: target[key],
          item: itemConfig
        });
      }
    }
    
    // 如果从 items 中获取到了数据，就直接返回
    if (items.length > 0) {
      return items;
    }
  }
  
  // 如果 items 中没有数据，则从旧的元数据中获取（向后兼容）
  for (const key of enumKeys) {
    const itemInfo = Reflect.getMetadata(METADATA_KEYS.ENUM_ITEM, target, key);
    if (itemInfo) {
      items.push({
        key,
        value: target[key],
        item: itemInfo
      });
    }
  }
  
  return items;
}

/**
 * 根据标签获取枚举项
 * 
 * @param target 枚举对象
 * @param tag 标签
 * @returns 匹配的枚举项数组
 */
export function getEnumItemsByTag(target: any, tag: string): Array<{ key: string; value: any; item: EnumItemOptions }> {
  const allItems = getAllEnumItems(target);
  return allItems.filter(({ item }) => 
    item.metadata?.tags?.includes(tag)
  );
}

/**
 * 获取启用的枚举项（未禁用的）
 * 
 * @param target 枚举对象
 * @returns 启用的枚举项数组
 */
export function getEnabledEnumItems(target: any): Array<{ key: string; value: any; item: EnumItemOptions }> {
  const allItems = getAllEnumItems(target);
  return allItems.filter(({ item }) => !item.disabled);
}

/**
 * 按排序权重获取枚举项
 * 
 * @param target 枚举对象
 * @returns 排序后的枚举项数组
 */
export function getSortedEnumItems(target: any): Array<{ key: string; value: any; item: EnumItemOptions }> {
  const allItems = getAllEnumItems(target);
  return allItems.sort((a, b) => {
    const sortA = a.item.sort ?? 0;
    const sortB = b.item.sort ?? 0;
    return sortA - sortB;
  });
}

/**
 * 验证枚举信息
 * 
 * @param target 枚举对象
 * @returns 验证结果
 */
export function validateEnumInfo(target: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const info = getEnumInfo(target);

  if (!info) {
    return { isValid: false, errors: ['Enum is missing EnumInfo metadata'] };
  }

  // 验证必需字段
  if (!info.id) {
    errors.push('EnumInfo.id is required');
  }
  
  if (!info.code) {
    errors.push('EnumInfo.code is required');
  }
  
  if (!info.label) {
    errors.push('EnumInfo.label is required');
  }

  // 验证 code 格式
  if (info.code && !/^[a-zA-Z0-9:]+$/.test(info.code)) {
    errors.push('EnumInfo.code can only contain letters, numbers and colons');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 验证枚举项信息
 * 
 * @param target 枚举对象
 * @param propertyKey 枚举项名
 * @returns 验证结果
 */
export function validateEnumItem(target: any, propertyKey: string | symbol): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const item = getEnumItem(target, propertyKey);

  if (!item) {
    return { isValid: true, errors: [] }; // EnumItem 是可选的
  }

  // 验证必需字段
  if (!item.label) {
    errors.push('EnumItem.label is required');
  }

  // 验证排序权重
  if (item.sort !== undefined && typeof item.sort !== 'number') {
    errors.push('EnumItem.sort must be a number');
  }

  // 验证禁用状态
  if (item.disabled !== undefined && typeof item.disabled !== 'boolean') {
    errors.push('EnumItem.disabled must be a boolean');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 验证枚举所有项信息
 * 
 * @param target 枚举对象
 * @returns 验证结果数组
 */
export function validateAllEnumItems(target: any): Array<{ key: string; result: { isValid: boolean; errors: string[] } }> {
  const enumKeys = Object.keys(target).filter(key => isNaN(Number(key)));
  return enumKeys.map(key => ({
    key,
    result: validateEnumItem(target, key)
  }));
}
