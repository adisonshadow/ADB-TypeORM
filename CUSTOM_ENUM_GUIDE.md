# ADBEnum 使用指南

## 概述

`ADBEnum` 是 ADB-TypeORM 为解决 TypeScript 装饰器限制而设计的自定义枚举解决方案。它完全兼容 TypeORM，支持丰富的元数据配置，并且可以与 `@Entity("__enums__")` 表进行集成。

## 核心特性

1. **完全兼容 TypeORM**：可以直接在实体字段中使用
2. **丰富的元数据支持**：支持图标、颜色、描述、排序等配置
3. **数据库持久化**：自动存储到 `__enums__` 表中
4. **类型安全**：提供完整的 TypeScript 类型支持
5. **灵活查询**：支持按标签、状态、排序等多种查询方式

## 基本用法

### 1. 创建自定义枚举

```typescript
import { ADBEnum } from 'adb-typeorm';

export const OrderStatus = ADBEnum.create({
  id: "enum-order-status-001",
  code: "order:status",
  label: "订单状态",
  description: "订单生命周期状态管理",
  values: {
    PENDING_PAYMENT: "pending_payment",
    PAID: "paid",
    PROCESSING: "processing",
    COMPLETED: "completed",
    CANCELLED: "cancelled"
  },
  items: {
    PENDING_PAYMENT: {
      label: "待支付",
      icon: "clock-circle",
      color: "#faad14",
      description: "订单已创建，等待用户支付",
      sort: 1,
      metadata: {
        timeoutMinutes: 30,
        canCancel: true
      }
    },
    PAID: {
      label: "已支付",
      icon: "check-circle",
      color: "#52c41a",
      description: "支付成功，订单确认",
      sort: 2,
      metadata: {
        autoConfirm: true,
        confirmDelayMinutes: 5
      }
    }
    // ... 其他枚举项
  }
});
```

### 2. 在实体中使用

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityInfo, ColumnInfo } from 'adb-typeorm';
import { OrderStatus, ORDER_STATUS_VALUES } from './OrderStatus';

@Entity("orders")
@EntityInfo({
  id: "entity-order-001",
  code: "business:order",
  label: "订单实体"
})
export class Order {
  @PrimaryGeneratedColumn()
  @ColumnInfo({
    id: "field-order-id-001",
    label: "订单ID"
  })
  id: number;

  // 单选枚举字段
  @Column({ 
    type: "varchar",
    length: 50,
    default: ORDER_STATUS_VALUES.PENDING_PAYMENT
  })
  @ColumnInfo({
    id: "field-order-status-001",
    label: "订单状态",
    extendType: "enum",
    enumConfig: {
      enum: OrderStatus,
      isMultiple: false,
      default: ORDER_STATUS_VALUES.PENDING_PAYMENT
    }
  })
  status: string;

  // 多选枚举字段（使用 JSON 存储）
  @Column({ 
    type: "json",
    nullable: true
  })
  @ColumnInfo({
    id: "field-order-tags-001",
    label: "订单标签",
    extendType: "enum",
    enumConfig: {
      enum: OrderStatus,
      isMultiple: true,
      default: [ORDER_STATUS_VALUES.PENDING_PAYMENT]
    }
  })
  tags?: string[];
}
```

## 高级用法

### 1. 枚举值访问

```typescript
// 获取枚举值
const pendingValue = OrderStatus.getValue('PENDING_PAYMENT'); // "pending_payment"

// 检查是否包含某个键或值
const hasKey = OrderStatus.hasKey('PAID'); // true
const hasValue = OrderStatus.hasValue('paid'); // true

// 根据值获取键
const key = OrderStatus.getKey('paid'); // "PAID"
```

### 2. 元数据查询

```typescript
// 获取枚举项配置
const config = OrderStatus.getItemConfig('PENDING_PAYMENT');
console.log(config?.label); // "待支付"
console.log(config?.color); // "#faad14"

// 获取启用的枚举项
const enabledItems = OrderStatus.getEnabledItems();

// 获取排序后的枚举项
const sortedItems = OrderStatus.getSortedItems();

// 根据标签筛选（如果在 metadata.tags 中定义了标签）
const urgentItems = OrderStatus.getItemsByTag('urgent');
```

### 3. 数据库持久化

```typescript
import { DataSource } from 'typeorm';
import { EnumMetadata, EnumMetadataService } from 'adb-typeorm';

// 初始化数据源
const dataSource = new DataSource({
  // ... 数据库配置
  entities: [EnumMetadata, Order], // 包含 EnumMetadata 实体
});

await dataSource.initialize();

// 创建服务
const enumService = new EnumMetadataService(dataSource);

// 保存 CustomEnum 到数据库
await enumService.saveCustomEnum(OrderStatus);

// 从数据库重建 CustomEnum
const rebuiltEnum = await enumService.rebuildCustomEnumByCode('order:status');
```

## 类型定义

### ADBEnum 构造选项

```typescript
interface ADBEnumOptions {
  id: string;                           // 枚举唯一标识
  code: string;                         // 枚举识别码，使用:表示层级
  label: string;                        // 枚举显示名称
  description?: string;                 // 枚举描述
  values: Record<string, string>;       // 枚举键值对映射
  items?: Record<string, EnumItemOptions>; // 枚举项元数据配置
}

interface EnumItemOptions {
  label: string;                        // 枚举项显示名称
  icon?: string;                        // 图标
  color?: string;                       // 颜色
  description?: string;                 // 描述
  sort?: number;                        // 排序权重
  disabled?: boolean;                   // 是否禁用
  metadata?: Record<string, any>;       // 自定义元数据
}
```

## 最佳实践

### 1. 命名规范

```typescript
// 推荐：使用 PascalCase 和语义化命名
export const OrderStatus = ADBEnum.create({ /* ... */ });
export const UserRole = ADBEnum.create({ /* ... */ });
export const PaymentMethod = ADBEnum.create({ /* ... */ });

// 常量导出，便于类型检查
export const ORDER_STATUS_VALUES = {
  PENDING_PAYMENT: OrderStatus.getValue('PENDING_PAYMENT')!,
  PAID: OrderStatus.getValue('PAID')!,
  // ...
} as const;
```

### 2. 错误处理

```typescript
// 验证枚举配置
const validation = OrderStatus.validate();
if (!validation.isValid) {
  console.error('枚举配置错误:', validation.errors);
}

// 安全的值访问
const safeGetValue = (key: string) => {
  if (OrderStatus.hasKey(key)) {
    return OrderStatus.getValue(key);
  }
  throw new Error(`Invalid enum key: ${key}`);
};
```

### 3. 业务逻辑集成

```typescript
// 在业务逻辑中使用枚举元数据
class OrderService {
  canCancelOrder(status: string): boolean {
    const key = OrderStatus.getKey(status);
    if (!key) return false;
    
    const config = OrderStatus.getItemConfig(key);
    return config?.metadata?.canCancel === true;
  }

  getStatusColor(status: string): string {
    const key = OrderStatus.getKey(status);
    if (!key) return '#000000';
    
    const config = OrderStatus.getItemConfig(key);
    return config?.color || '#000000';
  }
}
```

## 迁移指南

### 从传统枚举迁移

```typescript
// 之前（有装饰器错误）
@EnumInfo({ /* ... */ })
enum OrderStatus {
  PENDING = "pending",
  PAID = "paid"
}

// 现在（使用 CustomEnum）
export const OrderStatus = CustomEnum.create({
  id: "enum-order-status-001",
  code: "order:status", 
  label: "订单状态",
  values: {
    PENDING: "pending",
    PAID: "paid"
  },
  items: {
    PENDING: { label: "待处理" },
    PAID: { label: "已支付" }
  }
});
```

## 注意事项

1. **数据库配置**：确保在 DataSource 中包含 `EnumMetadata` 实体
2. **JSON 支持**：使用多选枚举时，确保数据库支持 JSON 类型
3. **缓存考虑**：ADBEnum 实例会缓存，避免重复创建相同 ID 的枚举
4. **类型安全**：使用常量导出来获得更好的类型检查支持