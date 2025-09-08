import 'reflect-metadata';
import { 
  getADBFunctionCallings, 
  getOpenAIFunctions, 
  getClaudeTools,
  getFunctionsByCategory,
  getNamingConventions,
  FunctionCallingsProvider 
} from '../utils/FunctionCallingsProvider';

/**
 * ADB-TypeORM Function Calling 使用示例
 * 展示如何在 AI 应用中使用 Function Calling 定义
 */

// ========== 基础用法示例 ==========

/**
 * 获取所有 Function Calling 定义
 */
export function getAllFunctions() {
  const functions = getADBFunctionCallings();
  
  console.log('所有可用的 Function Categories:');
  console.log(Object.keys(functions));
  // 输出: ['entityManagement', 'columnManagement', 'enumManagement', 'validation', 'query', 'utility']
  
  return functions;
}

/**
 * 获取特定分类的函数
 */
export function getEntityFunctions() {
  const entityFunctions = getFunctionsByCategory('entity');
  
  console.log('实体管理相关函数:');
  console.log(Object.keys(entityFunctions));
  // 输出: ['create_adb_entity', 'create_base_entity', 'add_entity_relation']
  
  return entityFunctions;
}

// ========== AI 集成示例 ==========

/**
 * OpenAI GPT 集成示例
 */
export function openAIIntegrationExample() {
  const functions = getOpenAIFunctions();
  
  // 模拟 OpenAI API 调用配置
  const openAIConfig = {
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: "创建一个用户实体，包含用户名、邮箱和头像字段"
      }
    ],
    functions: functions,
    function_call: "auto"
  };
  
  console.log('OpenAI API 配置示例:');
  console.log(JSON.stringify(openAIConfig, null, 2));
  
  return openAIConfig;
}

/**
 * Claude 集成示例
 */
export function claudeIntegrationExample() {
  const tools = getClaudeTools();
  
  // 模拟 Claude API 调用配置
  const claudeConfig = {
    model: 'claude-3-sonnet-20240229',
    max_tokens: 4000,
    tools: tools,
    messages: [
      {
        role: 'user',
        content: '创建一个订单实体，包含订单状态枚举'
      }
    ]
  };
  
  console.log('Claude API 配置示例:');
  console.log(JSON.stringify(claudeConfig, null, 2));
  
  return claudeConfig;
}

// ========== 实际应用场景示例 ==========

/**
 * 场景1: 创建用户管理系统
 */
export function userManagementScenario() {
  const functions = getADBFunctionCallings();
  
  // 1. 创建用户实体
  const createUserEntity = {
    function_name: "create_adb_entity",
    arguments: {
      entityName: "User",
      tableName: "users",
      entityInfo: {
        id: "entity-user-001",
        code: "user:admin:system",
        label: "系统用户",
        description: "系统用户信息管理实体",
        tags: ["user", "admin", "auth"]
      }
    }
  };
  
  // 2. 添加头像字段
  const addAvatarField = {
    function_name: "add_media_column",
    arguments: {
      columnName: "avatar",
      mediaConfig: {
        mediaType: "image",
        formats: ["jpg", "png", "webp"],
        maxSize: 5,
        isMultiple: false,
        storagePath: "uploads/avatars"
      },
      columnInfo: {
        id: "field_avatar_001",
        label: "用户头像"
      }
    }
  };
  
  // 3. 验证实体结构
  const validateEntity = {
    function_name: "validate_entity_structure",
    arguments: {
      entityName: "User",
      validationRules: {
        requireEntityInfo: true,
        requireColumnInfo: true,
        checkNamingConvention: true,
        validateTypeScript: true
      }
    }
  };
  
  return {
    scenario: "用户管理系统",
    steps: [createUserEntity, addAvatarField, validateEntity]
  };
}

/**
 * 场景2: 订单状态管理
 */
export function orderStatusScenario() {
  // 1. 创建订单状态枚举
  const createOrderStatusEnum = {
    function_name: "create_adb_enum",
    arguments: {
      enumName: "OrderStatus",
      enumInfo: {
        id: "enum-order-status-001",
        code: "order:status",
        label: "订单状态",
        description: "订单生命周期状态管理"
      },
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
          sort: 1,
          metadata: { timeoutMinutes: 30 }
        },
        PAID: {
          label: "已支付",
          icon: "check-circle",
          color: "#52c41a",
          sort: 2
        },
        PROCESSING: {
          label: "处理中",
          icon: "loading",
          color: "#1890ff",
          sort: 3
        }
      }
    }
  };
  
  // 2. 创建订单实体
  const createOrderEntity = {
    function_name: "create_adb_entity",
    arguments: {
      entityName: "Order",
      tableName: "orders",
      entityInfo: {
        id: "entity-order-001",
        code: "order:business:transaction",
        label: "订单实体",
        description: "订单业务实体"
      }
    }
  };
  
  // 3. 添加状态字段
  const addStatusField = {
    function_name: "add_enum_column",
    arguments: {
      columnName: "status",
      enumReference: "OrderStatus",
      enumConfig: {
        isMultiple: false,
        default: "PENDING_PAYMENT"
      },
      columnInfo: {
        id: "field_order_status_001",
        label: "订单状态"
      }
    }
  };
  
  // 4. 同步枚举到数据库
  const syncEnumToDb = {
    function_name: "sync_enum_to_database",
    arguments: {
      enumName: "OrderStatus",
      syncOptions: {
        overwrite: false,
        validateBeforeSync: true
      }
    }
  };
  
  return {
    scenario: "订单状态管理",
    steps: [createOrderStatusEnum, createOrderEntity, addStatusField, syncEnumToDb]
  };
}

// ========== 工具函数示例 ==========

/**
 * 获取命名规范
 */
export function getNamingConventionsExample() {
  const conventions = getNamingConventions();
  
  console.log('ADB-TypeORM 命名规范:');
  console.log('实体类名:', conventions.entity.className);
  console.log('表名:', conventions.entity.tableName);
  console.log('属性名:', conventions.column.propertyName);
  console.log('字段ID:', conventions.column.fieldId);
  console.log('枚举名:', conventions.enum.enumName);
  console.log('Code格式:', conventions.code.format);
  
  return conventions;
}

/**
 * 获取验证规则
 */
export function getValidationRulesExample() {
  const rules = FunctionCallingsProvider.getValidationRules();
  
  console.log('验证规则:');
  console.log('必需字段:', rules.required);
  console.log('格式规则:', rules.patterns);
  console.log('TypeScript规则:', rules.typescript);
  
  return rules;
}

/**
 * 根据函数名查找函数定义
 */
export function findFunctionExample() {
  const functionDef = FunctionCallingsProvider.getFunctionByName('create_adb_entity');
  
  if (functionDef) {
    console.log('找到函数定义:');
    console.log(`名称: ${functionDef.name}`);
    console.log(`描述: ${functionDef.description}`);
    console.log('参数:', functionDef.parameters);
  } else {
    console.log('未找到指定函数');
  }
  
  return functionDef;
}

// ========== 高级用法示例 ==========

/**
 * 自定义函数过滤器
 */
export function customFunctionFilter(category: string, filterCriteria: any) {
  const functions = getFunctionsByCategory(category as any);
  
  // 根据条件过滤函数
  const filteredFunctions = Object.entries(functions).filter(([name, func]: [string, any]) => {
    if (filterCriteria.namePattern) {
      return name.includes(filterCriteria.namePattern);
    }
    if (filterCriteria.hasRequiredParams) {
      return func.parameters.required && func.parameters.required.length > 0;
    }
    return true;
  });
  
  return Object.fromEntries(filteredFunctions);
}

/**
 * 生成函数调用示例代码
 */
export function generateFunctionCallExample(functionName: string) {
  const functionDef = FunctionCallingsProvider.getFunctionByName(functionName);
  
  if (!functionDef) {
    return null;
  }
  
  const exampleCall = {
    function_name: functionDef.name,
    arguments: generateExampleArguments(functionDef.parameters)
  };
  
  return exampleCall;
}

/**
 * 生成示例参数
 */
function generateExampleArguments(parameters: any): any {
  const args: any = {};
  
  if (parameters.properties) {
    Object.entries(parameters.properties).forEach(([key, prop]: [string, any]) => {
      if (parameters.required && parameters.required.includes(key)) {
        switch (prop.type) {
          case 'string':
            args[key] = `example_${key}`;
            break;
          case 'number':
            args[key] = 100;
            break;
          case 'boolean':
            args[key] = true;
            break;
          case 'array':
            args[key] = ['example'];
            break;
          case 'object':
            args[key] = generateExampleArguments(prop);
            break;
          default:
            args[key] = `example_${key}`;
        }
      }
    });
  }
  
  return args;
}

// ========== 导出所有示例 ==========

export const FunctionCallingsExamples = {
  // 基础用法
  getAllFunctions,
  getEntityFunctions,
  
  // AI 集成
  openAIIntegrationExample,
  claudeIntegrationExample,
  
  // 应用场景
  userManagementScenario,
  orderStatusScenario,
  
  // 工具函数
  getNamingConventionsExample,
  getValidationRulesExample,
  findFunctionExample,
  
  // 高级用法
  customFunctionFilter,
  generateFunctionCallExample
};