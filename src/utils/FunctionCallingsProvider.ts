import 'reflect-metadata';

/**
 * Function Calling Provider for ADB-TypeORM
 * Provides function definitions for AI models to generate accurate ADB-TypeORM code
 */
export class FunctionCallingsProvider {
  
  /**
   * Get all available function calling definitions
   */
  static getAllFunctionCalllings() {
    return {
      entityManagement: this.getEntityManagementFunctions(),
      columnManagement: this.getColumnManagementFunctions(),
      enumManagement: this.getEnumManagementFunctions(),
      validation: this.getValidationFunctions(),
      query: this.getQueryFunctions(),
      utility: this.getUtilityFunctions()
    };
  }

  /**
   * Get entity management functions
   */
  static getEntityManagementFunctions() {
    return {
      create_adb_entity: {
        name: "create_adb_entity",
        description: "创建一个 ADB-TypeORM 实体类，包含完整的装饰器和元数据信息",
        parameters: {
          type: "object",
          properties: {
            entityName: {
              type: "string",
              description: "实体类名称，使用 PascalCase"
            },
            tableName: {
              type: "string",
              description: "数据库表名，使用 snake_case"
            },
            entityInfo: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "实体唯一标识，如: entity-user-001"
                },
                code: {
                  type: "string",
                  description: "唯一识别码，使用冒号分隔，如: user:admin:super"
                },
                label: {
                  type: "string",
                  description: "实体显示名称"
                },
                description: {
                  type: "string",
                  description: "实体描述"
                },
                tags: {
                  type: "array",
                  items: { type: "string" },
                  description: "标签数组"
                }
              },
              required: ["id", "code", "label"]
            }
          },
          required: ["entityName", "tableName", "entityInfo"]
        }
      },

      create_base_entity: {
        name: "create_base_entity",
        description: "创建包含基础字段的实体（id, createdAt, updatedAt）",
        parameters: {
          type: "object",
          properties: {
            entityName: { type: "string" },
            tableName: { type: "string" },
            entityInfo: {
              type: "object",
              properties: {
                id: { type: "string" },
                code: { type: "string" },
                label: { type: "string" },
                description: { type: "string" },
                tags: { type: "array", items: { type: "string" } }
              },
              required: ["id", "code", "label"]
            },
            includeTimestamps: {
              type: "boolean",
              description: "是否包含时间戳字段",
              default: true
            }
          },
          required: ["entityName", "tableName", "entityInfo"]
        }
      },

      add_entity_relation: {
        name: "add_entity_relation",
        description: "为实体添加关联关系",
        parameters: {
          type: "object",
          properties: {
            relationType: {
              type: "string",
              enum: ["OneToOne", "OneToMany", "ManyToOne", "ManyToMany"],
              description: "关系类型"
            },
            targetEntity: {
              type: "string",
              description: "目标实体名称"
            },
            propertyName: {
              type: "string",
              description: "关系属性名称"
            },
            joinColumn: {
              type: "string",
              description: "外键列名（可选）"
            },
            columnInfo: {
              type: "object",
              properties: {
                id: { type: "string" },
                label: { type: "string" }
              },
              required: ["id", "label"]
            }
          },
          required: ["relationType", "targetEntity", "propertyName", "columnInfo"]
        }
      }
    };
  }

  /**
   * Get column management functions
   */
  static getColumnManagementFunctions() {
    return {
      add_entity_column: {
        name: "add_entity_column",
        description: "为实体添加一个列字段，包含 TypeORM 列定义和 ColumnInfo 元数据",
        parameters: {
          type: "object",
          properties: {
            columnName: {
              type: "string",
              description: "列名称，使用 camelCase"
            },
            columnType: {
              type: "string",
              enum: ["string", "number", "boolean", "Date", "array"],
              description: "TypeScript 类型"
            },
            typeormConfig: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  description: "TypeORM 列类型，如: varchar, int, json, timestamp"
                },
                length: {
                  type: "number",
                  description: "字符串长度限制"
                },
                nullable: {
                  type: "boolean",
                  description: "是否允许为空"
                },
                unique: {
                  type: "boolean",
                  description: "是否唯一约束"
                },
                default: {
                  type: ["string", "number", "boolean"],
                  description: "默认值"
                }
              }
            },
            columnInfo: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "列唯一标识，如: field_username_001"
                },
                label: {
                  type: "string",
                  description: "列显示名称"
                },
                extendType: {
                  type: "string",
                  enum: ["media", "enum"],
                  description: "扩展类型标识"
                }
              },
              required: ["id", "label"]
            }
          },
          required: ["columnName", "columnType", "columnInfo"]
        }
      },

      add_media_column: {
        name: "add_media_column",
        description: "添加媒体类型的列字段",
        parameters: {
          type: "object",
          properties: {
            columnName: {
              type: "string",
              description: "列名称"
            },
            mediaConfig: {
              type: "object",
              properties: {
                mediaType: {
                  type: "string",
                  enum: ["image", "video", "audio", "document", "file"],
                  description: "媒体类型"
                },
                formats: {
                  type: "array",
                  items: { type: "string" },
                  description: "支持的文件格式"
                },
                maxSize: {
                  type: "number",
                  description: "最大文件大小(MB)"
                },
                isMultiple: {
                  type: "boolean",
                  description: "是否支持多文件"
                },
                storagePath: {
                  type: "string",
                  description: "存储路径"
                }
              },
              required: ["mediaType", "formats"]
            },
            columnInfo: {
              type: "object",
              properties: {
                id: { type: "string" },
                label: { type: "string" }
              },
              required: ["id", "label"]
            }
          },
          required: ["columnName", "mediaConfig", "columnInfo"]
        }
      },

      add_enum_column: {
        name: "add_enum_column",
        description: "添加枚举类型的列字段",
        parameters: {
          type: "object",
          properties: {
            columnName: {
              type: "string",
              description: "列名称"
            },
            enumReference: {
              type: "string",
              description: "枚举引用名称"
            },
            enumConfig: {
              type: "object",
              properties: {
                isMultiple: {
                  type: "boolean",
                  description: "是否支持多选",
                  default: false
                },
                default: {
                  type: "string",
                  description: "默认值"
                }
              }
            },
            columnInfo: {
              type: "object",
              properties: {
                id: { type: "string" },
                label: { type: "string" }
              },
              required: ["id", "label"]
            }
          },
          required: ["columnName", "enumReference", "columnInfo"]
        }
      },

      add_multiple_columns: {
        name: "add_multiple_columns",
        description: "批量添加多个列字段",
        parameters: {
          type: "object",
          properties: {
            columns: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  columnName: { type: "string" },
                  columnType: { type: "string" },
                  typeormConfig: { type: "object" },
                  columnInfo: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      label: { type: "string" }
                    },
                    required: ["id", "label"]
                  }
                },
                required: ["columnName", "columnType", "columnInfo"]
              }
            }
          },
          required: ["columns"]
        }
      }
    };
  }

  /**
   * Get enum management functions
   */
  static getEnumManagementFunctions() {
    return {
      create_adb_enum: {
        name: "create_adb_enum",
        description: "创建 ADB 增强枚举",
        parameters: {
          type: "object",
          properties: {
            enumName: {
              type: "string",
              description: "枚举名称，使用 PascalCase"
            },
            enumInfo: {
              type: "object",
              properties: {
                id: { type: "string" },
                code: { type: "string" },
                label: { type: "string" },
                description: { type: "string" }
              },
              required: ["id", "code", "label"]
            },
            values: {
              type: "object",
              description: "枚举键值对映射",
              additionalProperties: { type: "string" }
            },
            items: {
              type: "object",
              description: "枚举项配置",
              additionalProperties: {
                type: "object",
                properties: {
                  label: { type: "string" },
                  icon: { type: "string" },
                  color: { type: "string" },
                  description: { type: "string" },
                  sort: { type: "number" },
                  disabled: { type: "boolean" },
                  metadata: { type: "object" }
                },
                required: ["label"]
              }
            }
          },
          required: ["enumName", "enumInfo", "values", "items"]
        }
      },

      update_enum_item: {
        name: "update_enum_item",
        description: "更新枚举项配置",
        parameters: {
          type: "object",
          properties: {
            enumName: { type: "string" },
            itemKey: { type: "string" },
            itemConfig: {
              type: "object",
              properties: {
                label: { type: "string" },
                icon: { type: "string" },
                color: { type: "string" },
                description: { type: "string" },
                sort: { type: "number" },
                disabled: { type: "boolean" },
                metadata: { type: "object" }
              }
            }
          },
          required: ["enumName", "itemKey", "itemConfig"]
        }
      },

      sync_enum_to_database: {
        name: "sync_enum_to_database",
        description: "将枚举元数据同步到数据库",
        parameters: {
          type: "object",
          properties: {
            enumName: { type: "string" },
            syncOptions: {
              type: "object",
              properties: {
                overwrite: {
                  type: "boolean",
                  description: "是否覆盖已存在的记录",
                  default: false
                },
                validateBeforeSync: {
                  type: "boolean",
                  description: "同步前是否验证",
                  default: true
                }
              }
            }
          },
          required: ["enumName"]
        }
      }
    };
  }

  /**
   * Get validation functions
   */
  static getValidationFunctions() {
    return {
      validate_entity_structure: {
        name: "validate_entity_structure",
        description: "验证实体结构的完整性和规范性",
        parameters: {
          type: "object",
          properties: {
            entityName: { type: "string" },
            validationRules: {
              type: "object",
              properties: {
                requireEntityInfo: { type: "boolean", default: true },
                requireColumnInfo: { type: "boolean", default: true },
                checkNamingConvention: { type: "boolean", default: true },
                validateTypeScript: { type: "boolean", default: true }
              }
            }
          },
          required: ["entityName"]
        }
      },

      validate_enum_configuration: {
        name: "validate_enum_configuration",
        description: "验证枚举配置的完整性和一致性",
        parameters: {
          type: "object",
          properties: {
            enumName: { type: "string" },
            validationOptions: {
              type: "object",
              properties: {
                checkRequiredFields: { type: "boolean", default: true },
                validateItemConfig: { type: "boolean", default: true },
                checkSortOrder: { type: "boolean", default: false }
              }
            }
          },
          required: ["enumName"]
        }
      },

      check_code_quality: {
        name: "check_code_quality",
        description: "检查生成代码的质量和规范性",
        parameters: {
          type: "object",
          properties: {
            checkItems: {
              type: "array",
              items: {
                type: "string",
                enum: [
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
    };
  }

  /**
   * Get query functions
   */
  static getQueryFunctions() {
    return {
      get_entity_metadata: {
        name: "get_entity_metadata",
        description: "获取实体的完整元数据信息",
        parameters: {
          type: "object",
          properties: {
            entityName: { type: "string" },
            includeColumns: { type: "boolean", default: true },
            includeRelations: { type: "boolean", default: true }
          },
          required: ["entityName"]
        }
      },

      search_entities: {
        name: "search_entities",
        description: "根据条件搜索实体",
        parameters: {
          type: "object",
          properties: {
            searchCriteria: {
              type: "object",
              properties: {
                byTag: { type: "string" },
                byCode: { type: "string" },
                byLabel: { type: "string" },
                hasMediaColumns: { type: "boolean" },
                hasEnumColumns: { type: "boolean" }
              }
            }
          }
        }
      },

      get_enum_metadata: {
        name: "get_enum_metadata",
        description: "获取枚举的元数据信息",
        parameters: {
          type: "object",
          properties: {
            enumName: { type: "string" },
            includeItems: { type: "boolean", default: true }
          },
          required: ["enumName"]
        }
      }
    };
  }

  /**
   * Get utility functions
   */
  static getUtilityFunctions() {
    return {
      generate_entity_code: {
        name: "generate_entity_code",
        description: "生成完整的实体代码",
        parameters: {
          type: "object",
          properties: {
            entityConfig: { type: "object" },
            codeOptions: {
              type: "object",
              properties: {
                includeImports: { type: "boolean", default: true },
                includeComments: { type: "boolean", default: true },
                formatCode: { type: "boolean", default: true }
              }
            }
          },
          required: ["entityConfig"]
        }
      },

      generate_enum_code: {
        name: "generate_enum_code",
        description: "生成 ADB 枚举代码",
        parameters: {
          type: "object",
          properties: {
            enumConfig: { type: "object" },
            codeOptions: {
              type: "object",
              properties: {
                includeTypeAssertion: { type: "boolean", default: true },
                includeHelperMethods: { type: "boolean", default: true }
              }
            }
          },
          required: ["enumConfig"]
        }
      },

      handle_generation_error: {
        name: "handle_generation_error",
        description: "处理代码生成过程中的错误",
        parameters: {
          type: "object",
          properties: {
            errorType: {
              type: "string",
              enum: ["validation", "syntax", "type", "constraint"],
              description: "错误类型"
            },
            errorMessage: { type: "string" },
            suggestedFix: { type: "string" }
          },
          required: ["errorType", "errorMessage"]
        }
      }
    };
  }

  /**
   * Get functions by category
   */
  static getFunctionsByCategory(category: 'entity' | 'column' | 'enum' | 'validation' | 'query' | 'utility') {
    const categoryMap = {
      entity: this.getEntityManagementFunctions(),
      column: this.getColumnManagementFunctions(),
      enum: this.getEnumManagementFunctions(),
      validation: this.getValidationFunctions(),
      query: this.getQueryFunctions(),
      utility: this.getUtilityFunctions()
    };

    return categoryMap[category] || {};
  }

  /**
   * Get function by name
   */
  static getFunctionByName(functionName: string) {
    const allFunctions = this.getAllFunctionCalllings();
    
    for (const category of Object.values(allFunctions)) {
      if ((category as any)[functionName]) {
        return (category as any)[functionName];
      }
    }
    
    return null;
  }

  /**
   * Get OpenAI compatible format
   */
  static getOpenAIFormat() {
    const allFunctions = this.getAllFunctionCalllings();
    const functions: any[] = [];

    Object.values(allFunctions).forEach(category => {
      Object.values(category as any).forEach((func: any) => {
        functions.push(func);
      });
    });

    return functions;
  }

  /**
   * Get Claude compatible format
   */
  static getClaudeFormat() {
    const allFunctions = this.getAllFunctionCalllings();
    const tools: any[] = [];

    Object.values(allFunctions).forEach(category => {
      Object.values(category as any).forEach((func: any) => {
        tools.push({
          name: func.name,
          description: func.description,
          input_schema: func.parameters
        });
      });
    });

    return tools;
  }

  /**
   * Get naming conventions
   */
  static getNamingConventions() {
    return {
      entity: {
        className: "PascalCase (e.g., User, OrderItem)",
        tableName: "snake_case (e.g., users, order_items)"
      },
      column: {
        propertyName: "camelCase (e.g., firstName, createdAt)",
        fieldId: "field_name_001 format"
      },
      enum: {
        enumName: "PascalCase (e.g., OrderStatus, UserRole)",
        enumId: "enum-name-001 format"
      },
      code: {
        format: "namespace:category:item (e.g., user:admin:super)",
        separator: ":"
      }
    };
  }

  /**
   * Get validation rules
   */
  static getValidationRules() {
    return {
      required: {
        entityInfo: ["id", "code", "label"],
        columnInfo: ["id", "label"],
        enumInfo: ["id", "code", "label"],
        enumItem: ["label"]
      },
      patterns: {
        id: "^[a-zA-Z0-9-]+$",
        code: "^[a-zA-Z0-9:]+$",
        entityName: "^[A-Z][a-zA-Z0-9]*$",
        tableName: "^[a-z][a-z0-9_]*$",
        columnName: "^[a-z][a-zA-Z0-9]*$"
      },
      typescript: {
        propertyAssertion: "Properties must use ! assertion (e.g., id!: number)",
        optionalProperties: "Optional properties use ? operator (e.g., description?: string)",
        indexSignature: "Dynamic classes need [key: string]: any for dynamic properties"
      }
    };
  }
}

/**
 * Shortcut functions for common use cases
 */

/**
 * Get all function calling definitions
 */
export function getADBFunctionCallings() {
  return FunctionCallingsProvider.getAllFunctionCalllings();
}

/**
 * Get OpenAI compatible function definitions
 */
export function getOpenAIFunctions() {
  return FunctionCallingsProvider.getOpenAIFormat();
}

/**
 * Get Claude compatible tool definitions
 */
export function getClaudeTools() {
  return FunctionCallingsProvider.getClaudeFormat();
}

/**
 * Get function by category
 */
export function getFunctionsByCategory(category: 'entity' | 'column' | 'enum' | 'validation' | 'query' | 'utility') {
  return FunctionCallingsProvider.getFunctionsByCategory(category);
}

/**
 * Get naming conventions
 */
export function getNamingConventions() {
  return FunctionCallingsProvider.getNamingConventions();
}