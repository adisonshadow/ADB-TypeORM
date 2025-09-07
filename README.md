# ADB-TypeORM

基于并完全兼容 TypeORM，为适配 AI 设计 ORM 和可视化管理 ORM 的需要而设计。

Based on and fully compatible with TypeORM, designed to meet the needs of AI-designed ORM and visual management of ORM.

## 🚀 特性

- **完全兼容 TypeORM**：保持与 TypeORM 的完全兼容性
- **增强的实体信息**：为实体添加丰富的元数据信息
- **扩展的列类型**：支持 media、enum 等扩展类型
- **ADB 增强枚举**：提供 ADBEnum 类替代传统枚举，支持丰富的元数据
- **枚举元数据持久化**：通过 EnumMetadata 实体实现枚举信息的数据库存储
- **AI 友好**：专为 AI 设计和代码生成优化
- **类型安全**：完整的 TypeScript 类型支持
- **装饰器增强**：智能的属性元数据收集机制

## 📦 安装

```bash
# 推荐使用 yarn
yarn add adb-typeorm typeorm reflect-metadata

# 或者使用 npm
npm install adb-typeorm typeorm reflect-metadata
```

## 🔧 版本要求

| 组件 | 推荐版本 | 最低版本 | 兼容性状态 |
|------|----------|----------|------------|
| TypeScript | 5.8.3 | 4.5.0 | ✅ 兼容 |
| TypeORM | 0.3.25+ | 0.3.20 | ✅ 兼容 |
| reflect-metadata | 0.2.2+ | 0.1.13 | ✅ 兼容 |
| Node.js | 14.0.0+ | 14.0.0 | ✅ 兼容 |

## ⚙️ 配置要求

在使用 ADB-TypeORM 之前，请确保你的 TypeScript 配置正确：

**tsconfig.json**
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strictPropertyInitialization": false,
    "useDefineForClassFields": false,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  }
}
```

**在应用入口导入 reflect-metadata**
```typescript
import 'reflect-metadata';
```

## 🎯 快速开始

### 1. 基础实体定义

```typescript
import 'reflect-metadata';
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
  @ColumnInfo({
    id: "field_id_001",
    label: "主键ID"
  })
  id!: number;

  @Column({ length: 50, unique: true })
  @ColumnInfo({
    id: "field_username_001",
    label: "用户名"
  })
  username!: string;

  @Column({ length: 100 })
  @ColumnInfo({
    id: "field_email_001",
    label: "邮箱地址"
  })
  email!: string;
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
avatar!: string;
```

### 3. ADB 增强枚举

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
      sort: 2
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
console.log(OrderStatus.getSortedItems()); // 按排序获取枚举项
```

### 4. 枚举字段使用

```typescript
@Column({ 
  type: "varchar",
  length: 50,
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
status!: string;
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
  formats: string[];             // 支持的文件格式
  maxSize?: number;              // 最大文件大小（MB）
  isMultiple?: boolean;          // 是否支持多文件上传
  storagePath?: string;          // 存储路径
}
```

### EnumConfigOptions

枚举类型配置选项。

```typescript
interface EnumConfigOptions {
  enum: any;                     // 枚举对象引用
  isMultiple?: boolean;          // 是否支持多选
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

// 验证枚举配置
const validation = EnumInfoService.validateEnumInfo(OrderStatus);
console.log(validation.isValid, validation.errors);
```

### ADBEnum 工具类

提供 ADB 增强枚举相关的工具函数。

```typescript
import { ADBEnum } from 'adb-typeorm';

// 使用 ADBEnum 的实例方法
const orderStatus = ADBEnum.create({...});

// 获取枚举值
const value = orderStatus.getValue('PENDING_PAYMENT');

// 获取枚举项配置
const config = orderStatus.getItemConfig('PENDING_PAYMENT');

// 获取启用的枚举项
const enabledItems = orderStatus.getEnabledItems();

// 验证枚举配置
const validation = orderStatus.validate();
```

### EnumMetadataService

提供枚举元数据持久化相关的工具函数。

```typescript
import { EnumMetadataService } from 'adb-typeorm';

// 同步枚举到数据库
await EnumMetadataService.syncEnumToDatabase(dataSource, OrderStatus);

// 从数据库加载枚举
const enumMetadata = await EnumMetadataService.loadFromDatabase(dataSource, 'order:status');

// 获取所有枚举元数据
const allEnums = await EnumMetadataService.getAllEnums(dataSource);
```

## 📝 设计理念

为了保持与 TypeORM 的完全兼容性，扩展类型通过元数据方式实现：

- **数据库层面**：使用 TypeORM 原生类型（varchar、int 等）
- **业务层面**：通过 `@ColumnInfo` 的 `extendType` 和相应配置来增强功能
- **类型安全**：完整的 TypeScript 类型支持
- **迁移友好**：数据库迁移脚本正常生成
- **元数据持久化**：枚举配置可选择性持久化到 `__enums__` 表
- **AI 优化**：专为 AI 代码生成和可视化设计优化

## 📚 目录结构

```
ADB-TypeORM/
├── src/                     # 源代码目录
│   ├── decorators/          # 装饰器定义
│   │   ├── EntityInfo.ts    # 实体信息装饰器
│   │   ├── ColumnInfo.ts    # 列信息装饰器
│   │   └── EnumInfo.ts      # 枚举信息装饰器
│   ├── entities/            # 核心实体
│   │   ├── EnumMetadata.ts  # 枚举元数据实体
│   │   └── index.ts         # 实体导出
│   ├── utils/               # 工具类和服务
│   │   ├── ADBEnum.ts       # ADB 增强枚举类
│   │   ├── EnumMetadataService.ts # 枚举元数据服务
│   │   └── index.ts         # 工具类导出
│   ├── types/               # TypeScript 类型定义
│   │   └── index.ts         # 类型定义
│   ├── examples/            # 示例代码
│   │   ├── OrderStatus.ts   # 订单状态枚举示例
│   │   ├── User.ts          # 用户实体示例
│   │   └── Order.ts         # 订单实体示例
│   └── index.ts             # 主入口文件
├── test/                    # 测试文件
│   ├── ADBEnum.test.ts      # ADBEnum 功能测试
│   ├── EntityInfo-ColumnInfo.test.ts # 装饰器测试
│   └── setup.ts             # 测试配置
├── dist/                    # 编译输出目录
├── docs/                    # 文档目录（可选）
│   ├── CUSTOM_ENUM_GUIDE.md # ADB 枚举使用指南
│   └── ENUM_METADATA_GUIDE.md # 枚举元数据指南
├── package.json
├── tsconfig.json
├── jest.config.js           # Jest 测试配置
└── README.md
```

## 📚 相关文档

- [TypeScript & TypeORM 兼容性指南](./TYPESCRIPT_TYPEORM_COMPATIBILITY.md) - 版本兼容性和问题解决
- [ADBEnum 指南](./CUSTOM_ENUM_GUIDE.md) - ADB 增强枚举使用指南
- [枚举元数据指南](./ENUM_METADATA_GUIDE.md) - 枚举持久化使用指南
- [API 文档](#🛠️-api-文档) - 完整的 API 参考
- [工具类](#🔧-工具类) - 各种工具类和服务


## ⚠️ 重要提示

### TypeScript 版本兼容性
- **推荐版本**: TypeScript 5.8.3
- **避免使用**: TypeScript 5.9.0+ 版本可能存在装饰器兼容性问题
- 如遇到装饰器相关错误，请参考 [兼容性指南](./TYPESCRIPT_TYPEORM_COMPATIBILITY.md)

### 开发环境设置
```bash
# 安装依赖
yarn install

# 构建项目
yarn build

npx tsc

# 运行测试
yarn test
```

## 🐛 已知问题

无已知问题。如果遇到问题，请参考 [兼容性指南](./TYPESCRIPT_TYPEORM_COMPATIBILITY.md) 或提交 [Issue](https://github.com/your-username/adb-typeorm/issues)。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！在贡献代码前，请确保：

1. 遵循现有的代码风格
2. 添加相应的单元测试
3. 更新相关文档
4. 确保所有测试通过

## 📄 许可证

MIT License
