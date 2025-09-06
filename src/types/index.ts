// ADB-TypeORM 类型定义

// EntityInfo 相关类型
export interface EntityInfoOptions {
  id: string;                    // 实体唯一标识，由设计器自动分配的短UUID
  code: string;                  // 唯一识别码，使用:表示多级，如: "user:admin:super"
  label: string;                 // 显示名称，注意：不是comment，因为TypeORM自带comment
  status?: 'enabled' | 'disabled' | 'archived';  // 状态：启用/禁用/归档，默认 enabled
  isLocked?: boolean;            // 锁定/解锁状态，默认 false
  createdAt?: Date;              // 创建时间，datetime格式，由设计器自动生成
  updatedAt?: Date;              // 更新时间，datetime格式，由设计器自动生成
  name?: string;                 // 实体名称（兼容旧版本）
  description?: string;          // 实体描述
  version?: string;              // 版本号
  tags?: string[];               // 标签数组
}

// ColumnInfo 相关类型
export interface ColumnInfoOptions {
  id: string;                    // 唯一标识，由设计器自动分配的短UUID
  label: string;                 // 字段显示名，注意：不是comment，因为TypeORM自带comment
  extendType?: string;           // 扩展类型标识，如: "media", "enum" 等
  mediaConfig?: MediaConfigOptions;  // 媒体类型配置
  enumConfig?: EnumConfigOptions;    // 枚举类型配置
}

// Media 配置类型
export interface MediaConfigOptions {
  mediaType: 'image' | 'video' | 'audio' | 'document' | 'file';
  formats: string[];
  maxSize?: number;              // MB
  isMultiple?: boolean;
  storagePath?: string;          // 存储相对路径
}

// Enum 配置类型
export interface EnumConfigOptions {
  enum: any;                     // 枚举对象引用
  isMultiple?: boolean;          // 是否支持多选，默认 false
  default?: any;                 // 默认值
}

// EnumInfo 相关类型
export interface EnumInfoOptions {
  id: string;                    // 枚举唯一标识，由设计器自动分配的短UUID
  code: string;                  // 唯一识别码，使用:表示多级
  label: string;                 // 枚举显示名称
  description?: string;           // 枚举描述
  items?: Record<string, EnumItemOptions>; // 枚举项配置映射
}

// EnumItem 相关类型
export interface EnumItemOptions {
  label: string;                 // 枚举项显示名称
  icon?: string;                 // 图标名称或路径
  color?: string;                // 颜色代码
  description?: string;          // 枚举项描述
  sort?: number;                 // 排序权重
  disabled?: boolean;            // 是否禁用
  metadata?: Record<string, any>; // 自定义元数据
}

// 扩展 TypeORM 类型
declare module 'typeorm' {
  interface EntityOptions {
    entityInfo?: EntityInfoOptions;
  }

  interface ColumnOptions {
    columnInfo?: ColumnInfoOptions;
  }
}

// 元数据键名常量
export const METADATA_KEYS = {
  ENTITY_INFO: Symbol('entityInfo'),
  COLUMN_INFO: Symbol('columnInfo'),
  ENUM_INFO: Symbol('enumInfo'),
  ENUM_ITEM: Symbol('enumItem'),
} as const;
