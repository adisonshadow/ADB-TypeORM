# ADB-TypeORM 定义

ADB-TypeORM 基于 TypeORM 并根据 适配AI设计 和 便捷管理 的需要进行定制增强。

## 1. 扩展 Entity Info

### @EntityInfo 装饰器定义

```typescript
interface EntityInfoOptions {
  id: string;                    // 实体唯一标识，由设计器自动分配的短UUID
  code: string;                  // 唯一识别码，使用:表示多级，如: "user:admin:super"
  label: string;                 // 显示名称 ，注意：不是comment，因为TypeORM自带comment
  status: 'enabled' | 'disabled' | 'archived';  // 状态：启用/禁用/归档，默认 enabled
  isLocked: boolean;             // 锁定/解锁状态，默认 false
  createdAt: Date;               // 创建时间，datetime格式，由设计器自动生成
  updatedAt: Date;               // 更新时间，datetime格式，由设计器自动生成
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
    id: "7h9j4v6w3p5q9b2d",
    code: "user:admin:super",
    name: "用户实体",
    description: "系统用户信息实体",
    version: "1.0.0",
    tags: ["user", "auth", "admin"]
  })
  export class User {
    @PrimaryGeneratedColumn() // 自增主键
    id: number;

    @Column({ length: 50, unique: true }) // 字符串字段，长度50，唯一
    username: string;

    @Column({ type: "int", default: 0 }) // 整数字段，默认值0
    age: number;
  }

```

## 2、 列（字段）信息扩展

### @ColumnInfo 装饰器定义

```typescript
interface ColumnInfoOptions {
  id: string;                 // 唯一标识，由设计器自动分配的短UUID
  label: string;              // 字段显示名，注意：不是comment，因为TypeORM自带comment
  extendType?: string;        // 扩展类型标识，如: "media", "enum" 等
  mediaConfig?: MediaConfigOptions;  // 媒体类型配置
  enumConfig?: EnumConfigOptions;    // 枚举类型配置
}
```

### 使用示例

```typescript 
   @Column({ length: 50, unique: true })
   @ColumnInfo({ 
      id: "8b4e6g1h1a3b5s8t",
      label: "用户名"
   })
   username: string;

```

## 3、 列（字段）type 扩展

> **设计理念**: 为了保持与TypeORM的完全兼容性，扩展类型通过元数据方式实现。数据库层面使用TypeORM原生类型，业务层面通过`@ColumnInfo`的`extendType`和相应配置来增强功能。

###  media

```typescript
interface MediaConfigOptions {
  mediaType: 'image' | 'video' | 'audio' | 'document' | 'file';
  formats: string[];
  maxSize?: number; // MB
  multiple?: boolean;
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

###  enum

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

#### 产品图片字段（多文件media）
```typescript
@Column({ 
  type: "simple-array", // "json" 也可以，为了减少AI模型的思考，暂强制为 simple-array
  nullable: true
})
@ColumnInfo({
  id: "1b4e6g1h1a3b5s1t",
  label: "产品图片",
  extendType: "media",
  mediaConfig: {
    mediaType: "image",
    formats: ["jpg", "png", "webp"],
    maxSize: 10,
    isMultiple: true,
    storagePath: "uploads/products"
  }
})
productImages: string[];
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
  extendType: "enum",
  enumConfig: {
    enum: OrderStatus,
    isMultiple: false,
    default: OrderStatus.PENDING_PAYMENT
  }
})
status: OrderStatus;
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
  extendType: "enum",
  enumConfig: {
    enum: OrderStatus,
    isMultiple: true,
    default: [OrderStatus.PENDING_PAYMENT]
  }
})
statuses: OrderStatus[];
```

## 4、 高级枚举

高级枚举提供了丰富的元数据支持，允许为枚举值和枚举本身添加详细的配置信息。

### @EnumInfo 装饰器定义

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

#### 枚举定义

```typescript

@EnumInfo({
  id: "3f7a9d2c8b4e6g1h",
  code: "order:status",
  label: "订单状态",
  description: "订单生命周期状态管理",
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
})
enum OrderStatus {
  PENDING_PAYMENT = "pending_payment",
  PAID = "paid",
  PROCESSING = "processing"
}
```

#### Column中引用 高级枚举的示例

```typescript
@Entity("orders")
@EntityInfo({
  id: "4f7a9d2c8b4e6g1h",
  code: "order:business:transaction",
  label: "订单实体",
  description: "订单业务实体",
  tags: ["order", "business", "transaction"]
})
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  @ColumnInfo({
    id: "5f7a9d2c8b4e6g1h",
    label: "订单号"
  })
  orderNumber: string;

  // 使用高级枚举的订单状态字段
  @Column({ 
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING_PAYMENT
  })
  @ColumnInfo({
    id: "6f7a9d2c8b4e6g1h",
    label: "订单状态",
    extendType: "enum",
    enumConfig: {
      enum: OrderStatus,
      isMultiple: false,
      default: OrderStatus.PENDING_PAYMENT
    }
  })
  status: OrderStatus;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  @ColumnInfo({
    id: "7f7a9d2c8b4e6g1h",
    label: "订单金额"
  })
  amount: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}


```




