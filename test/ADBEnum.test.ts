/*
    💡 测试验证 ADBEnum 类的所有核心功能：
        基本枚举功能：创建、获取值、检查存在性
        元数据支持：获取枚举项配置、标签、颜色、描述等
        高级查询：启用项筛选、排序、验证
        序列化支持：JSON 序列化、普通对象转换
        实例管理：基于 ID 的实例缓存机制

    🎉 运行测试：
    yarn test test/ADBEnum.test.ts
*/
import 'reflect-metadata';
import { ADBEnum } from '../src/utils/ADBEnum';
import { OrderStatus, ORDER_STATUS_VALUES } from '../src/examples/OrderStatus';

describe('ADBEnum', () => {
  test('应该能够创建自定义枚举', () => {
    expect(OrderStatus).toBeDefined();
    expect(OrderStatus.id).toBe('enum-order-status-001');
    expect(OrderStatus.code).toBe('order:status');
    expect(OrderStatus.label).toBe('订单状态');
  });

  test('应该能够获取枚举值', () => {
    expect(OrderStatus.getValue('PENDING_PAYMENT')).toBe('pending_payment');
    expect(OrderStatus.getValue('PAID')).toBe('paid');
    expect(OrderStatus.getValue('INVALID_KEY')).toBeUndefined();
  });

  test('应该能够检查键和值的存在性', () => {
    expect(OrderStatus.hasKey('PENDING_PAYMENT')).toBe(true);
    expect(OrderStatus.hasKey('INVALID_KEY')).toBe(false);
    expect(OrderStatus.hasValue('pending_payment')).toBe(true);
    expect(OrderStatus.hasValue('invalid_value')).toBe(false);
  });

  test('应该能够根据值获取键', () => {
    expect(OrderStatus.getKey('pending_payment')).toBe('PENDING_PAYMENT');
    expect(OrderStatus.getKey('paid')).toBe('PAID');
    expect(OrderStatus.getKey('invalid_value')).toBeUndefined();
  });

  test('应该能够获取枚举项配置', () => {
    const config = OrderStatus.getItemConfig('PENDING_PAYMENT');
    expect(config).toBeDefined();
    expect(config?.label).toBe('待支付');
    expect(config?.color).toBe('#faad14');
    expect(config?.metadata?.timeoutMinutes).toBe(30);
  });

  test('应该能够获取启用的枚举项', () => {
    const enabledItems = OrderStatus.getEnabledItems();
    expect(enabledItems.length).toBeGreaterThan(0);
    expect(enabledItems.every(item => !item.config?.disabled)).toBe(true);
  });

  test('应该能够获取排序后的枚举项', () => {
    const sortedItems = OrderStatus.getSortedItems();
    expect(sortedItems.length).toBeGreaterThan(0);
    
    // 检查排序是否正确
    for (let i = 1; i < sortedItems.length; i++) {
      const prevSort = sortedItems[i - 1].config?.sort || 0;
      const currentSort = sortedItems[i].config?.sort || 0;
      expect(prevSort).toBeLessThanOrEqual(currentSort);
    }
  });

  test('应该能够验证枚举配置', () => {
    const validation = OrderStatus.validate();
    expect(validation.isValid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  test('常量值应该正确', () => {
    expect(ORDER_STATUS_VALUES.PENDING_PAYMENT).toBe('pending_payment');
    expect(ORDER_STATUS_VALUES.PAID).toBe('paid');
    expect(ORDER_STATUS_VALUES.PROCESSING).toBe('processing');
    expect(ORDER_STATUS_VALUES.COMPLETED).toBe('completed');
    expect(ORDER_STATUS_VALUES.CANCELLED).toBe('cancelled');
  });

  test('应该能够转换为普通对象', () => {
    const plainObject = OrderStatus.toPlainObject();
    expect(plainObject.PENDING_PAYMENT).toBe('pending_payment');
    expect(plainObject.PAID).toBe('paid');
  });

  test('应该支持 JSON 序列化', () => {
    const json = OrderStatus.toJSON();
    expect(json.id).toBe('enum-order-status-001');
    expect(json.code).toBe('order:status');
    expect(json.values.PENDING_PAYMENT).toBe('pending_payment');
  });

  test('应该缓存实例', () => {
    const enum1 = ADBEnum.create({
      id: 'test-enum-001',
      code: 'test:enum',
      label: 'Test Enum',
      values: { A: 'a', B: 'b' }
    });

    const enum2 = ADBEnum.create({
      id: 'test-enum-001',
      code: 'test:enum:different', // 不同的配置
      label: 'Different Label',
      values: { C: 'c', D: 'd' }
    });

    // 应该返回相同的实例（基于 ID 缓存）
    expect(enum1).toBe(enum2);
    expect(enum1.code).toBe('test:enum'); // 保持原有配置
  });
});