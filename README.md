# ADB-TypeORM

基于并完全兼容TypeORM，为适配 AI 设计ORM和可视化管理ORM的需要而设计。
Based on and fully compatible with TypeORM, it is designed to meet the needs of AI-designed ORM and visual management of ORM.

## 🚀 特性

- **完全兼容 TypeORM**：保持与 TypeORM 的完全兼容性
- **增强的实体信息**：为实体添加丰富的元数据信息
- **扩展的列类型**：支持 media、enum 等扩展类型
- **高级枚举**：提供丰富的枚举元数据支持
- **AI 友好**：专为 AI 设计和代码生成优化
- **类型安全**：完整的 TypeScript 类型支持

## 📦 安装

```bash
npm install adb-typeorm typeorm reflect-metadata
```

## 🎯 快速开始

### 1. 基础实体定义

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityInfo, ColumnInfo } from 'adb-typeorm';

@Entity("users")
@EntityInfo({
  id: "user-entity-001",
  code: "user:admin:super",
  label: "用户实体",
  description: "系统用户信息实体",
  tags: ["user", "auth", "admin"]
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  @ColumnInfo({
    id: "field_username_001",
    label: "用户名"
  })
  username: string;
}
```

### 2. 媒体类型字段

```typescript
@Column({ 
  type: "varchar",
  length: 500,
  nullable: true
})
@ColumnInfo({
  id: "field_avatar_001",
  label: "用户头像",
  extendType: "media",
  mediaConfig: {
    mediaType: "image",
    formats: ["jpg", "png", "gif", "webp"],
    maxSize: 5,
    isMultiple: false,
    storagePath: "uploads/avatars"
  }
})
avatar: string;
```

### 3. 高级枚举

```typescript
import { EnumInfo, EnumItem } from 'adb-typeorm';

@EnumInfo({
  id: "enum-order-status-001",
  code: "order:status",
  label: "订单状态",
  description: "订单生命周期状态管理"
})
enum OrderStatus {
  @EnumItem({
    label: "待支付",
    icon: "clock-circle",
    color: "#faad14",
    description: "订单已创建，等待用户支付",
    sort: 1,
    metadata: {
      timeoutMinutes: 30,
      canCancel: true
    }
  })
  PENDING_PAYMENT = "pending_payment",
}
```

### 4. 枚举字段使用

```typescript
@Column({ 
  type: "enum",
  enum: OrderStatus,
  default: OrderStatus.PENDING_PAYMENT
})
@ColumnInfo({
  id: "field_order_status_001",
  label: "订单状态",
  extendType: "enum",
  enumConfig: {
    enum: OrderStatus,
    isMultiple: false,
    default: OrderStatus.PENDING_PAYMENT
  }
})
status: OrderStatus;
```

## 🛠️ API 文档

### EntityInfo 装饰器

为实体添加增强的元数据信息。

```typescript
interface EntityInfoOptions {
  id: string;                    // 实体唯一标识
  code: string;                  // 唯一识别码
  label: string;                 // 显示名称
  status?: 'enabled' | 'disabled' | 'archived';
  isLocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  name?: string;
  description?: string;
  version?: string;
  tags?: string[];
}
```

### ColumnInfo 装饰器

为列添加增强的元数据信息。

```typescript
interface ColumnInfoOptions {
  id: string;                    // 唯一标识
  label: string;                 // 字段显示名
  extendType?: string;           // 扩展类型标识
  mediaConfig?: MediaConfigOptions;
  enumConfig?: EnumConfigOptions;
}
```

### MediaConfigOptions

媒体类型配置选项。

```typescript
interface MediaConfigOptions {
  mediaType: 'image' | 'video' | 'audio' | 'document' | 'file';
  formats: string[];
  maxSize?: number;              // MB
  multiple?: boolean;
  storagePath?: string;
}
```

### EnumConfigOptions

枚举类型配置选项。

```typescript
interface EnumConfigOptions {
  enum: any;                     // 枚举对象引用
  multi?: boolean;               // 是否支持多选
  default?: any;                 // 默认值
}
```

### EnumInfo 装饰器

为枚举添加元数据信息。

```typescript
interface EnumInfoOptions {
  id: string;                    // 枚举唯一标识
  code: string;                  // 唯一识别码
  label: string;                 // 枚举显示名称
  description?: string;          // 枚举描述
}
```

### EnumItem 装饰器

为枚举项添加元数据信息。

```typescript
interface EnumItemOptions {
  label: string;                 // 枚举项显示名称
  icon?: string;                 // 图标名称或路径
  color?: string;                // 颜色代码
  description?: string;          // 枚举项描述
  sort?: number;                 // 排序权重
  disabled?: boolean;            // 是否禁用
  metadata?: Record<string, any>; // 自定义元数据
}
```

## 🔧 工具类

### EntityInfoService

提供实体相关的工具函数。

```typescript
import { EntityInfoService } from 'adb-typeorm';

// 获取所有实体信息
const entities = EntityInfoService.getAllEntityInfo([User, Order]);

// 根据代码查找实体
const userEntity = EntityInfoService.getEntityByCode([User, Order], "user:admin:super");

// 根据标签查找实体
const userEntities = EntityInfoService.getEntitiesByTag([User, Order], "user");
```

### ColumnInfoService

提供列相关的工具函数。

```typescript
import { ColumnInfoService } from 'adb-typeorm';

// 获取所有列信息
const columns = ColumnInfoService.getAllColumnInfo(User);

// 获取媒体类型的列
const mediaColumns = ColumnInfoService.getMediaColumns(User);

// 获取枚举类型的列
const enumColumns = ColumnInfoService.getEnumColumns(User);
```

### EnumInfoService

提供枚举相关的工具函数。

```typescript
import { EnumInfoService } from 'adb-typeorm';

// 获取枚举信息
const enumInfo = EnumInfoService.getEnumInfo(OrderStatus);

// 获取所有枚举项
const items = EnumInfoService.getAllEnumItems(OrderStatus);

// 获取启用的枚举项
const enabledItems = EnumInfoService.getEnabledEnumItems(OrderStatus);

// 按排序权重获取枚举项
const sortedItems = EnumInfoService.getSortedEnumItems(OrderStatus);
```

## 📝 设计理念

为了保持与 TypeORM 的完全兼容性，扩展类型通过元数据方式实现：

- **数据库层面**：使用 TypeORM 原生类型
- **业务层面**：通过 `@ColumnInfo` 的 `extendType` 和相应配置来增强功能
- **类型安全**：完整的 TypeScript 类型支持
- **迁移友好**：数据库迁移脚本正常生成

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
