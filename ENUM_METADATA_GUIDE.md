# 枚举元数据持久化使用指南

## 概述

ADB-TypeORM 提供了将枚举元数据持久化到数据库的功能。通过 `__nums__` 表（`EnumMetadata` 实体），你可以将枚举配置存储到数据库中，`items` 字段作为 JSON 格式保存。

## 快速开始

### 1. 导入必要的模块

```typescript
import { DataSource } from 'typeorm';
import { EnumMetadata, EnumMetadataService, OrderStatus } from 'adb-typeorm';
```

### 2. 配置 DataSource

```typescript
const dataSource = new DataSource({
  type: 'mysql', // 或其他数据库类型
  host: 'localhost',
  port: 3306,
  username: 'your_username',
  password: 'your_password',
  database: 'your_database',
  entities: [
    EnumMetadata, // 必须包含这个实体
    // ...你的其他实体
  ],
  synchronize: true, // 开发环境使用，生产环境建议使用 migration
});

await dataSource.initialize();
```

### 3. 使用 EnumMetadataService

```typescript
// 创建服务实例
const enumMetadataService = new EnumMetadataService(dataSource);

// 保存枚举元数据到数据库
const savedMetadata = await enumMetadataService.saveEnumMetadata(OrderStatus, 'OrderStatus');

console.log('保存成功:', {
  id: savedMetadata.id,
  enumId: savedMetadata.enumId,
  code: savedMetadata.code,
  label: savedMetadata.label,
  items: savedMetadata.items // 这是 JSON 格式的枚举项配置
});
```

## 数据库表结构

`__nums__` 表的结构如下：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | int | 主键ID |
| enumId | varchar(50) | 枚举唯一标识 |
| code | varchar(100) | 枚举识别码 |
| label | varchar(200) | 枚举显示名称 |
| description | text | 枚举描述 |
| **items** | **json** | **枚举项配置（重点字段）** |
| enumName | varchar(100) | 枚举类名 |
| enumValues | json | 枚举值映射 |
| isActive | boolean | 是否启用 |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

## items 字段示例

`items` 字段存储的 JSON 数据结构如下：

```json
{
  "PENDING_PAYMENT": {
    "label": "待支付",
    "icon": "clock-circle",
    "color": "#faad14",
    "description": "订单已创建，等待用户支付",
    "sort": 1,
    "metadata": {
      "timeoutMinutes": 30,
      "canCancel": true
    }
  },
  "PAID": {
    "label": "已支付",
    "icon": "check-circle",
    "color": "#52c41a",
    "description": "支付成功，订单确认",
    "sort": 2,
    "metadata": {
      "autoConfirm": true,
      "confirmDelayMinutes": 5
    }
  }
  // ... 其他枚举项
}
```

## 完整使用示例

```typescript
import { DataSource } from 'typeorm';
import { EnumMetadata, EnumMetadataService } from '../src';
import { OrderStatus } from '../src/examples/OrderStatus';

async function main() {
  // 1. 初始化数据源
  const dataSource = new DataSource({
    type: 'sqlite',
    database: 'test.db',
    entities: [EnumMetadata],
    synchronize: true,
  });

  await dataSource.initialize();

  try {
    // 2. 创建服务
    const service = new EnumMetadataService(dataSource);

    // 3. 保存枚举元数据
    const metadata = await service.saveEnumMetadata(OrderStatus, 'OrderStatus');
    
    // 4. 查询元数据
    const found = await service.getEnumMetadataByCode('order:status');
    if (found) {
      console.log('枚举配置:', found.items);
      
      // items 字段包含了完整的枚举项配置
      Object.entries(found.items).forEach(([key, config]) => {
        console.log(`${key}: ${config.label} (${config.color})`);
      });
    }

    // 5. 获取所有枚举
    const allEnums = await service.getAllEnumMetadata();
    console.log(`系统中共有 ${allEnums.length} 个枚举`);

  } finally {
    await dataSource.destroy();
  }
}

main().catch(console.error);
```

## API 文档

### EnumMetadataService 方法

- `saveEnumMetadata(enumObject, enumName)` - 保存单个枚举元数据
- `saveMultipleEnumMetadata(enums)` - 批量保存多个枚举元数据
- `getEnumMetadataById(enumId)` - 根据ID获取
- `getEnumMetadataByCode(code)` - 根据代码获取
- `getEnumMetadataByName(enumName)` - 根据名称获取
- `getAllEnumMetadata()` - 获取所有枚举元数据
- `deleteEnumMetadata(enumId)` - 软删除枚举元数据
- `syncEnumMetadata(enumObject, enumName)` - 同步枚举到数据库
- `rebuildEnumConfig(enumId)` - 从数据库重建枚举配置

## 注意事项

1. **数据库同步**：确保在 DataSource 配置中包含 `EnumMetadata` 实体
2. **JSON 支持**：确保你的数据库支持 JSON 数据类型（MySQL 5.7+、PostgreSQL 9.2+、SQLite 3.45+）
3. **枚举定义**：枚举必须使用 `@EnumInfo` 装饰器并包含 `items` 配置
4. **性能考虑**：大量枚举项时，建议对 `code` 和 `enumId` 字段建立索引

## 迁移指南

如果你之前使用的是老版本的 `@EnumItem` 装饰器，请按照以下步骤迁移：

### 之前（不支持）：
```typescript
@EnumInfo({ id: "xxx", code: "xxx", label: "xxx" })
enum Status {
  @EnumItem({ label: "待处理" })  // ❌ 不支持
  PENDING = "pending"
}
```

### 现在（正确）：
```typescript
@EnumInfo({
  id: "xxx",
  code: "xxx", 
  label: "xxx",
  items: {
    PENDING: { label: "待处理" }  // ✅ 正确
  }
})
enum Status {
  PENDING = "pending"
}
```