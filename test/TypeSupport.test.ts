import { ColumnInfoService } from '../src/utils';

describe('TypeSupport', () => {
  describe('getAllSupportedTypes', () => {
    it('应该返回所有支持的类型列表', () => {
      const types = ColumnInfoService.getAllSupportedTypes();
      
      expect(types).toBeDefined();
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThan(0);
      
      // 检查每个类型都有正确的结构
      types.forEach(type => {
        expect(type).toHaveProperty('key');
        expect(type).toHaveProperty('label');
        expect(type).toHaveProperty('category');
        expect(['adb-extend', 'typeorm-native']).toContain(type.category);
      });
    });

    it('应该包含所有 ADB 扩展类型', () => {
      const types = ColumnInfoService.getAllSupportedTypes();
      const adbTypes = types.filter(type => type.category === 'adb-extend');
      
      const expectedADBTypes = [
        'adb-media',
        'adb-enum',
        'adb-auto-increment-id',
        'adb-guid-id',
        'adb-snowflake-id'
      ];
      
      expectedADBTypes.forEach(expectedType => {
        expect(adbTypes.some(type => type.key === expectedType)).toBe(true);
      });
    });

    it('应该包含所有 TypeORM 原生类型', () => {
      const types = ColumnInfoService.getAllSupportedTypes();
      const typeormTypes = types.filter(type => type.category === 'typeorm-native');
      
      const expectedTypeORMTypes = [
        'varchar',
        'int',
        'bigint',
        'boolean',
        'json',
        'enum'
      ];
      
      expectedTypeORMTypes.forEach(expectedType => {
        expect(typeormTypes.some(type => type.key === expectedType)).toBe(true);
      });
    });
  });

  describe('getADBExtendTypes', () => {
    it('应该只返回 ADB 扩展类型', () => {
      const adbTypes = ColumnInfoService.getADBExtendTypes();
      
      expect(Array.isArray(adbTypes)).toBe(true);
      expect(adbTypes.length).toBe(5);
      
      adbTypes.forEach(type => {
        expect(type).toHaveProperty('key');
        expect(type).toHaveProperty('label');
        expect(type.key).toMatch(/^adb-/);
      });
    });

    it('应该包含所有预期的 ADB 扩展类型', () => {
      const adbTypes = ColumnInfoService.getADBExtendTypes();
      const keys = adbTypes.map(type => type.key);
      
      expect(keys).toContain('adb-media');
      expect(keys).toContain('adb-enum');
      expect(keys).toContain('adb-auto-increment-id');
      expect(keys).toContain('adb-guid-id');
      expect(keys).toContain('adb-snowflake-id');
    });
  });

  describe('getTypeORMTypes', () => {
    it('应该只返回 TypeORM 原生类型', () => {
      const typeormTypes = ColumnInfoService.getTypeORMTypes();
      
      expect(Array.isArray(typeormTypes)).toBe(true);
      expect(typeormTypes.length).toBeGreaterThan(10);
      
      typeormTypes.forEach(type => {
        expect(type).toHaveProperty('key');
        expect(type).toHaveProperty('label');
        expect(type.key).not.toMatch(/^adb-/);
      });
    });

    it('应该包含常用的 TypeORM 类型', () => {
      const typeormTypes = ColumnInfoService.getTypeORMTypes();
      const keys = typeormTypes.map(type => type.key);
      
      expect(keys).toContain('varchar');
      expect(keys).toContain('int');
      expect(keys).toContain('bigint');
      expect(keys).toContain('boolean');
      expect(keys).toContain('json');
      expect(keys).toContain('enum');
      expect(keys).toContain('timestamp');
    });
  });

  describe('类型标签验证', () => {
    it('ADB 扩展类型应该有英文标签', () => {
      const adbTypes = ColumnInfoService.getADBExtendTypes();
      
      adbTypes.forEach(type => {
        expect(type.label).toBeDefined();
        expect(typeof type.label).toBe('string');
        expect(type.label.length).toBeGreaterThan(0);
        // 检查是否包含英文字符
        expect(/[a-zA-Z]/.test(type.label)).toBe(true);
      });
    });

    it('TypeORM 原生类型应该有英文标签', () => {
      const typeormTypes = ColumnInfoService.getTypeORMTypes();
      
      typeormTypes.forEach(type => {
        expect(type.label).toBeDefined();
        expect(typeof type.label).toBe('string');
        expect(type.label.length).toBeGreaterThan(0);
        // 检查是否包含英文字符
        expect(/[a-zA-Z]/.test(type.label)).toBe(true);
      });
    });
  });
});
