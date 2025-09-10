# ADB-TypeORM 使用示例

## 导入方式

### 1. 默认导入（推荐）

```typescript
import ADBTypeORM from 'adb-typeorm';

// 使用默认导出
const { EntityInfo, ColumnInfo, ADBEnum } = ADBTypeORM;

@Entity("users")
@EntityInfo({
  id: "user-entity-001",
  code: "user:admin:super",
  label: "用户实体"
})
export class User {
  @PrimaryGeneratedColumn()
  @ColumnInfo({
    id: "field_id_001",
    label: "主键ID"
  })
  id!: number;
}
```

### 2. 命名导入

```typescript
import { EntityInfo, ColumnInfo, ADBEnum, Entity, Column } from 'adb-typeorm';

@Entity("users")
@EntityInfo({
  id: "user-entity-001",
  code: "user:admin:super",
  label: "用户实体"
})
export class User {
  @PrimaryGeneratedColumn()
  @ColumnInfo({
    id: "field_id_001",
    label: "主键ID"
  })
  id!: number;
}
```

### 3. CommonJS 导入

```javascript
const ADBTypeORM = require('adb-typeorm');

// 使用默认导出
const { EntityInfo, ColumnInfo, ADBEnum } = ADBTypeORM.default;

// 或者使用命名导出
const { EntityInfo, ColumnInfo, ADBEnum } = ADBTypeORM;
```

### 4. 混合导入

```typescript
import ADBTypeORM, { Entity, Column, PrimaryGeneratedColumn } from 'adb-typeorm';

const { EntityInfo, ColumnInfo } = ADBTypeORM;

@Entity("users")
@EntityInfo({
  id: "user-entity-001",
  code: "user:admin:super",
  label: "用户实体"
})
export class User {
  @PrimaryGeneratedColumn()
  @ColumnInfo({
    id: "field_id_001",
    label: "主键ID"
  })
  id!: number;
}
```

## 常见问题解决

### 问题：`does not provide an export named 'default'`

**原因**：项目配置或导入方式不正确

**解决方案**：

1. **确保使用正确的导入语法**：
   ```typescript
   // ✅ 正确
   import ADBTypeORM from 'adb-typeorm';
   
   // ❌ 错误
   import { default as ADBTypeORM } from 'adb-typeorm';
   ```

2. **检查项目的模块系统**：
   - 如果使用 Vite/Webpack 等现代打包工具，确保配置正确
   - 如果使用 Node.js，确保版本支持 ES 模块

3. **使用命名导入作为备选**：
   ```typescript
   import { EntityInfo, ColumnInfo, ADBEnum } from 'adb-typeorm';
   ```

### 问题：TypeScript 类型错误

**解决方案**：

1. **确保安装了类型定义**：
   ```bash
   npm install @types/node
   ```

2. **检查 tsconfig.json**：
   ```json
   {
     "compilerOptions": {
       "esModuleInterop": true,
       "allowSyntheticDefaultImports": true,
       "moduleResolution": "node"
     }
   }
   ```

### 问题：装饰器不工作

**解决方案**：

1. **确保 tsconfig.json 配置正确**：
   ```json
   {
     "compilerOptions": {
       "experimentalDecorators": true,
       "emitDecoratorMetadata": true,
       "useDefineForClassFields": false
     }
   }
   ```

2. **导入 reflect-metadata**：
   ```typescript
   import 'reflect-metadata';
   import ADBTypeORM from 'adb-typeorm';
   ```

## 完整示例

```typescript
import 'reflect-metadata';
import ADBTypeORM from 'adb-typeorm';

const { EntityInfo, ColumnInfo, ADBEnum, Entity, Column, PrimaryGeneratedColumn } = ADBTypeORM;

// 创建 ADB 增强枚举
const OrderStatus = ADBEnum.create({
  id: "enum-order-status-001",
  code: "order:status",
  label: "订单状态",
  values: {
    PENDING: "pending",
    COMPLETED: "completed",
    CANCELLED: "cancelled"
  }
});

@Entity("orders")
@EntityInfo({
  id: "order-entity-001",
  code: "order:business",
  label: "订单实体"
})
export class Order {
  @PrimaryGeneratedColumn()
  @ColumnInfo({
    id: "field_id_001",
    label: "订单ID"
  })
  id!: number;

  @Column({ length: 50 })
  @ColumnInfo({
    id: "field_number_001",
    label: "订单号"
  })
  orderNumber!: string;

  @Column({ 
    type: "varchar",
    length: 50,
    default: OrderStatus.PENDING
  })
  @ColumnInfo({
    id: "field_status_001",
    label: "订单状态",
    extendType: "adb-enum",
    enumConfig: {
      enum: OrderStatus,
      isMultiple: false,
      default: OrderStatus.PENDING
    }
  })
  status!: string;
}
```
