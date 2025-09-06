/*
    💡 测试验证 EntityInfo、ColumnInfo 装饰器的所有核心功能：
        
    【EntityInfo装饰器测试】
        ✅ 实体信息管理：创建、获取、验证实体元数据
        ✅ 代码查找功能：根据唯一识别码快速定位实体
        ✅ 标签分类功能：按业务标签进行实体分组和筛选
        ✅ 完整性验证：验证实体信息的必需字段和格式规范
        ✅ 实体详情获取：获取包含列信息的完整实体描述
        
    【ColumnInfo装饰器测试】
        ✅ 列信息收集：自动收集所有带装饰器的属性信息
        ✅ 扩展类型支持：支持 media、enum 等扩展字段类型
        ✅ 类型筛选功能：按扩展类型（媒体、枚举）筛选列
        ✅ 配置验证功能：验证媒体配置、枚举配置的完整性
        ✅ 多选配置支持：正确识别 isMultiple 配置属性
        
    【集成测试验证】
        ✅ 实体列信息一致性：确保实体和列信息的数据一致
        ✅ 扩展类型混合使用：验证不同扩展类型在同一项目中的兼容性
        ✅ 元数据完整性检查：验证所有元数据字段的正确性
        
    🎯 核心特性覆盖：
        - 装饰器元数据存储与检索机制
        - TypeScript 类属性的运行时反射能力
        - 媒体文件配置的类型安全验证
        - 枚举字段的单选/多选模式支持
        - 实体关系的元数据管理能力
        
    🎉 运行测试：
    yarn test test/EntityInfo-ColumnInfo.test.ts
*/

import 'reflect-metadata';
import { User } from '../src/examples/User';
import { Order } from '../src/examples/Order';
import { EntityInfoService, ColumnInfoService } from '../src/utils';


describe('EntityInfo & ColumnInfo Tests', () => {
  
  /**
   * 【EntityInfo 装饰器核心功能测试】
   * 验证实体元数据的存储、检索、验证等功能
   * 测试覆盖：信息获取、代码查找、标签分类、完整性验证
   */
  describe('EntityInfo 装饰器测试', () => {
    test('应该能够获取所有实体信息', () => {
      const entities = EntityInfoService.getAllEntityInfo([User, Order]);
      expect(entities).toHaveLength(2);
      
      // 验证每个实体都有完整的信息
      entities.forEach(entity => {
        expect(entity.entity).toBeDefined();
        expect(entity.info).toBeDefined();
        expect(entity.info.id).toBeDefined();
        expect(entity.info.code).toBeDefined();
        expect(entity.info.label).toBeDefined();
      });
    });

    test('应该能够根据代码查找用户实体', () => {
      const entity = EntityInfoService.getEntityByCode([User, Order], 'user:admin:super');
      expect(entity).toBeDefined();
      expect(entity?.info.label).toBe('用户实体');
      expect(entity?.info.description).toBe('系统用户管理实体');
      expect(entity?.info.tags).toContain('user');
    });

    test('应该能够根据代码查找订单实体', () => {
      const entity = EntityInfoService.getEntityByCode([User, Order], 'order:business:transaction');
      expect(entity).toBeDefined();
      expect(entity?.info.label).toBe('订单实体');
      expect(entity?.info.description).toBe('订单业务实体');
      expect(entity?.info.tags).toContain('order');
    });

    test('应该能够根据标签查找实体', () => {
      const userEntities = EntityInfoService.getEntitiesByTag([User, Order], 'user');
      expect(userEntities).toHaveLength(1);
      expect(userEntities[0].info.code).toBe('user:admin:super');

      const businessEntities = EntityInfoService.getEntitiesByTag([User, Order], 'business');
      expect(businessEntities).toHaveLength(1);
      expect(businessEntities[0].info.code).toBe('order:business:transaction');
    });

    test('应该能够验证实体信息', () => {
      const validations = EntityInfoService.validateAllEntities([User, Order]);
      expect(validations).toHaveLength(2);
      
      validations.forEach(validation => {
        expect(validation.result.isValid).toBe(true);
        expect(validation.result.errors).toHaveLength(0);
      });
    });

    test('应该能够获取实体完整信息', () => {
      const userFullInfo = EntityInfoService.getEntityFullInfo(User);
      expect(userFullInfo).toBeDefined();
      expect(userFullInfo?.className).toBe('User');
      expect(userFullInfo?.entityInfo.code).toBe('user:admin:super');
      expect(userFullInfo?.columns).toBeDefined();
      expect(userFullInfo?.columns.length).toBeGreaterThan(0);
    });
  });

  /**
   * 【ColumnInfo 装饰器核心功能测试】
   * 验证列元数据的收集、分类、配置验证等功能
   * 测试覆盖：属性收集、类型筛选、扩展配置、多选支持
   */
  describe('ColumnInfo 装饰器测试', () => {
    test('应该能够获取用户实体的所有列信息', () => {
      const columns = ColumnInfoService.getAllColumnInfo(User);
      const columnKeys = Object.keys(columns);
      
      expect(columnKeys.length).toBeGreaterThan(0);
      
      // 验证必要的列存在
      expect(columnKeys).toContain('username');
      expect(columnKeys).toContain('email');
      expect(columnKeys).toContain('avatar');
      expect(columnKeys).toContain('identityPhotos');
    });

    test('应该能够获取订单实体的所有列信息', () => {
      const columns = ColumnInfoService.getAllColumnInfo(Order);
      const columnKeys = Object.keys(columns);
      
      expect(columnKeys.length).toBeGreaterThan(0);
      
      // 验证必要的列存在
      expect(columnKeys).toContain('orderNumber');
      expect(columnKeys).toContain('status');
      expect(columnKeys).toContain('statuses');
      expect(columnKeys).toContain('amount');
    });

    test('应该能够获取媒体类型的列', () => {
      const mediaColumns = ColumnInfoService.getMediaColumns(User);
      expect(mediaColumns.length).toBeGreaterThan(0);
      
      const avatarColumn = mediaColumns.find(c => c.property === 'avatar');
      expect(avatarColumn).toBeDefined();
      expect(avatarColumn?.info.extendType).toBe('media');
      expect(avatarColumn?.info.mediaConfig?.mediaType).toBe('image');
      expect(avatarColumn?.info.mediaConfig?.isMultiple).toBe(false);
      
      const photosColumn = mediaColumns.find(c => c.property === 'identityPhotos');
      expect(photosColumn).toBeDefined();
      expect(photosColumn?.info.mediaConfig?.isMultiple).toBe(true);
    });

    test('应该能够获取枚举类型的列', () => {
      const enumColumns = ColumnInfoService.getEnumColumns(Order);
      expect(enumColumns.length).toBeGreaterThan(0);
      
      const statusColumn = enumColumns.find(c => c.property === 'status');
      expect(statusColumn).toBeDefined();
      expect(statusColumn?.info.extendType).toBe('enum');
      expect(statusColumn?.info.enumConfig?.isMultiple).toBe(false);
      
      const statusesColumn = enumColumns.find(c => c.property === 'statuses');
      expect(statusesColumn).toBeDefined();
      expect(statusesColumn?.info.enumConfig?.isMultiple).toBe(true);
    });

    test('应该能够根据扩展类型获取列', () => {
      // 测试媒体类型列
      const mediaColumns = ColumnInfoService.getColumnsByExtendType(User, 'media');
      expect(mediaColumns.length).toBe(2); // avatar 和 identityPhotos
      
      // 测试枚举类型列
      const enumColumns = ColumnInfoService.getColumnsByExtendType(Order, 'enum');
      expect(enumColumns.length).toBe(2); // status 和 statuses
    });

    test('应该能够验证列信息', () => {
      const userValidations = ColumnInfoService.validateAllColumns(User);
      expect(userValidations.length).toBeGreaterThan(0);
      
      userValidations.forEach(validation => {
        expect(validation.property).toBeDefined();
        expect(validation.result.isValid).toBe(true);
        expect(validation.result.errors).toHaveLength(0);
      });

      const orderValidations = ColumnInfoService.validateAllColumns(Order);
      expect(orderValidations.length).toBeGreaterThan(0);
      
      orderValidations.forEach(validation => {
        expect(validation.property).toBeDefined();
        expect(validation.result.isValid).toBe(true);
        expect(validation.result.errors).toHaveLength(0);
      });
    });

    test('应该正确识别列的配置属性', () => {
      const columns = ColumnInfoService.getAllColumnInfo(User);
      
      // 测试用户名列
      const usernameColumn = columns['username'];
      expect(usernameColumn).toBeDefined();
      expect(usernameColumn.label).toBe('用户名');
      expect(usernameColumn.id).toBeDefined();
      
      // 测试头像列（媒体类型）
      const avatarColumn = columns['avatar'];
      expect(avatarColumn).toBeDefined();
      expect(avatarColumn.extendType).toBe('media');
      expect(avatarColumn.mediaConfig).toBeDefined();
      expect(avatarColumn.mediaConfig?.formats).toContain('jpg');
      expect(avatarColumn.mediaConfig?.maxSize).toBe(5);
    });
  });

  /**
   * 【集成功能测试】
   * 验证 EntityInfo 和 ColumnInfo 装饰器的协同工作能力
   * 测试覆盖：数据一致性、混合使用场景、元数据完整性
   */
  describe('集成测试', () => {
    test('应该能够获取实体及其所有列的完整信息', () => {
      const entities = [User, Order];
      
      entities.forEach(EntityClass => {
        // 获取实体信息
        const entityInfo = EntityInfoService.getEntityFullInfo(EntityClass);
        expect(entityInfo).toBeDefined();
        
        // 获取列信息
        const columns = ColumnInfoService.getAllColumnInfo(EntityClass);
        expect(Object.keys(columns).length).toBeGreaterThan(0);
        
        // 验证实体和列信息一致性
        expect(entityInfo?.columns.length).toBe(Object.keys(columns).length);
        
        // 验证每个列都有正确的信息
        Object.entries(columns).forEach(([property, columnInfo]) => {
          expect(columnInfo.id).toBeDefined();
          expect(columnInfo.label).toBeDefined();
          
          const entityColumn = entityInfo?.columns.find(c => c.property === property);
          expect(entityColumn).toBeDefined();
          expect(entityColumn?.columnInfo).toEqual(columnInfo);
        });
      });
    });

    test('应该能够正确处理不同扩展类型的混合使用', () => {
      // 用户实体包含媒体类型
      const userMediaColumns = ColumnInfoService.getMediaColumns(User);
      const userEnumColumns = ColumnInfoService.getEnumColumns(User);
      
      expect(userMediaColumns.length).toBeGreaterThan(0);
      expect(userEnumColumns.length).toBe(0); // 用户实体没有枚举类型列
      
      // 订单实体包含枚举类型
      const orderMediaColumns = ColumnInfoService.getMediaColumns(Order);
      const orderEnumColumns = ColumnInfoService.getEnumColumns(Order);
      
      expect(orderMediaColumns.length).toBe(0); // 订单实体没有媒体类型列
      expect(orderEnumColumns.length).toBeGreaterThan(0);
    });
  });
});