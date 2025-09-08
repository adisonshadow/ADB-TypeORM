# ADB-TypeORM Function Calling 指南

本文档详细说明了如何使用 Function Calling 来提升 AI 模型生成 ADB-TypeORM 代码的准确性和规范性。

## 📋 目录

- [概述](#概述)
- [核心 Function Calling 定义](#核心-function-calling-定义)
- [实体管理 Functions](#实体管理-functions)
- [列管理 Functions](#列管理-functions)
- [枚举管理 Functions](#枚举管理-functions)
- [验证 Functions](#验证-functions)
- [使用示例](#使用示例)
- [最佳实践](#最佳实践)

## 🎯 概述

Function Calling 可以帮助 AI 模型：
- **规范化生成**：确保生成的代码符合 ADB-TypeORM 规范
- **类型安全**：自动处理 TypeScript 类型定义和约束
- **元数据完整性**：确保所有必需的元数据信息都被正确设置
- **避免常见错误**：通过预定义的函数避免装饰器使用错误
- **提高一致性**：确保生成的代码风格和结构一致

## 🔧 核心 Function Calling 定义

### 1. 创建实体 Function

```json
{
  "name": "create_adb_entity",
  "description": "创建一个 ADB-TypeORM 实体类，包含完整的装饰器和元数据信息",
  "parameters": {
    "type": "object",
    "properties": {
      "entityName": {
        "type": "string",
        "description": "实体类名称，使用 PascalCase"
      },
      "tableName": {
        "type": "string",
        "description": "数据库表名，使用 snake_case"
      },
      "entityInfo": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "实体唯一标识，如: entity-user-001"
          },
          "code": {
            "type": "string",
            "description": "唯一识别码，使用冒号分隔，如: user:admin:super"
          },
          "label": {
            "type": "string",
            "description": "实体显示名称"
          },
          "description": {
            "type": "string",
            "description": "实体描述"
          },
          "tags": {
            "type": "array",
            "items": {"type": "string"},
            "description": "标签数组"
          }
        },
        "required": ["id", "code", "label"]
      }
    },
    "required": ["entityName", "tableName", "entityInfo"]
  }
}
```

### 2. 添加列 Function

```json
{
  "name": "add_entity_column",
  "description": "为实体添加一个列字段，包含 TypeORM 列定义和 ColumnInfo 元数据",
  "parameters": {
    "type": "object",
    "properties": {
      "columnName": {
        "type": "string",
        "description": "列名称，使用 camelCase"
      },
      "columnType": {
        "type": "string",
        "enum": ["string", "number", "boolean", "Date", "array"],
        "description": "TypeScript 类型"
      },
      "typeormConfig": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "description": "TypeORM 列类型，如: varchar, int, json, timestamp"
          },
          "length": {
            "type": "number",
            "description": "字符串长度限制"
          },
          "nullable": {
            "type": "boolean",
            "description": "是否允许为空"
          },
          "unique": {
            "type": "boolean",
            "description": "是否唯一约束"
          },
          "default": {
            "type": ["string", "number", "boolean"],
            "description": "默认值"
          }
        }
      },
      "columnInfo": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "列唯一标识，如: field_username_001"
          },
          "label": {
            "type": "string",
            "description": "列显示名称"
          },
          "extendType": {
            "type": "string",
            "enum": ["media", "enum"],
            "description": "扩展类型标识"
          }
        },
        "required": ["id", "label"]
      }
    },
    "required": ["columnName", "columnType", "columnInfo"]
  }
}
```

### 3. 创建媒体列 Function

```json
{
  "name": "add_media_column",
  "description": "添加媒体类型的列字段",
  "parameters": {
    "type": "object",
    "properties": {
      "columnName": {
        "type": "string",
        "description": "列名称"
      },
      "mediaConfig": {
        "type": "object",
        "properties": {
          "mediaType": {
            "type": "string",
            "enum": ["image", "video", "audio", "document", "file"],
            "description": "媒体类型"
          },
          "formats": {
            "type": "array",
            "items": {"type": "string"},
            "description": "支持的文件格式"
          },
          "maxSize": {
            "type": "number",
            "description": "最大文件大小(MB)"
          },
          "isMultiple": {
            "type": "boolean",
            "description": "是否支持多文件"
          },
          "storagePath": {
            "type": "string",
            "description": "存储路径"
          }
        },
        "required": ["mediaType", "formats"]
      },
      "columnInfo": {
        "type": "object",
        "properties": {
          "id": {"type": "string"},
          "label": {"type": "string"}
        },
        "required": ["id", "label"]
      }
    },
    "required": ["columnName", "mediaConfig", "columnInfo"]
  }
}
```

### 4. 创建 ADB 枚举 Function

```json
{
  "name": "create_adb_enum",
  "description": "创建 ADB 增强枚举",
  "parameters": {
    "type": "object",
    "properties": {
      "enumName": {
        "type": "string",
        "description": "枚举名称，使用 PascalCase"
      },
      "enumInfo": {
        "type": "object",
        "properties": {
          "id": {"type": "string"},
          "code": {"type": "string"},
          "label": {"type": "string"},
          "description": {"type": "string"}
        },
        "required": ["id", "code", "label"]
      },
      "values": {
        "type": "object",
        "description": "枚举键值对映射",
        "additionalProperties": {"type": "string"}
      },
      "items": {
        "type": "object",
        "description": "枚举项配置",
        "additionalProperties": {
          "type": "object",
          "properties": {
            "label": {"type": "string"},
            "icon": {"type": "string"},
            "color": {"type": "string"},
            "description": {"type": "string"},
            "sort": {"type": "number"},
            "disabled": {"type": "boolean"},
            "metadata": {"type": "object"}
          },
          "required": ["label"]
        }
      }
    },
    "required": ["enumName", "enumInfo", "values", "items"]
  }
}
```

### 5. 添加枚举列 Function

```json
{
  "name": "add_enum_column",
  "description": "添加枚举类型的列字段",
  "parameters": {
    "type": "object",
    "properties": {
      "columnName": {
        "type": "string",
        "description": "列名称"
      },
      "enumReference": {
        "type": "string",
        "description": "枚举引用名称"
      },
      "enumConfig": {
        "type": "object",
        "properties": {
          "isMultiple": {
            "type": "boolean",
            "description": "是否支持多选",
            "default": false
          },
          "default": {
            "type": "string",
            "description": "默认值"
          }
        }
      },
      "columnInfo": {
        "type": "object",
        "properties": {
          "id": {"type": "string"},
          "label": {"type": "string"}
        },
        "required": ["id", "label"]
      }
    },
    "required": ["columnName", "enumReference", "columnInfo"]
  }
}
```

## 🏗️ 实体管理 Functions

### 创建基础实体

```json
{
  "name": "create_base_entity",
  "description": "创建包含基础字段的实体（id, createdAt, updatedAt）",
  "parameters": {
    "type": "object",
    "properties": {
      "entityName": {"type": "string"},
      "tableName": {"type": "string"},
      "entityInfo": {
        "type": "object",
        "properties": {
          "id": {"type": "string"},
          "code": {"type": "string"},
          "label": {"type": "string"},
          "description": {"type": "string"},
          "tags": {"type": "array", "items": {"type": "string"}}
        },
        "required": ["id", "code", "label"]
      },
      "includeTimestamps": {
        "type": "boolean",
        "description": "是否包含时间戳字段",
        "default": true
      }
    },
    "required": ["entityName", "tableName", "entityInfo"]
  }
}
```

### 实体关系管理

```json
{
  "name": "add_entity_relation",
  "description": "为实体添加关联关系",
  "parameters": {
    "type": "object",
    "properties": {
      "relationType": {
        "type": "string",
        "enum": ["OneToOne", "OneToMany", "ManyToOne", "ManyToMany"],
        "description": "关系类型"
      },
      "targetEntity": {
        "type": "string",
        "description": "目标实体名称"
      },
      "propertyName": {
        "type": "string",
        "description": "关系属性名称"
      },
      "joinColumn": {
        "type": "string",
        "description": "外键列名（可选）"
      },
      "columnInfo": {
        "type": "object",
        "properties": {
          "id": {"type": "string"},
          "label": {"type": "string"}
        },
        "required": ["id", "label"]
      }
    },
    "required": ["relationType", "targetEntity", "propertyName", "columnInfo"]
  }
}
```

## 📊 列管理 Functions

### 添加索引

```json
{
  "name": "add_column_index",
  "description": "为列添加数据库索引",
  "parameters": {
    "type": "object",
    "properties": {
      "columnName": {"type": "string"},
      "indexType": {
        "type": "string",
        "enum": ["INDEX", "UNIQUE", "FULLTEXT"],
        "description": "索引类型"
      },
      "indexName": {
        "type": "string",
        "description": "自定义索引名称（可选）"
      }
    },
    "required": ["columnName", "indexType"]
  }
}
```

### 批量添加列

```json
{
  "name": "add_multiple_columns",
  "description": "批量添加多个列字段",
  "parameters": {
    "type": "object",
    "properties": {
      "columns": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "columnName": {"type": "string"},
            "columnType": {"type": "string"},
            "typeormConfig": {"type": "object"},
            "columnInfo": {
              "type": "object",
              "properties": {
                "id": {"type": "string"},
                "label": {"type": "string"}
              },
              "required": ["id", "label"]
            }
          },
          "required": ["columnName", "columnType", "columnInfo"]
        }
      }
    },
    "required": ["columns"]
  }
}
```

## 🎨 枚举管理 Functions

### 更新枚举配置

```json
{
  "name": "update_enum_item",
  "description": "更新枚举项配置",
  "parameters": {
    "type": "object",
    "properties": {
      "enumName": {"type": "string"},
      "itemKey": {"type": "string"},
      "itemConfig": {
        "type": "object",
        "properties": {
          "label": {"type": "string"},
          "icon": {"type": "string"},
          "color": {"type": "string"},
          "description": {"type": "string"},
          "sort": {"type": "number"},
          "disabled": {"type": "boolean"},
          "metadata": {"type": "object"}
        }
      }
    },
    "required": ["enumName", "itemKey", "itemConfig"]
  }
}
```

### 枚举元数据持久化

```json
{
  "name": "sync_enum_to_database",
  "description": "将枚举元数据同步到数据库",
  "parameters": {
    "type": "object",
    "properties": {
      "enumName": {"type": "string"},
      "syncOptions": {
        "type": "object",
        "properties": {
          "overwrite": {
            "type": "boolean",
            "description": "是否覆盖已存在的记录",
            "default": false
          },
          "validateBeforeSync": {
            "type": "boolean",
            "description": "同步前是否验证",
            "default": true
          }
        }
      }
    },
    "required": ["enumName"]
  }
}
```

## ✅ 验证 Functions

### 验证实体结构

```json
{
  "name": "validate_entity_structure",
  "description": "验证实体结构的完整性和规范性",
  "parameters": {
    "type": "object",
    "properties": {
      "entityName": {"type": "string"},
      "validationRules": {
        "type": "object",
        "properties": {
          "requireEntityInfo": {"type": "boolean", "default": true},
          "requireColumnInfo": {"type": "boolean", "default": true},
          "checkNamingConvention": {"type": "boolean", "default": true},
          "validateTypeScript": {"type": "boolean", "default": true}
        }
      }
    },
    "required": ["entityName"]
  }
}
```

### 验证枚举配置

```json
{
  "name": "validate_enum_configuration",
  "description": "验证枚举配置的完整性和一致性",
  "parameters": {
    "type": "object",
    "properties": {
      "enumName": {"type": "string"},
      "validationOptions": {
        "type": "object",
        "properties": {
          "checkRequiredFields": {"type": "boolean", "default": true},
          "validateItemConfig": {"type": "boolean", "default": true},
          "checkSortOrder": {"type": "boolean", "default": false}
        }
      }
    },
    "required": ["enumName"]
  }
}
```

## 🔍 查询 Functions

### 获取实体信息

```json
{
  "name": "get_entity_metadata",
  "description": "获取实体的完整元数据信息",
  "parameters": {
    "type": "object",
    "properties": {
      "entityName": {"type": "string"},
      "includeColumns": {"type": "boolean", "default": true},
      "includeRelations": {"type": "boolean", "default": true}
    },
    "required": ["entityName"]
  }
}
```

### 搜索实体

```json
{
  "name": "search_entities",
  "description": "根据条件搜索实体",
  "parameters": {
    "type": "object",
    "properties": {
      "searchCriteria": {
        "type": "object",
        "properties": {
          "byTag": {"type": "string"},
          "byCode": {"type": "string"},
          "byLabel": {"type": "string"},
          "hasMediaColumns": {"type": "boolean"},
          "hasEnumColumns": {"type": "boolean"}
        }
      }
    }
  }
}
```

## 💡 使用示例

### 示例 1：创建用户实体

```javascript
// AI 模型可以调用这个 function
const userEntity = {
  "function_name": "create_adb_entity",
  "arguments": {
    "entityName": "User",
    "tableName": "users",
    "entityInfo": {
      "id": "entity-user-001",
      "code": "user:admin:system",
      "label": "系统用户",
      "description": "系统用户信息管理实体",
      "tags": ["user", "admin", "auth"]
    }
  }
};

// 生成的代码
/*
@Entity("users")
@EntityInfo({
  id: "entity-user-001",
  code: "user:admin:system",
  label: "系统用户",
  description: "系统用户信息管理实体",
  tags: ["user", "admin", "auth"]
})
export class User {
  @PrimaryGeneratedColumn()
  @ColumnInfo({
    id: "field_id_001",
    label: "Primary Key ID"
  })
  id!: number;
}
*/
```

### 示例 2：添加头像字段

```javascript
const avatarColumn = {
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
      "label": "用户头像"
    }
  }
};
```

### 示例 3：创建订单状态枚举

```javascript
const orderStatusEnum = {
  "function_name": "create_adb_enum",
  "arguments": {
    "enumName": "OrderStatus",
    "enumInfo": {
      "id": "enum-order-status-001",
      "code": "order:status",
      "label": "订单状态",
      "description": "订单生命周期状态管理"
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
        "label": "待支付",
        "icon": "clock-circle",
        "color": "#faad14",
        "sort": 1
      },
      "PAID": {
        "label": "已支付",
        "icon": "check-circle",
        "color": "#52c41a",
        "sort": 2
      }
    }
  }
};
```

## 🎯 最佳实践

### 1. Function Calling 顺序

推荐的调用顺序：
1. `create_adb_entity` - 创建基础实体
2. `add_entity_column` - 添加基础列
3. `add_media_column` / `add_enum_column` - 添加特殊类型列
4. `create_adb_enum` - 创建相关枚举
5. `validate_entity_structure` - 验证实体结构

### 2. 命名规范

- **实体名称**: PascalCase (`User`, `OrderItem`)
- **表名**: snake_case (`users`, `order_items`)
- **列名**: camelCase (`firstName`, `createdAt`)
- **枚举名**: PascalCase (`OrderStatus`, `UserRole`)
- **ID 格式**: `entity-name-001`, `field-name-001`, `enum-name-001`
- **Code 格式**: `namespace:category:item` (`user:admin:super`)

### 3. 错误处理

```json
{
  "name": "handle_generation_error",
  "description": "处理代码生成过程中的错误",
  "parameters": {
    "type": "object",
    "properties": {
      "errorType": {
        "type": "string",
        "enum": ["validation", "syntax", "type", "constraint"],
        "description": "错误类型"
      },
      "errorMessage": {"type": "string"},
      "suggestedFix": {"type": "string"}
    },
    "required": ["errorType", "errorMessage"]
  }
}
```

### 4. 代码质量检查

```json
{
  "name": "check_code_quality",
  "description": "检查生成代码的质量和规范性",
  "parameters": {
    "type": "object",
    "properties": {
      "checkItems": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": [
            "typescript_syntax",
            "decorator_usage",
            "naming_convention",
            "type_safety",
            "metadata_completeness"
          ]
        }
      }
    }
  }
}
```

## 📚 集成指南

### OpenAI GPT Integration

```python
import openai

def generate_adb_entity(entity_spec):
    functions = [
        {
            "name": "create_adb_entity",
            "description": "创建 ADB-TypeORM 实体",
            "parameters": {
                # ... function parameters
            }
        }
    ]
    
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": f"创建实体: {entity_spec}"}
        ],
        functions=functions,
        function_call="auto"
    )
    
    return response
```

### Claude Integration

```javascript
const anthropic = new Anthropic({
  apiKey: 'your-api-key',
});

const message = await anthropic.messages.create({
  model: 'claude-3-sonnet-20240229',
  max_tokens: 4000,
  tools: [
    {
      name: 'create_adb_entity',
      description: '创建 ADB-TypeORM 实体',
      input_schema: {
        // ... schema definition
      }
    }
  ],
  messages: [
    {role: 'user', content: '创建一个用户实体'}
  ]
});
```

## 🔄 持续改进

### Function 扩展建议

1. **代码生成模板**: 添加更多预定义模板
2. **批量操作**: 支持批量创建多个相关实体
3. **代码优化**: 自动优化生成的代码结构
4. **文档生成**: 自动生成 API 文档
5. **测试生成**: 自动生成单元测试代码

---

*最后更新：2025-01-07*  
*维护者：ADB-TypeORM 开发团队*