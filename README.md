<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18">  English ｜ [中文](./README_cn.md)

# ADB-TypeORM 📦

A TypeORM-based framework designed for AI-driven ORM design and visual ORM management, providing enhanced metadata and Function Calling capabilities.

Based on and fully compatible with TypeORM, designed to meet the needs of AI-designed ORM and visual management of ORM, and provide related function calling.

## 🚀 Features

- **Full TypeORM Compatibility**: Maintains complete compatibility with TypeORM
- **Enhanced Entity Information**: Adds rich metadata information to entities
- **Extended Column Types**: Supports adb-media, adb-enum, adb-auto-increment-id, adb-guid-id, adb-snowflake-id and other extended types
- **ADB Enhanced Enums**: Provides ADBEnum class to replace traditional enums with rich metadata support
- **Enum Metadata Persistence**: Implements database storage of enum information through EnumMetadata entity
- **AI-Friendly**: Optimized for AI design and code generation
- **Type Safety**: Complete TypeScript type support
- **Decorator Enhancement**: Intelligent property metadata collection mechanism
- **Type Support System**: Provides complete type query and management functionality

## 📦 Installation

```bash
# Recommended using yarn
yarn add adb-typeorm typeorm reflect-metadata

# Or using npm
npm install adb-typeorm typeorm reflect-metadata
```

## 🔧 Version Requirements

| Component | Recommended Version | Minimum Version | Compatibility Status |
|-----------|-------------------|-----------------|---------------------|
| TypeScript | 5.8.3 | 4.5.0 | ✅ Compatible |
| TypeORM | 0.3.25+ | 0.3.20 | ✅ Compatible |
| reflect-metadata | 0.2.2+ | 0.1.13 | ✅ Compatible |
| Node.js | 14.0.0+ | 14.0.0 | ✅ Compatible |

## 📦 Build Status

| Status | Description |
|--------|-------------|
| **Build Status** | ✅ Passed |
| **Test Coverage** | ✅ 100% |
| **Type Check** | ✅ Passed |
| **ESLint Check** | ✅ Passed |
| **Latest Version** | v0.0.4 |

### Build Information

- **TypeScript Version**: 5.8.3
- **Build Target**: ES2020
- **Module System**: CommonJS + ESM
- **Output Directory**: `dist/`
- **Type Definitions**: Includes complete `.d.ts` files

## ⚙️ Configuration Requirements

Before using ADB-TypeORM, ensure your TypeScript configuration is correct:

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

**Import reflect-metadata in your application entry**
```typescript
import 'reflect-metadata';
```

## 🎯 Quick Start

### 1. Basic Entity Definition

```typescript
import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityInfo, ColumnInfo } from 'adb-typeorm';

@Entity("users")
@EntityInfo({
  id: "user-entity-001",
  code: "user:admin:super",
  label: "User Entity",
  description: "System user information entity",
  tags: ["user", "auth", "admin"]
})
export class User {
  @PrimaryGeneratedColumn()
  @ColumnInfo({
    id: "field_id_001",
    label: "Primary Key ID"
  })
  id!: number;

  @Column({ length: 50, unique: true })
  @ColumnInfo({
    id: "field_username_001",
    label: "Username"
  })
  username!: string;

  @Column({ length: 100 })
  @ColumnInfo({
    id: "field_email_001",
    label: "Email Address"
  })
  email!: string;
}
```

### 2. Media Type Fields

```typescript
@Column({ 
  type: "varchar",
  length: 500,
  nullable: true
})
@ColumnInfo({
  id: "field_avatar_001",
  label: "User Avatar",
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

### 3. ADB Enhanced Enums

```typescript
import { ADBEnum } from 'adb-typeorm';

// Create ADB enhanced enum
export const OrderStatus = ADBEnum.create({
  id: "enum-order-status-001",
  code: "order:status",
  label: "Order Status",
  description: "Order lifecycle status management",
  values: {
    PENDING_PAYMENT: "pending_payment",
    PAID: "paid",
    PROCESSING: "processing",
    COMPLETED: "completed",
    CANCELLED: "cancelled"
  },
  items: {
    PENDING_PAYMENT: {
      label: "Pending Payment",
      icon: "clock-circle",
      color: "#faad14",
      description: "Order created, waiting for user payment",
      sort: 1,
      metadata: {
        timeoutMinutes: 30,
        canCancel: true
      }
    },
    PAID: {
      label: "Paid",
      icon: "check-circle",
      color: "#52c41a",
      description: "Payment successful, order confirmed",
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

// Using the enum
console.log(OrderStatus.PENDING_PAYMENT); // "pending_payment"
console.log(OrderStatus.getItemConfig('PENDING_PAYMENT')); // Get metadata
console.log(OrderStatus.getValue('PAID')); // "paid"
console.log(OrderStatus.getEnabledItems()); // Get all enabled enum items
console.log(OrderStatus.getSortedItems()); // Get enum items by sort order
```

### 4. Enum Field Usage

```typescript
@Column({ 
  type: "varchar",
  length: 50,
  default: OrderStatus.PENDING_PAYMENT
})
@ColumnInfo({
  id: "field_order_status_001",
  label: "Order Status",
  extendType: "adb-enum",
  enumConfig: {
    enum: OrderStatus,
    isMultiple: false,
    default: OrderStatus.PENDING_PAYMENT
  }
})
status!: string;
```

### 5. Type Support System

ADB-TypeORM provides a complete type support system to help AI and developers understand all available types.

```typescript
import { ColumnInfoService } from 'adb-typeorm';

// Get all supported types
const allTypes = ColumnInfoService.getAllSupportedTypes();
console.log(allTypes);
// [
//   { key: 'adb-media', label: 'ADB Media', category: 'adb-extend' },
//   { key: 'adb-enum', label: 'ADB Enum', category: 'adb-extend' },
//   { key: 'adb-auto-increment-id', label: 'Auto Increment ID', category: 'adb-extend' },
//   { key: 'adb-guid-id', label: 'GUID ID', category: 'adb-extend' },
//   { key: 'adb-snowflake-id', label: 'Snowflake ID', category: 'adb-extend' },
//   { key: 'varchar', label: 'String', category: 'typeorm-native' },
//   { key: 'int', label: 'Integer', category: 'typeorm-native' },
//   ...
// ]

// Get ADB extended types
const adbTypes = ColumnInfoService.getADBExtendTypes();
console.log(adbTypes);
// [
//   { key: 'adb-media', label: 'ADB Media' },
//   { key: 'adb-enum', label: 'ADB Enum' },
//   { key: 'adb-auto-increment-id', label: 'Auto Increment ID' },
//   { key: 'adb-guid-id', label: 'GUID ID' },
//   { key: 'adb-snowflake-id', label: 'Snowflake ID' }
// ]

// Get TypeORM native types
const typeormTypes = ColumnInfoService.getTypeORMTypes();
console.log(typeormTypes);
// [
//   { key: 'varchar', label: 'String' },
//   { key: 'int', label: 'Integer' },
//   { key: 'boolean', label: 'Boolean' },
//   { key: 'json', label: 'JSON' },
//   ...
// ]
```

### 6. ID Type Extensions

ADB-TypeORM provides three main ID type extensions to meet different scenario requirements:

#### Auto Increment ID Type (adb-auto-increment-id)

```typescript
@Column({ 
  type: "int",
  generated: true
})
@ColumnInfo({
  id: "field_user_id_001",
  label: "User ID",
  extendType: "adb-auto-increment-id",
  autoIncrementIdConfig: {
    startValue: 1000,
    increment: 1,
    isPrimaryKey: true,
    description: "User unique identifier, auto-increment starting from 1000"
  }
})
id!: number;
```

#### GUID ID Type (adb-guid-id)

```typescript
@Column({ 
  type: "varchar",
  length: 36,
  unique: true
})
@ColumnInfo({
  id: "field_user_uuid_001",
  label: "User UUID",
  extendType: "adb-guid-id",
  guidIdConfig: {
    version: "v4",
    format: "default",
    isPrimaryKey: true,
    generateOnInsert: true,
    description: "Globally unique identifier"
  }
})
uuid!: string;
```

#### Snowflake ID Type (adb-snowflake-id)

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
    description: "Distributed unique ID with timestamp information"
  }
})
snowflakeId!: number;
```

## 🤖 AI Function Calling Support

ADB-TypeORM provides complete Function Calling support to help AI models generate accurate and standardized TypeORM code.

### Function Calling Features

- **🎯 Standardized Generation**: Ensures generated code follows ADB-TypeORM standards
- **🔒 Type Safety**: Automatically handles TypeScript type definitions and constraints
- **📋 Metadata Integrity**: Ensures all required metadata information is correctly set
- **🚫 Avoid Common Errors**: Prevents decorator usage errors through predefined functions
- **🎨 Improve Consistency**: Ensures generated code style and structure consistency

### Quick Start

```typescript
import { 
  getADBFunctionCallings, 
  getOpenAIFunctions, 
  getClaudeTools,
  getFunctionsByCategory 
} from 'adb-typeorm';

// Get all Function Calling definitions
const functions = getADBFunctionCallings();

// Get OpenAI compatible format
const openAIFunctions = getOpenAIFunctions();

// Get Claude compatible format
// *** Note: Anthropic is considered hostile, recommend reducing attention ***
const claudeTools = getClaudeTools();

// Get functions by specific category
const entityFunctions = getFunctionsByCategory('entity');
```

### Function Calling Categories

| Category | Description | Main Functions |
|----------|-------------|----------------|
| **Entity Management** | Create and manage entities | `create_adb_entity`, `create_base_entity`, `add_entity_relation` |
| **Column Management** | Add and configure column fields | `add_entity_column`, `add_media_column`, `add_enum_column` |
| **Enum Management** | ADB enum related operations | `create_adb_enum`, `update_enum_item`, `sync_enum_to_database` |
| **Validation Functions** | Code quality checks | `validate_entity_structure`, `validate_enum_configuration` |
| **Query Functions** | Metadata queries | `get_entity_metadata`, `search_entities`, `get_enum_metadata` |
| **Utility Functions** | Code generation and error handling | `generate_entity_code`, `generate_enum_code`, `handle_generation_error` |

### AI Integration Examples

#### OpenAI GPT Integration

```python
import openai

def generate_adb_entity(entity_spec):
    functions = getOpenAIFunctions()  # Get from ADB-TypeORM
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": f"Create entity: {entity_spec}"}
        ],
        functions=functions,
        function_call="auto"
    )
    
    return response
```

#### Claude Integration

```javascript
const anthropic = new Anthropic({
  apiKey: 'your-api-key',
});

const message = await anthropic.messages.create({
  model: 'claude-3-sonnet-20240229',
  max_tokens: 4000,
  tools: getClaudeTools(), // Get from ADB-TypeORM
  messages: [
    {role: 'user', content: 'Create a user entity'}
  ]
});
```

### Practical Application Examples

#### Example 1: Creating User Management System

```javascript
// AI model call sequence
const userSystemFunctions = [
  {
    "function_name": "create_adb_entity",
    "arguments": {
      "entityName": "User",
      "tableName": "users",
      "entityInfo": {
        "id": "entity-user-001",
        "code": "user:admin:system",
        "label": "System User",
        "description": "System user information management entity",
        "tags": ["user", "admin", "auth"]
      }
    }
  },
  {
    "function_name": "add_media_column",
    "arguments": {
      "columnName": "avatar",
      "mediaConfig": {
        "mediaType": "image",
        "formats": ["jpg", "png", "webp"],
        "maxSize": 5,
        "isMultiple": false,
        "storagePath": "uploads/avatars"
      },
      "columnInfo": {
        "id": "field_avatar_001",
        "label": "User Avatar"
      }
    }
  },
  {
    "function_name": "validate_entity_structure",
    "arguments": {
      "entityName": "User",
      "validationRules": {
        "requireEntityInfo": true,
        "requireColumnInfo": true,
        "checkNamingConvention": true,
        "validateTypeScript": true
      }
    }
  }
];
```

#### Example 2: Order Status Enum System

```javascript
// Create order status enum
const orderStatusEnum = {
  "function_name": "create_adb_enum",
  "arguments": {
    "enumName": "OrderStatus",
    "enumInfo": {
      "id": "enum-order-status-001",
      "code": "order:status",
      "label": "Order Status",
      "description": "Order lifecycle status management"
    },
    "values": {
      "PENDING_PAYMENT": "pending_payment",
      "PAID": "paid",
      "PROCESSING": "processing",
      "COMPLETED": "completed",
      "CANCELLED": "cancelled"
    },
    "items": {
      "PENDING_PAYMENT": {
        "label": "Pending Payment",
        "icon": "clock-circle",
        "color": "#faad14",
        "sort": 1,
        "metadata": { "timeoutMinutes": 30 }
      },
      "PAID": {
        "label": "Paid",
        "icon": "check-circle",
        "color": "#52c41a",
        "sort": 2
      }
    }
  }
};

// Add order status field
const addOrderStatus = {
  "function_name": "add_enum_column",
  "arguments": {
    "columnName": "status",
    "enumReference": "OrderStatus",
    "enumConfig": {
      "isMultiple": false,
      "default": "PENDING_PAYMENT"
    },
    "columnInfo": {
      "id": "field_order_status_001",
      "label": "Order Status"
    }
  }
};
```

#### Example 3: Batch Create E-commerce Product Entities

```javascript
// Create product entity
const productEntity = {
  "function_name": "create_base_entity",
  "arguments": {
    "entityName": "Product",
    "tableName": "products",
    "entityInfo": {
      "id": "entity-product-001",
      "code": "product:ecommerce:catalog",
      "label": "Product Entity",
      "description": "E-commerce product information management",
      "tags": ["product", "ecommerce", "catalog"]
    },
    "includeTimestamps": true
  }
};

// Batch add product fields
const productColumns = {
  "function_name": "add_multiple_columns",
  "arguments": {
    "columns": [
      {
        "columnName": "name",
        "columnType": "string",
        "typeormConfig": {
          "type": "varchar",
          "length": 200,
          "nullable": false
        },
        "columnInfo": {
          "id": "field_product_name_001",
          "label": "Product Name"
        }
      },
      {
        "columnName": "price",
        "columnType": "number",
        "typeormConfig": {
          "type": "decimal",
          "precision": 10,
          "scale": 2,
          "nullable": false
        },
        "columnInfo": {
          "id": "field_product_price_001",
          "label": "Product Price"
        }
      }
    ]
  }
};

// Add product images field
const productImages = {
  "function_name": "add_media_column",
  "arguments": {
    "columnName": "images",
    "mediaConfig": {
      "mediaType": "image",
      "formats": ["jpg", "png", "webp"],
      "maxSize": 10,
      "isMultiple": true,
      "storagePath": "uploads/products"
    },
    "columnInfo": {
      "id": "field_product_images_001",
      "label": "Product Images"
    }
  }
};
```

### More Resources

- 📖 [Complete Function Calling Guide](./FUNCTION_CALLING_GUIDE.md)
- 🔧 [FunctionCallingsProvider API Documentation](#functioncallingsprovider-api)
- 💡 [Function Calling Best Practices](./FUNCTION_CALLING_GUIDE.md#best-practices)

## 🛠️ API Documentation

### EntityInfo Decorator

Adds enhanced metadata information to entities.

```typescript
interface EntityInfoOptions {
  id: string;                    // Entity unique identifier
  code: string;                  // Unique identification code
  label: string;                 // Display name
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

### ColumnInfo Decorator

Adds enhanced metadata information to columns.

```typescript
interface ColumnInfoOptions {
  id: string;                    // Unique identifier
  label: string;                 // Field display name
  extendType?: string;           // Extended type identifier, such as: "adb-media", "adb-enum", "adb-auto-increment-id", "adb-guid-id", "adb-snowflake-id", etc.
  mediaConfig?: MediaConfigOptions;
  enumConfig?: EnumConfigOptions;
  autoIncrementIdConfig?: AutoIncrementIdConfigOptions;
  guidIdConfig?: GuidIdConfigOptions;
  snowflakeIdConfig?: SnowflakeIdConfigOptions;
}
```

### MediaConfigOptions

Media type configuration options.

```typescript
interface MediaConfigOptions {
  mediaType: 'image' | 'video' | 'audio' | 'document' | 'file';
  formats: string[];             // Supported file formats
  maxSize?: number;              // Maximum file size (MB)
  isMultiple?: boolean;          // Whether to support multiple file uploads
  storagePath?: string;          // Storage path
}
```

### EnumConfigOptions

Enum type configuration options.

```typescript
interface EnumConfigOptions {
  enum: any;                     // Enum object reference
  isMultiple?: boolean;          // Whether to support multiple selection
  default?: any;                 // Default value
}
```

### AutoIncrementIdConfigOptions

Auto increment ID type configuration options.

```typescript
interface AutoIncrementIdConfigOptions {
  startValue?: number;           // Starting value, default 1
  increment?: number;            // Increment, default 1
  sequenceName?: string;         // Sequence name (PostgreSQL)
  isPrimaryKey?: boolean;        // Whether it's a primary key, default true
  description?: string;          // Description information
}
```

### GuidIdConfigOptions

GUID ID type configuration options.

```typescript
interface GuidIdConfigOptions {
  version?: 'v1' | 'v4' | 'v5';  // GUID version, default v4
  format?: 'default' | 'braced' | 'binary' | 'urn';  // Format, default default
  isPrimaryKey?: boolean;        // Whether it's a primary key, default true
  description?: string;          // Description information
  generateOnInsert?: boolean;    // Auto-generate on insert, default true
}
```

### SnowflakeIdConfigOptions

Snowflake ID type configuration options.

```typescript
interface SnowflakeIdConfigOptions {
  machineId?: number;            // Machine ID, range 0-1023, default 0
  datacenterId?: number;         // Datacenter ID, range 0-31, default 0
  epoch?: number;                // Starting timestamp (milliseconds), default 2020-01-01 00:00:00 UTC
  isPrimaryKey?: boolean;        // Whether it's a primary key, default true
  description?: string;          // Description information
  generateOnInsert?: boolean;    // Auto-generate on insert, default true
  format?: 'number' | 'string';  // Output format, default number
}
```

### EnumInfo Decorator

Adds metadata information to enums.

```typescript
interface EnumInfoOptions {
  id: string;                    // Enum unique identifier
  code: string;                  // Unique identification code
  label: string;                 // Enum display name
  description?: string;          // Enum description
}
```

### EnumItem Decorator

Adds metadata information to enum items.

```typescript
interface EnumItemOptions {
  label: string;                 // Enum item display name
  icon?: string;                 // Icon name or path
  color?: string;                // Color code
  description?: string;          // Enum item description
  sort?: number;                 // Sort weight
  disabled?: boolean;            // Whether disabled
  metadata?: Record<string, any>; // Custom metadata
}
```

### FunctionCallingsProvider API

Core class providing Function Calling definitions and management.

```typescript
import { 
  FunctionCallingsProvider,
  getADBFunctionCallings, 
  getOpenAIFunctions, 
  getClaudeTools,
  getFunctionsByCategory,
  getNamingConventions 
} from 'adb-typeorm';

// Get all Function Calling definitions
const allFunctions = FunctionCallingsProvider.getAllFunctionCalllings();

// Get functions by specific category
const entityFunctions = FunctionCallingsProvider.getEntityManagementFunctions();
const columnFunctions = FunctionCallingsProvider.getColumnManagementFunctions();
const enumFunctions = FunctionCallingsProvider.getEnumManagementFunctions();

// Get AI platform compatible formats
const openAIFormat = FunctionCallingsProvider.getOpenAIFormat();
const claudeFormat = FunctionCallingsProvider.getClaudeFormat();

// Find function by name
const functionDef = FunctionCallingsProvider.getFunctionByName('create_adb_entity');

// Get naming conventions and validation rules
const conventions = FunctionCallingsProvider.getNamingConventions();
const rules = FunctionCallingsProvider.getValidationRules();

// Convenience functions
const functions = getADBFunctionCallings();
const openAIFuncs = getOpenAIFunctions();
const claudeTools = getClaudeTools();
const entityFuncs = getFunctionsByCategory('entity');
```

## 🔧 Utility Classes

### EntityInfoService

Provides entity-related utility functions.

```typescript
import { EntityInfoService } from 'adb-typeorm';

// Get all entity information
const entities = EntityInfoService.getAllEntityInfo([User, Order]);

// Find entity by code
const userEntity = EntityInfoService.getEntityByCode([User, Order], "user:admin:super");

// Find entities by tag
const userEntities = EntityInfoService.getEntitiesByTag([User, Order], "user");
```

### ColumnInfoService

Provides column-related utility functions.

```typescript
import { ColumnInfoService } from 'adb-typeorm';

// Get all column information
const columns = ColumnInfoService.getAllColumnInfo(User);

// Get media type columns
const mediaColumns = ColumnInfoService.getMediaColumns(User);

// Get enum type columns
const enumColumns = ColumnInfoService.getEnumColumns(User);

// Get auto increment ID type columns
const autoIncrementIdColumns = ColumnInfoService.getAutoIncrementIdColumns(User);

// Get GUID ID type columns
const guidIdColumns = ColumnInfoService.getGuidIdColumns(User);

// Get Snowflake ID type columns
const snowflakeIdColumns = ColumnInfoService.getSnowflakeIdColumns(User);

// Get all supported types
const allTypes = ColumnInfoService.getAllSupportedTypes();

// Get ADB extended types
const adbTypes = ColumnInfoService.getADBExtendTypes();

// Get TypeORM native types
const typeormTypes = ColumnInfoService.getTypeORMTypes();
```

### EnumInfoService

Provides enum-related utility functions.

```typescript
import { EnumInfoService } from 'adb-typeorm';

// Get enum information
const enumInfo = EnumInfoService.getEnumInfo(OrderStatus);

// Get all enum items
const items = EnumInfoService.getAllEnumItems(OrderStatus);

// Get enabled enum items
const enabledItems = EnumInfoService.getEnabledEnumItems(OrderStatus);

// Get enum items by sort order
const sortedItems = EnumInfoService.getSortedEnumItems(OrderStatus);

// Validate enum configuration
const validation = EnumInfoService.validateEnumInfo(OrderStatus);
console.log(validation.isValid, validation.errors);
```

### ADBEnum Utility Class

Provides ADB enhanced enum-related utility functions.

```typescript
import { ADBEnum } from 'adb-typeorm';

// Use ADBEnum instance methods
const orderStatus = ADBEnum.create({...});

// Get enum value
const value = orderStatus.getValue('PENDING_PAYMENT');

// Get enum item configuration
const config = orderStatus.getItemConfig('PENDING_PAYMENT');

// Get enabled enum items
const enabledItems = orderStatus.getEnabledItems();

// Validate enum configuration
const validation = orderStatus.validate();
```

### EnumMetadataService

Provides enum metadata persistence-related utility functions.

```typescript
import { EnumMetadataService } from 'adb-typeorm';

// Sync enum to database
await EnumMetadataService.syncEnumToDatabase(dataSource, OrderStatus);

// Load enum from database
const enumMetadata = await EnumMetadataService.loadFromDatabase(dataSource, 'order:status');

// Get all enum metadata
const allEnums = await EnumMetadataService.getAllEnums(dataSource);
```

## 📝 Design Philosophy

To maintain full compatibility with TypeORM, extended types are implemented through metadata:

- **Database Level**: Uses TypeORM native types (varchar, int, etc.)
- **Business Level**: Enhances functionality through `@ColumnInfo`'s `extendType` and corresponding configurations
- **Type Safety**: Complete TypeScript type support
- **Migration Friendly**: Database migration scripts generate normally
- **Metadata Persistence**: Enum configurations can be optionally persisted to `__enums__` table
- **AI Optimized**: Optimized for AI code generation and visual design
- **Type Support System**: Provides complete type query and management functionality, supporting ADB extended types and TypeORM native types
- **Unified Naming Convention**: All ADB extended types use `adb-` prefix for easy identification and management

## 📚 Directory Structure

```
ADB-TypeORM/
├── src/                     # Source code directory
│   ├── decorators/          # Decorator definitions
│   │   ├── EntityInfo.ts    # Entity info decorator
│   │   ├── ColumnInfo.ts    # Column info decorator
│   │   └── EnumInfo.ts      # Enum info decorator
│   ├── entities/            # Core entities
│   │   ├── EnumMetadata.ts  # Enum metadata entity
│   │   └── index.ts         # Entity exports
│   ├── utils/               # Utility classes and services
│   │   ├── ADBEnum.ts       # ADB enhanced enum class
│   │   ├── EnumMetadataService.ts # Enum metadata service
│   │   └── index.ts         # Utility class exports
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # Type definitions
│   ├── examples/            # Example code
│   │   ├── OrderStatus.ts   # Order status enum example
│   │   ├── User.ts          # User entity example
│   │   └── Order.ts         # Order entity example
│   └── index.ts             # Main entry file
├── test/                    # Test files
│   ├── ADBEnum.test.ts      # ADBEnum functionality tests
│   ├── EntityInfo-ColumnInfo.test.ts # Decorator tests
│   └── setup.ts             # Test configuration
├── dist/                    # Compiled output directory
├── docs/                    # Documentation directory (optional)
│   ├── CUSTOM_ENUM_GUIDE.md # ADB enum usage guide
│   └── ENUM_METADATA_GUIDE.md # Enum metadata guide
├── package.json
├── tsconfig.json
├── jest.config.js           # Jest test configuration
└── README.md
```

## 📚 Related Documentation

- [Function Calling Guide](./FUNCTION_CALLING_GUIDE.md) - Complete guide for AI model integration and function calling
- [TypeScript & TypeORM Compatibility Guide](./TYPESCRIPT_TYPEORM_COMPATIBILITY.md) - Version compatibility and issue resolution
- [ADBEnum Guide](./CUSTOM_ENUM_GUIDE.md) - ADB enhanced enum usage guide
- [Enum Metadata Guide](./ENUM_METADATA_GUIDE.md) - Enum persistence usage guide
- [API Documentation](#🛠️-api-documentation) - Complete API reference
- [Utility Classes](#🔧-utility-classes) - Various utility classes and services

## ⚠️ Important Notes

### TypeScript Version Compatibility
- **Recommended Version**: TypeScript 5.8.3
- **Avoid Using**: TypeScript 5.9.0+ versions may have decorator compatibility issues
- If you encounter decorator-related errors, please refer to [Compatibility Guide](./TYPESCRIPT_TYPEORM_COMPATIBILITY.md)

### Development Environment Setup

#### 1. Install Dependencies

```bash
# Recommended using yarn
yarn install

# Or using npm
npm install
```

#### 2. Build Project

```bash
# Build using yarn
yarn build

# Or using npm
npm run build

# Or directly using TypeScript compiler
npx tsc

# Watch mode build (for development)
yarn dev
# or
npm run dev
```

#### 3. Run Tests

```bash
# Run all tests
yarn test

# Or using npm
npm test

# Run specific test file
yarn test -- --testPathPattern=TypeSupport.test.ts

# Run specific test suite
yarn test -- --testPathPattern=ADBEnum.test.ts
```

#### 4. Code Quality Check

```bash
# Run ESLint check
yarn lint

# Or using npm
npm run lint

# Auto-fix ESLint issues (requires manual script addition)
yarn lint --fix
```

#### 5. Clean and Publish

```bash
# Clean build files
yarn clean

# Or using npm
npm run clean

# Build and prepare for publishing
yarn prepublishOnly

# Publish to npm
yarn publish

# Or using npm
npm publish
```

#### 6. Development Workflow

```bash
# Complete development workflow
yarn install    # Install dependencies
yarn dev        # Start watch mode build
yarn test       # Run tests
yarn lint       # Code quality check
yarn build      # Build production version
yarn clean      # Clean build files
```

#### 7. Quick Build Validation

```bash
# One-click validation of build status
yarn clean && yarn build && yarn test

# Verify type definitions are correctly generated
ls -la dist/
# Should see index.js, index.d.ts and other files

# Verify package contents
yarn pack --dry-run
# Check the list of files to be published
```

#### 8. Troubleshooting

```bash
# If encountering build issues, try cleaning and rebuilding
yarn clean && yarn build

# If encountering dependency issues, reinstall
rm -rf node_modules yarn.lock
yarn install

# Check TypeScript version compatibility
npx tsc --version

# Verify TypeORM version
yarn list typeorm

# Check Node.js version
node --version

# Clean all caches
yarn cache clean
```

#### 9. Build Optimization Suggestions

```bash
# Production environment build (optimized version)
NODE_ENV=production yarn build

# Check build artifact size
du -sh dist/

# Analyze build artifacts
npx tsc --listFiles | wc -l

# Verify build artifact integrity
node -e "console.log(require('./dist/index.js'))"
```

## 🐛 Known Issues

No known issues. If you encounter problems, please refer to [Compatibility Guide](./TYPESCRIPT_TYPEORM_COMPATIBILITY.md) or submit an [Issue](https://github.com/adisonshadow/ADB-TypeORM/issues).

## 🤝 Contributing

Welcome to submit Issues and Pull Requests! Before contributing code, please ensure:

1. Follow existing code style
2. Add corresponding unit tests
3. Update related documentation
4. Ensure all tests pass

## 📄 License

MIT License
