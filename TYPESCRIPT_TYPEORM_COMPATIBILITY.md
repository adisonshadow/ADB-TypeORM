# TypeScript & TypeORM 兼容性指南

本文档记录了 ADB-TypeORM 项目开发过程中遇到的 TypeScript 和 TypeORM 兼容性问题，以及相应的解决方案和最佳实践。

## 📋 目录

- [问题概述](#问题概述)
- [核心问题分析](#核心问题分析)
- [版本兼容性矩阵](#版本兼容性矩阵)
- [配置推荐](#配置推荐)
- [常见问题与解决方案](#常见问题与解决方案)
- [检查清单](#检查清单)
- [最佳实践](#最佳实践)

## 🚨 问题概述

在开发 ADB-TypeORM 项目过程中，我们遇到了以下主要兼容性问题：

### 主要冲突点
1. **TypeScript 5.x 装饰器机制变更**
2. **装饰器元数据收集失败**
3. **动态属性类型访问问题**
4. **编译配置不当导致的构建失败**

### 影响范围
- 实体类装饰器无法正常工作
- 编译时出现装饰器签名错误
- 元数据无法正确收集和存储
- 动态枚举属性无法被 TypeScript 识别

## 🔍 核心问题分析

### 1. TypeScript 5.x 装饰器机制变更

**问题描述**：
TypeScript 5.0+ 版本引入了新的装饰器标准（Stage 3 Decorators），与旧版本的实验性装饰器不兼容。

**错误信息**：
```
error TS1240: Unable to resolve signature of property decorator when called as an expression.
Argument of type 'ClassFieldDecoratorContext<EnumMetadata, number> & { name: "id"; private: false; static: false; }' is not assignable to parameter of type 'string | symbol'.
```

**根本原因**：
- TypeORM 依赖实验性装饰器（Legacy Decorators）
- TypeScript 5.x 默认使用新的装饰器标准
- 新旧装饰器签名不兼容

### 2. 装饰器元数据收集机制问题

**问题描述**：
使用 `Object.getOwnPropertyNames(target.prototype)` 无法正确获取装饰器标记的属性。

**根本原因**：
- TypeScript 装饰器需要在执行时主动收集属性元数据
- 运行时反射无法获取装饰器添加的元数据
- 需要在装饰器函数中主动收集并存储属性信息

### 3. 动态属性类型访问问题

**问题描述**：
自定义枚举类动态添加属性后，TypeScript 无法识别这些属性。

**错误信息**：
```
类型"CustomEnum"上不存在属性"PENDING_PAYMENT"
```

**根本原因**：
- 动态添加的属性缺少类型声明
- 需要索引签名和类型断言配合使用

## 📊 版本兼容性矩阵

| 组件 | 推荐版本 | 最低版本 | 最高测试版本 | 兼容性状态 |
|------|----------|----------|--------------|------------|
| TypeScript | 4.9.5 - 5.8.3 | 4.5.0 | 5.8.3 | ✅ 兼容 |
| TypeORM | 0.3.25+ | 0.3.20 | 0.3.30 | ✅ 兼容 |
| reflect-metadata | 0.2.2+ | 0.1.13 | 0.2.2 | ✅ 兼容 |
| Node.js | 14.0.0+ | 14.0.0 | 20.x | ✅ 兼容 |
| Jest | 29.0.0+ | 28.0.0 | 29.7.0 | ✅ 兼容 |

### ⚠️ 已知问题版本

| 版本 | 问题描述 | 解决方案 |
|------|----------|----------|
| TypeScript 5.9.2+ | 装饰器签名不兼容 | 降级到 5.8.3 或调整配置 |
| TypeScript 6.0+ | 尚未测试 | 需要进一步验证 |

## ⚙️ 配置推荐

### tsconfig.json 推荐配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    
    // 🔑 关键配置：装饰器支持
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strictPropertyInitialization": false,
    "useDefineForClassFields": false,
    
    // 🔑 模块解析配置
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    
    // 🔑 放宽严格检查（可选）
    "noImplicitReturns": false,
    "noFallthroughCasesInSwitch": false
  },
  "ts-node": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "test/**/*",
    "**/*.test.ts"
  ]
}
```

### package.json 依赖配置

```json
{
  "dependencies": {
    "reflect-metadata": "^0.2.2",
    "typeorm": "^0.3.25"
  },
  "devDependencies": {
    "typescript": "5.8.3",
    "@types/node": "^22.15.29",
    "jest": "^29.0.0",
    "ts-jest": "^29.4.1"
  }
}
```

## 🛠️ 常见问题与解决方案

### 问题 1：装饰器签名错误

**症状**：
```
error TS1240: Unable to resolve signature of property decorator
```

**解决方案**：
```typescript
// ✅ 正确的属性定义（使用 ! 断言）
export class User {
  @PrimaryGeneratedColumn()
  @ColumnInfo({
    id: "field_id_001",
    label: "主键ID"
  })
  id!: number; // 注意：使用 ! 断言

  @Column({ length: 50 })
  @ColumnInfo({
    id: "field_username_001", 
    label: "用户名"
  })
  username!: string; // 注意：使用 ! 断言
}
```

### 问题 2：动态属性类型访问

**症状**：
```
类型"ADBEnum"上不存在属性"PENDING_PAYMENT"
```

**解决方案**：
```typescript
// ✅ 添加索引签名和类型断言
export class ADBEnum {
  // 🔑 添加索引签名
  [key: string]: any;
  
  // ... 其他代码
}

// ✅ 使用类型断言
export const OrderStatus = ADBEnum.create({
  // ... 配置
}) as ADBEnum & {
  readonly PENDING_PAYMENT: string;
  readonly PAID: string;
  // ... 其他属性
};
```

### 问题 3：装饰器元数据收集失败

**症状**：
- `getAllColumnInfo()` 返回空对象
- 装饰器信息丢失

**解决方案**：
```typescript
// ✅ 在装饰器执行时主动收集属性
const COLUMN_PROPERTIES_KEY = Symbol('columnProperties');

export function ColumnInfo(options: ColumnInfoOptions) {
  return function (target: any, propertyKey: string | symbol) {
    // 🔑 主动收集属性名
    const existingProperties = Reflect.getMetadata(COLUMN_PROPERTIES_KEY, target.constructor) || [];
    existingProperties.push(propertyKey);
    Reflect.defineMetadata(COLUMN_PROPERTIES_KEY, existingProperties, target.constructor);
    
    // 存储列信息
    Reflect.defineMetadata(METADATA_KEYS.COLUMN_INFO, options, target, propertyKey);
  };
}
```

### 问题 4：编译无输出

**症状**：
- `npx tsc` 执行成功但 dist 目录为空
- 没有错误信息

**解决方案**：
1. 检查 tsconfig.json 配置
2. 使用 `npx tsc --listEmittedFiles` 查看输出文件
3. 确认 `include` 和 `exclude` 路径正确

## ✅ 检查清单

### 环境检查

- [ ] Node.js 版本 >= 14.0.0
- [ ] TypeScript 版本在兼容范围内 (4.9.5 - 5.8.3)
- [ ] TypeORM 版本 >= 0.3.25
- [ ] reflect-metadata 已安装并正确导入

### 配置检查

- [ ] `experimentalDecorators: true`
- [ ] `emitDecoratorMetadata: true`
- [ ] `strictPropertyInitialization: false`
- [ ] `useDefineForClassFields: false`
- [ ] `skipLibCheck: true`
- [ ] `moduleResolution: "node"`

### 代码检查

- [ ] 实体类属性使用 `!` 断言
- [ ] 动态类添加了索引签名 `[key: string]: any`
- [ ] 装饰器中主动收集元数据
- [ ] 正确导入 `reflect-metadata`

### 测试检查

- [ ] 装饰器功能测试通过
- [ ] 元数据收集测试通过
- [ ] 编译输出正常
- [ ] 所有单元测试通过

## 🎯 最佳实践

### 1. 版本管理

```bash
# 🔑 锁定 TypeScript 版本
yarn add -D typescript@5.8.3

# 🔑 使用确切版本而非范围版本
"typescript": "5.8.3"  # ✅ 推荐
"typescript": "^5.8.0" # ❌ 可能导致兼容性问题
```

### 2. 开发环境设置

```bash
# 🔑 在项目根目录创建 .nvmrc
echo "18.17.0" > .nvmrc

# 🔑 使用项目特定的 TypeScript
npx tsc --version  # 而不是全局 tsc
```

### 3. 持续集成配置

```yaml
# .github/workflows/ci.yml
- name: Setup Node.js
  uses: actions/setup-node@v3
  with:
    node-version: '18.17.0'
    
- name: Install dependencies
  run: yarn install --frozen-lockfile
  
- name: Type check
  run: npx tsc --noEmit
  
- name: Build
  run: npm run build
  
- name: Test
  run: npm test
```

### 4. 代码规范

```typescript
// ✅ 推荐的实体定义模式
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
    label: "Primary Key ID"
  })
  id!: number;
  
  // ... 其他属性
}

// ✅ 推荐的枚举定义模式
export const OrderStatus = ADBEnum.create({
  id: "enum-order-status-001",
  code: "order:status",
  label: "订单状态",
  values: {
    PENDING_PAYMENT: "pending_payment",
    PAID: "paid"
  },
  items: {
    PENDING_PAYMENT: {
      label: "待支付",
      icon: "clock-circle",
      color: "#faad14"
    }
  }
}) as ADBEnum & {
  readonly PENDING_PAYMENT: string;
  readonly PAID: string;
};
```

## 🚀 升级指南

### 从 TypeScript 4.x 升级到 5.8.3

1. **更新依赖**：
```bash
yarn add -D typescript@5.8.3
```

2. **更新配置**：
```json
{
  "compilerOptions": {
    // 新增配置
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  }
}
```

3. **代码调整**：
```typescript
// 更新属性定义
class User {
  id: number;        // ❌ 旧写法
  id!: number;       // ✅ 新写法
}
```

4. **验证测试**：
```bash
npx tsc --noEmit      # 类型检查
npm run build         # 编译测试
npm test              # 单元测试
```

## 📝 总结

通过本文档中的配置和最佳实践，可以确保 ADB-TypeORM 项目在不同 TypeScript 版本下的稳定运行。关键点包括：

1. **版本兼容性**：使用经过验证的版本组合
2. **配置正确性**：确保装饰器和元数据相关配置正确
3. **代码规范**：遵循推荐的编码模式
4. **持续验证**：建立完整的检查机制

---

*最后更新：2025-01-07*  
*维护者：ADB-TypeORM 开发团队*