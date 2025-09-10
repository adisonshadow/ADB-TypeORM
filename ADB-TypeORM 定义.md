# ADB-TypeORM 定义

基于并完全兼容 TypeORM，为适配 AI 设计和便捷管理的需要而设计。

## 1. 扩展 Entity Info

### @EntityInfo 装饰器定义

```typescript
interface EntityInfoOptions {
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
```

- status 状态管理
  - **enabled**: 启用状态，实体正常使用
  - **disabled**: 禁用状态，实体暂时不可用
  - **archived**: 归档状态，实体已废弃但保留历史数据

- isLocked 锁定机制
  - **isLocked: true**: 实体被锁定，不允许修改
  - **isLocked: false**: 实体未锁定，可以正常编辑


### 使用示例

```typescript 
  @Entity("users") // 映射到 users 表
  @EntityInfo({
    id: "user-entity-001",
    code: "user:admin:super",
    label: "用户实体",
    description: "系统用户信息实体",
    version: "1.0.0",
    tags: ["user", "auth", "admin"]
  })
  export class User {
    @PrimaryGeneratedColumn() // 自增主键
    @ColumnInfo({
      id: "field_id_001",
      label: "主键ID"
    })
    id!: number;

    @Column({ length: 50, unique: true }) // 字符串字段，长度50，唯一
    @ColumnInfo({
      id: "field_username_001",
      label: "用户名"
    })
    username!: string;

    @Column({ type: "int", default: 0 }) // 整数字段，默认值0
    @ColumnInfo({
      id: "field_age_001",
      label: "年龄"
    })
    age!: number;
  }

```

## 2、 列（字段）信息扩展

### @ColumnInfo 装饰器定义

```typescript
interface ColumnInfoOptions {
  id: string;                 // 唯一标识，由设计器自动分配的短UUID
  label: string;              // 字段显示名，注意：不是comment，因为TypeORM自带comment
  extendType?: string;        // 扩展类型标识，如: "adb-media", "adb-enum" 等
  mediaConfig?: MediaConfigOptions;  // 媒体类型配置
  enumConfig?: EnumConfigOptions;    // 枚举类型配置
}
```

### 使用示例

```typescript 
   
   @ColumnInfo({ 
      id: "field_username_001",
      label: "用户名"
   })
   @Column({ length: 50, unique: true })
   username!: string;

```

## 3、 列（字段）的 type 扩展

> **设计理念**: 为了保持与TypeORM的完全兼容性，扩展类型通过元数据方式实现。数据库层面使用TypeORM原生类型，业务层面通过`@ColumnInfo`的`extendType`和相应配置来增强功能。

###  adb-media

```typescript
interface MediaConfigOptions {
  mediaType: 'image' | 'video' | 'audio' | 'document' | 'file';
  formats: string[];
  maxSize?: number; // MB
  isMultiple?: boolean;
  storagePath?: string; // 存储相对路径
}
```

- `mediaType`: 媒体类型，必须为以下五种之一：
  - `image`: 图片
  - `video`: 视频
  - `audio`: 音频
  - `document`: 文档
  - `file`: 文件
- `formats`: 允许的文件格式数组(不带.)，必须指定且不能为空数组
- `maxSize`: 最大文件大小限制 (MB)，必须大于0
- `isMultiple`: 是否允许多个媒体文件
- `storagePath`: 存储相对路径

###  adb-enum

```typescript
interface EnumConfigOptions {
  enum: any;                    // 枚举对象引用
  isMultiple?: boolean;         // 是否支持多选，默认 false
  default?: any;                // 默认值
}
```

- `enum`: 枚举对象引用，必须引用已定义的高级枚举
- `isMultiple`: 是否支持多选，默认 false
  - `false`: 单选模式，存储单个枚举值
  - `true`: 多选模式，存储枚举值数组
- `default`: 默认值
  - 单选模式：单个枚举值
  - 多选模式：枚举值数组

###  adb-auto-increment-id

```typescript
interface AutoIncrementIdConfigOptions {
  startValue?: number;           // 起始值，默认 1
  increment?: number;            // 增量，默认 1
  sequenceName?: string;         // 序列名称（PostgreSQL）
  isPrimaryKey?: boolean;        // 是否为主键，默认 true
  description?: string;          // 描述信息
}
```

- `startValue`: 自增起始值，必须大于0，默认 1
- `increment`: 自增步长，必须大于0，默认 1
- `sequenceName`: 序列名称（PostgreSQL数据库专用）
- `isPrimaryKey`: 是否为主键，默认 true
- `description`: 描述信息

###  adb-guid-id

```typescript
interface GuidIdConfigOptions {
  version?: 'v1' | 'v4' | 'v5';  // GUID版本，默认 v4
  format?: 'default' | 'braced' | 'binary' | 'urn';  // 格式，默认 default
  isPrimaryKey?: boolean;        // 是否为主键，默认 true
  description?: string;          // 描述信息
  generateOnInsert?: boolean;    // 插入时自动生成，默认 true
}
```

- `version`: GUID版本
  - `v1`: 基于时间戳的GUID
  - `v4`: 随机GUID（推荐）
  - `v5`: 基于命名空间的GUID
- `format`: GUID格式
  - `default`: 标准格式 (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
  - `braced`: 大括号格式 ({xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx})
  - `binary`: 二进制格式
  - `urn`: URN格式 (urn:uuid:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
- `isPrimaryKey`: 是否为主键，默认 true
- `description`: 描述信息
- `generateOnInsert`: 插入时自动生成GUID，默认 true

###  adb-snowflake-id

```typescript
interface SnowflakeIdConfigOptions {
  machineId?: number;            // 机器ID，范围 0-1023，默认 0
  datacenterId?: number;         // 数据中心ID，范围 0-31，默认 0
  epoch?: number;                // 起始时间戳（毫秒），默认 2020-01-01 00:00:00 UTC
  isPrimaryKey?: boolean;        // 是否为主键，默认 true
  description?: string;          // 描述信息
  generateOnInsert?: boolean;    // 插入时自动生成，默认 true
  format?: 'number' | 'string';  // 输出格式，默认 number
}
```

- `machineId`: 机器ID，范围 0-1023，用于区分不同机器，默认 0
- `datacenterId`: 数据中心ID，范围 0-31，用于区分不同数据中心，默认 0
- `epoch`: 起始时间戳（毫秒），用于计算相对时间，默认 2020-01-01 00:00:00 UTC
- `isPrimaryKey`: 是否为主键，默认 true
- `description`: 描述信息
- `generateOnInsert`: 插入时自动生成Snowflake ID，默认 true
- `format`: 输出格式
  - `number`: 数字格式（推荐，性能更好）
  - `string`: 字符串格式（便于调试和传输）

**示例**:

#### 用户头像字段
```typescript
@Column({ 
  type: "varchar",
  length: 500,
  nullable: true
})
@ColumnInfo({
  id: "field_avatar_001",
  label: "用户头像",
  extendType: "adb-media",
  mediaConfig: {
    mediaType: "image",
    formats: ["jpg", "png", "gif", "webp"],
    maxSize: 5,
    isMultiple: false,
    storagePath: "uploads/avatars"
  }
})
avatar!: string;
```

#### 产品图片字段（多文件media）
```typescript
@Column({ 
  type: "simple-array", // "json" 也可以，为了减少AI模型的思考，暂强制为 simple-array
  nullable: true
})
@ColumnInfo({
  id: "1b4e6g1h1a3b5s1t",
  label: "产品图片",
  extendType: "adb-media",
  mediaConfig: {
    mediaType: "image",
    formats: ["jpg", "png", "webp"],
    maxSize: 10,
    isMultiple: true,
    storagePath: "uploads/products"
  }
})
productImages!: string[];
```

#### 单选枚举字段
```typescript
@Column({ 
  type: "enum",
  enum: OrderStatus,
  default: OrderStatus.PENDING_PAYMENT
})
@ColumnInfo({
  id: "2b3e6g1h1a3b5s1t",
  label: "订单状态",
  extendType: "adb-enum",
  enumConfig: {
    enum: OrderStatus,
    isMultiple: false,
    default: OrderStatus.PENDING_PAYMENT
  }
})
status!: string;
```

#### 多选枚举字段
```typescript
@Column({ 
  type: "simple-array", // "json" 也可以，为了减少AI模型的思考，暂强制为 simple-array
  enum: OrderStatus,
  default: [OrderStatus.PENDING_PAYMENT]
})
@ColumnInfo({
  id: "457e6g1h1a3b5s1t",
  label: "订单状态集合",
  extendType: "adb-enum",
  enumConfig: {
    enum: OrderStatus,
    isMultiple: true,
    default: [OrderStatus.PENDING_PAYMENT]
  }
})
statuses!: OrderStatus[];
```

#### 自增ID字段
```typescript
@Column({ 
  type: "int",
  generated: true
})
@ColumnInfo({
  id: "field_user_id_001",
  label: "用户ID",
  extendType: "adb-auto-increment-id",
  autoIncrementIdConfig: {
    startValue: 1000,
    increment: 1,
    isPrimaryKey: true,
    description: "用户唯一标识，从1000开始自增"
  }
})
id!: number;
```

#### GUID ID字段
```typescript
@Column({ 
  type: "varchar",
  length: 36,
  unique: true
})
@ColumnInfo({
  id: "field_user_uuid_001",
  label: "用户UUID",
  extendType: "adb-guid-id",
  guidIdConfig: {
    version: "v4",
    format: "default",
    isPrimaryKey: true,
    generateOnInsert: true,
    description: "用户全局唯一标识符"
  }
})
uuid!: string;
```

#### 非主键的自增ID字段
```typescript
@Column({ 
  type: "int",
  generated: true
})
@ColumnInfo({
  id: "field_order_sequence_001",
  label: "订单序号",
  extendType: "adb-auto-increment-id",
  autoIncrementIdConfig: {
    startValue: 1,
    increment: 1,
    isPrimaryKey: false,
    description: "订单在用户维度的序号"
  }
})
orderSequence!: number;
```

#### Snowflake ID字段
```typescript
@Column({ 
  type: "bigint",
  unique: true
})
@ColumnInfo({
  id: "field_snowflake_id_001",
  label: "Snowflake ID",
  extendType: "adb-snowflake-id",
  snowflakeIdConfig: {
    machineId: 1,
    datacenterId: 0,
    isPrimaryKey: true,
    format: "number",
    generateOnInsert: true,
    description: "分布式唯一ID，包含时间信息"
  }
})
snowflakeId!: number;
```

#### 字符串格式的Snowflake ID
```typescript
@Column({ 
  type: "varchar",
  length: 20,
  unique: true
})
@ColumnInfo({
  id: "field_snowflake_str_001",
  label: "Snowflake ID字符串",
  extendType: "adb-snowflake-id",
  snowflakeIdConfig: {
    machineId: 2,
    datacenterId: 1,
    isPrimaryKey: false,
    format: "string",
    generateOnInsert: true,
    description: "字符串格式的Snowflake ID，便于调试"
  }
})
snowflakeIdStr!: string;
```

#### 自定义起始时间的Snowflake ID
```typescript
@Column({ 
  type: "bigint",
  unique: true
})
@ColumnInfo({
  id: "field_custom_snowflake_001",
  label: "自定义Snowflake ID",
  extendType: "adb-snowflake-id",
  snowflakeIdConfig: {
    machineId: 10,
    datacenterId: 2,
    epoch: 1640995200000, // 2022-01-01 00:00:00 UTC
    isPrimaryKey: false,
    format: "number",
    generateOnInsert: true,
    description: "从2022年开始的Snowflake ID"
  }
})
customSnowflakeId!: number;
```

## 4、 ADB 增强枚举

ADB 增强枚举使用 `ADBEnum.create()` 方法创建，提供了丰富的元数据支持和类型安全保证。与传统的 TypeScript 枚举相比，ADBEnum 支持动态属性访问、元数据管理和数据库持久化。

### ADBEnum 类特性

- **类型安全**：通过类型断言提供完整的 TypeScript 支持
- **动态属性**：支持通过索引签名访问枚举值
- **元数据管理**：为每个枚举项提供丰富的配置信息
- **数据库兼容**：与 TypeORM 完全兼容
- **实例缓存**：同一配置的枚举会复用实例

### ADBEnum 接口定义

```typescript
  interface EnumInfoOptions {
    id: string;                    // 枚举唯一标识，由设计器自动分配的短UUID
    code: string;                  // 唯一识别码，使用:表示多级
    label: string;                 // 枚举显示名称
    description?: string;          // 枚举描述
    items?: Record<string, EnumItemOptions>; // 枚举项配置映射
    // version?: string;              // 版本号 为减少AI模型的思考，暂移除
  }

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

### 使用示例

### ADBEnum 创建方法

```typescript
import { ADBEnum } from 'adb-typeorm';

// 创建 ADB 增强枚举
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
    },
    PROCESSING: {
      label: "处理中",
      icon: "loading",
      color: "#1890ff", 
      description: "订单正在处理中",
      sort: 3,
      metadata: {
        estimatedHours: 2,
        canRefund: false
      }
    }
  }
}) as ADBEnum & {
  readonly PENDING_PAYMENT: string;
  readonly PAID: string;
  readonly PROCESSING: string;
  readonly COMPLETED: string;
  readonly CANCELLED: string;
};

// 使用枚举
console.log(OrderStatus.PENDING_PAYMENT); // "pending_payment"
console.log(OrderStatus.getItemConfig('PENDING_PAYMENT')); // 获取元数据
console.log(OrderStatus.getValue('PAID')); // "paid"
console.log(OrderStatus.getEnabledItems()); // 获取所有启用的枚举项
```

#### Column中引用 ADB增强枚举的示例

```typescript
@Entity("orders")
@EntityInfo({
  id: "order-entity-001",
  code: "order:business:transaction",
  label: "订单实体",
  description: "订单业务实体",
  tags: ["order", "business", "transaction"]
})
export class Order {
  @PrimaryGeneratedColumn()
  @ColumnInfo({
    id: "field_order_id_001",
    label: "订单ID"
  })
  id!: number;

  @Column({ length: 50 })
  @ColumnInfo({
    id: "field_order_number_001",
    label: "订单号"
  })
  orderNumber!: string;

  // 使用 ADB 增强枚举的订单状态字段
  @Column({ 
    type: "varchar",
    length: 50,
    default: OrderStatus.PENDING_PAYMENT
  })
  @ColumnInfo({
    id: "field_order_status_001",
    label: "订单状态",
    extendType: "adb-enum",
    enumConfig: {
      enum: OrderStatus,
      isMultiple: false,
      default: OrderStatus.PENDING_PAYMENT
    }
  })
  status!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  @ColumnInfo({
    id: "field_order_amount_001",
    label: "订单金额"
  })
  amount!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  @ColumnInfo({
    id: "field_created_at_001",
    label: "创建时间"
  })
  createdAt!: Date;
}
```

## 5、EnumMetadata 实体

ADB-TypeORM 提供了 `EnumMetadata` 实体用于将枚举元数据持久化到数据库中，支持枚举信息的统一管理。

```typescript
@Entity("__enums__")
export class EnumMetadata {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50, unique: true })
  enumId!: string;  // 枚举唯一标识

  @Column({ length: 100, unique: true })
  code!: string;    // 枚举识别码

  @Column({ length: 200 })
  label!: string;   // 枚举显示名称

  @Column({ type: "text", nullable: true })
  description?: string; // 枚举描述

  @Column({ type: "json" })
  items!: Record<string, EnumItemOptions>; // 枚举项配置

  @Column({ length: 100 })
  enumName!: string; // 枚举名称

  @Column({ type: "json", nullable: true })
  enumValues?: Record<string, any>; // 枚举值映射

  @Column({ default: true })
  isActive!: boolean; // 是否激活

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
```

## 6、重要技术说明

### TypeScript 配置要求

```typescript
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strictPropertyInitialization": false,
    "useDefineForClassFields": false
  }
}
```

### 属性定义规范

- 所有实体属性必须使用 `!` 断言符号（如 `id!: number`）
- 可选属性使用 `?` 操作符（如 `description?: string`）
- ADB 增强枚举需要类型断言来确保类型安全

### 版本兼容性

- **TypeScript**: 5.8.3（推荐版本）
- **TypeORM**: 0.3.25+
- **reflect-metadata**: 0.2.2+
- **Node.js**: 14.0.0+
