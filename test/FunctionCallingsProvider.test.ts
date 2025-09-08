import 'reflect-metadata';
import {
  FunctionCallingsProvider,
  getADBFunctionCallings,
  getOpenAIFunctions,
  getClaudeTools,
  getFunctionsByCategory,
  getNamingConventions
} from '../src/utils/FunctionCallingsProvider';

describe('FunctionCallingsProvider', () => {
  describe('基础功能测试', () => {
    test('应该能够获取所有 Function Calling 定义', () => {
      const functions = getADBFunctionCallings();
      
      expect(functions).toBeDefined();
      expect(typeof functions).toBe('object');
      
      // 检查包含的分类
      expect(functions).toHaveProperty('entityManagement');
      expect(functions).toHaveProperty('columnManagement');
      expect(functions).toHaveProperty('enumManagement');
      expect(functions).toHaveProperty('validation');
      expect(functions).toHaveProperty('query');
      expect(functions).toHaveProperty('utility');
    });

    test('应该能够获取特定分类的函数', () => {
      const entityFunctions = getFunctionsByCategory('entity');
      
      expect(entityFunctions).toBeDefined();
      expect(typeof entityFunctions).toBe('object');
      
      // 检查包含的实体管理函数
      expect(entityFunctions).toHaveProperty('create_adb_entity');
      expect(entityFunctions).toHaveProperty('create_base_entity');
      expect(entityFunctions).toHaveProperty('add_entity_relation');
    });

    test('应该能够根据函数名查找函数定义', () => {
      const functionDef = FunctionCallingsProvider.getFunctionByName('create_adb_entity');
      
      expect(functionDef).toBeDefined();
      expect(functionDef).toHaveProperty('name', 'create_adb_entity');
      expect(functionDef).toHaveProperty('description');
      expect(functionDef).toHaveProperty('parameters');
      expect(functionDef.parameters).toHaveProperty('type', 'object');
      expect(functionDef.parameters).toHaveProperty('properties');
      expect(functionDef.parameters).toHaveProperty('required');
    });

    test('查找不存在的函数应该返回null', () => {
      const functionDef = FunctionCallingsProvider.getFunctionByName('non_existing_function');
      
      expect(functionDef).toBeNull();
    });
  });

  describe('AI 平台兼容性测试', () => {
    test('应该能够生成 OpenAI 兼容格式', () => {
      const openAIFunctions = getOpenAIFunctions();
      
      expect(Array.isArray(openAIFunctions)).toBe(true);
      expect(openAIFunctions.length).toBeGreaterThan(0);
      
      // 检查第一个函数的格式
      const firstFunc = openAIFunctions[0];
      expect(firstFunc).toHaveProperty('name');
      expect(firstFunc).toHaveProperty('description');
      expect(firstFunc).toHaveProperty('parameters');
    });

    test('应该能够生成 Claude 兼容格式', () => {
      const claudeTools = getClaudeTools();
      
      expect(Array.isArray(claudeTools)).toBe(true);
      expect(claudeTools.length).toBeGreaterThan(0);
      
      // 检查第一个工具的格式
      const firstTool = claudeTools[0];
      expect(firstTool).toHaveProperty('name');
      expect(firstTool).toHaveProperty('description');
      expect(firstTool).toHaveProperty('input_schema');
    });
  });

  describe('实体管理函数测试', () => {
    test('create_adb_entity 函数应该有正确的参数结构', () => {
      const entityFunctions = FunctionCallingsProvider.getEntityManagementFunctions();
      const createEntity = entityFunctions.create_adb_entity;
      
      expect(createEntity).toBeDefined();
      expect(createEntity.name).toBe('create_adb_entity');
      
      const params = createEntity.parameters;
      expect(params.properties).toHaveProperty('entityName');
      expect(params.properties).toHaveProperty('tableName');
      expect(params.properties).toHaveProperty('entityInfo');
      
      expect(params.required).toEqual(['entityName', 'tableName', 'entityInfo']);
      
      // 检查 entityInfo 的结构
      const entityInfoProps = params.properties.entityInfo.properties;
      expect(entityInfoProps).toHaveProperty('id');
      expect(entityInfoProps).toHaveProperty('code');
      expect(entityInfoProps).toHaveProperty('label');
      expect(entityInfoProps).toHaveProperty('description');
      expect(entityInfoProps).toHaveProperty('tags');
    });

    test('create_base_entity 函数应该包含时间戳选项', () => {
      const entityFunctions = FunctionCallingsProvider.getEntityManagementFunctions();
      const createBaseEntity = entityFunctions.create_base_entity;
      
      expect(createBaseEntity).toBeDefined();
      expect(createBaseEntity.parameters.properties).toHaveProperty('includeTimestamps');
      expect(createBaseEntity.parameters.properties.includeTimestamps.default).toBe(true);
    });
  });

  describe('列管理函数测试', () => {
    test('add_media_column 函数应该有正确的媒体配置', () => {
      const columnFunctions = FunctionCallingsProvider.getColumnManagementFunctions();
      const addMediaColumn = columnFunctions.add_media_column;
      
      expect(addMediaColumn).toBeDefined();
      
      const mediaConfig = addMediaColumn.parameters.properties.mediaConfig;
      expect(mediaConfig.properties).toHaveProperty('mediaType');
      expect(mediaConfig.properties).toHaveProperty('formats');
      expect(mediaConfig.properties).toHaveProperty('maxSize');
      expect(mediaConfig.properties).toHaveProperty('isMultiple');
      expect(mediaConfig.properties).toHaveProperty('storagePath');
      
      // 检查媒体类型枚举
      expect(mediaConfig.properties.mediaType.enum).toEqual([
        'image', 'video', 'audio', 'document', 'file'
      ]);
    });

    test('add_enum_column 函数应该有枚举配置选项', () => {
      const columnFunctions = FunctionCallingsProvider.getColumnManagementFunctions();
      const addEnumColumn = columnFunctions.add_enum_column;
      
      expect(addEnumColumn).toBeDefined();
      
      const enumConfig = addEnumColumn.parameters.properties.enumConfig;
      expect(enumConfig.properties).toHaveProperty('isMultiple');
      expect(enumConfig.properties).toHaveProperty('default');
      expect(enumConfig.properties.isMultiple.default).toBe(false);
    });
  });

  describe('枚举管理函数测试', () => {
    test('create_adb_enum 函数应该有完整的枚举配置', () => {
      const enumFunctions = FunctionCallingsProvider.getEnumManagementFunctions();
      const createEnum = enumFunctions.create_adb_enum;
      
      expect(createEnum).toBeDefined();
      
      const params = createEnum.parameters;
      expect(params.properties).toHaveProperty('enumName');
      expect(params.properties).toHaveProperty('enumInfo');
      expect(params.properties).toHaveProperty('values');
      expect(params.properties).toHaveProperty('items');
      
      expect(params.required).toEqual(['enumName', 'enumInfo', 'values', 'items']);
      
      // 检查 enumInfo 结构
      const enumInfoProps = params.properties.enumInfo.properties;
      expect(enumInfoProps).toHaveProperty('id');
      expect(enumInfoProps).toHaveProperty('code');
      expect(enumInfoProps).toHaveProperty('label');
    });
  });

  describe('验证函数测试', () => {
    test('validate_entity_structure 函数应该有验证选项', () => {
      const validationFunctions = FunctionCallingsProvider.getValidationFunctions();
      const validateEntity = validationFunctions.validate_entity_structure;
      
      expect(validateEntity).toBeDefined();
      
      const validationRules = validateEntity.parameters.properties.validationRules.properties;
      expect(validationRules).toHaveProperty('requireEntityInfo');
      expect(validationRules).toHaveProperty('requireColumnInfo');
      expect(validationRules).toHaveProperty('checkNamingConvention');
      expect(validationRules).toHaveProperty('validateTypeScript');
      
      // 检查默认值
      expect(validationRules.requireEntityInfo.default).toBe(true);
      expect(validationRules.requireColumnInfo.default).toBe(true);
    });
  });

  describe('查询函数测试', () => {
    test('get_entity_metadata 函数应该有查询选项', () => {
      const queryFunctions = FunctionCallingsProvider.getQueryFunctions();
      const getEntityMetadata = queryFunctions.get_entity_metadata;
      
      expect(getEntityMetadata).toBeDefined();
      
      const params = getEntityMetadata.parameters.properties;
      expect(params).toHaveProperty('entityName');
      expect(params).toHaveProperty('includeColumns');
      expect(params).toHaveProperty('includeRelations');
      
      expect(params.includeColumns.default).toBe(true);
      expect(params.includeRelations.default).toBe(true);
    });

    test('search_entities 函数应该支持多种搜索条件', () => {
      const queryFunctions = FunctionCallingsProvider.getQueryFunctions();
      const searchEntities = queryFunctions.search_entities;
      
      expect(searchEntities).toBeDefined();
      
      const searchCriteria = searchEntities.parameters.properties.searchCriteria.properties;
      expect(searchCriteria).toHaveProperty('byTag');
      expect(searchCriteria).toHaveProperty('byCode');
      expect(searchCriteria).toHaveProperty('byLabel');
      expect(searchCriteria).toHaveProperty('hasMediaColumns');
      expect(searchCriteria).toHaveProperty('hasEnumColumns');
    });
  });

  describe('工具函数测试', () => {
    test('应该能够获取命名规范', () => {
      const conventions = getNamingConventions();
      
      expect(conventions).toBeDefined();
      expect(conventions).toHaveProperty('entity');
      expect(conventions).toHaveProperty('column');
      expect(conventions).toHaveProperty('enum');
      expect(conventions).toHaveProperty('code');
      
      // 检查实体命名规范
      expect(conventions.entity).toHaveProperty('className');
      expect(conventions.entity).toHaveProperty('tableName');
      
      // 检查列命名规范
      expect(conventions.column).toHaveProperty('propertyName');
      expect(conventions.column).toHaveProperty('fieldId');
    });

    test('应该能够获取验证规则', () => {
      const rules = FunctionCallingsProvider.getValidationRules();
      
      expect(rules).toBeDefined();
      expect(rules).toHaveProperty('required');
      expect(rules).toHaveProperty('patterns');
      expect(rules).toHaveProperty('typescript');
      
      // 检查必需字段规则
      expect(rules.required).toHaveProperty('entityInfo');
      expect(rules.required).toHaveProperty('columnInfo');
      expect(rules.required).toHaveProperty('enumInfo');
      
      // 检查模式规则
      expect(rules.patterns).toHaveProperty('id');
      expect(rules.patterns).toHaveProperty('code');
      expect(rules.patterns).toHaveProperty('entityName');
    });
  });

  describe('边界情况测试', () => {
    test('无效的分类应该返回空对象', () => {
      const invalidFunctions = getFunctionsByCategory('invalid' as any);
      
      expect(invalidFunctions).toEqual({});
    });

    test('所有函数都应该有必需的属性', () => {
      const allFunctions = getADBFunctionCallings();
      
      Object.values(allFunctions).forEach(category => {
        Object.values(category).forEach((func: any) => {
          expect(func).toHaveProperty('name');
          expect(func).toHaveProperty('description');
          expect(func).toHaveProperty('parameters');
          expect(typeof func.name).toBe('string');
          expect(typeof func.description).toBe('string');
          expect(typeof func.parameters).toBe('object');
        });
      });
    });

    test('OpenAI 和 Claude 格式应该包含所有函数', () => {
      const allFunctions = getADBFunctionCallings();
      const openAIFunctions = getOpenAIFunctions();
      const claudeTools = getClaudeTools();
      
      // 计算总函数数量
      const totalFunctions = Object.values(allFunctions).reduce(
        (count, category) => count + Object.keys(category).length,
        0
      );
      
      expect(openAIFunctions.length).toBe(totalFunctions);
      expect(claudeTools.length).toBe(totalFunctions);
    });
  });
});