import 'reflect-metadata';
import { EnumInfoOptions, EnumItemOptions } from '../types';

/**
 * ADB Enhanced Enum Class
 * Used to replace TypeScript native enums, providing TypeORM-compatible enum solutions
 * Supports rich metadata configuration and database persistence
 */
export class ADBEnum {
  // Dynamic property index signature, supports accessing enum values by key name
  [key: string]: any;
  private static readonly instances = new Map<string, ADBEnum>();
  
  public readonly id: string;
  public readonly code: string;
  public readonly label: string;
  public readonly description?: string;
  public readonly items: Record<string, EnumItemOptions>;
  public readonly values: Record<string, string>;
  public readonly keys: string[];

  private constructor(options: EnumInfoOptions & { values: Record<string, string> }) {
    this.id = options.id;
    this.code = options.code;
    this.label = options.label;
    this.description = options.description;
    this.items = options.items || {};
    this.values = options.values;
    this.keys = Object.keys(this.values);
    
    // 将枚举值作为静态属性添加到实例上
    this.keys.forEach(key => {
      Object.defineProperty(this, key, {
        value: this.values[key],
        writable: false,
        enumerable: true,
        configurable: false
      });
    });
  }

  /**
   * Create ADB enhanced enum
   */
  static create(options: EnumInfoOptions & { values: Record<string, string> }): ADBEnum {
    if (this.instances.has(options.id)) {
      return this.instances.get(options.id)!;
    }

    const enumInstance = new ADBEnum(options);
    this.instances.set(options.id, enumInstance);
    return enumInstance;
  }

  /**
   * Get all enum values
   */
  getValues(): Record<string, string> {
    return { ...this.values };
  }

  /**
   * Get all enum keys
   */
  getKeys(): string[] {
    return [...this.keys];
  }

  /**
   * Get value by key
   */
  getValue(key: string): string | undefined {
    return this.values[key];
  }

  /**
   * Get key by value
   */
  getKey(value: string): string | undefined {
    return Object.keys(this.values).find(key => this.values[key] === value);
  }

  /**
   * Check if contains specified key
   */
  hasKey(key: string): boolean {
    return key in this.values;
  }

  /**
   * Check if contains specified value
   */
  hasValue(value: string): boolean {
    return Object.values(this.values).includes(value);
  }

  /**
   * Get enum item configuration
   */
  getItemConfig(key: string): EnumItemOptions | undefined {
    return this.items[key];
  }

  /**
   * Get enabled enum items
   */
  getEnabledItems(): Array<{ key: string; value: string; config: EnumItemOptions }> {
    return this.keys
      .filter(key => !this.items[key]?.disabled)
      .map(key => ({
        key,
        value: this.values[key],
        config: this.items[key]
      }));
  }

  /**
   * Get sorted enum items
   */
  getSortedItems(): Array<{ key: string; value: string; config: EnumItemOptions }> {
    return this.keys
      .map(key => ({
        key,
        value: this.values[key],
        config: this.items[key]
      }))
      .sort((a, b) => {
        const sortA = a.config?.sort ?? 0;
        const sortB = b.config?.sort ?? 0;
        return sortA - sortB;
      });
  }

  /**
   * Filter enum items by tag
   */
  getItemsByTag(tag: string): Array<{ key: string; value: string; config: EnumItemOptions }> {
    return this.keys
      .filter(key => this.items[key]?.metadata?.tags?.includes(tag))
      .map(key => ({
        key,
        value: this.values[key],
        config: this.items[key]
      }));
  }

  /**
   * Get complete enum configuration information
   */
  getEnumInfo(): EnumInfoOptions {
    return {
      id: this.id,
      code: this.code,
      label: this.label,
      description: this.description,
      items: this.items
    };
  }

  /**
   * Validate enum configuration
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 验证基本字段
    if (!this.id) errors.push('EnumInfo.id is required');
    if (!this.code) errors.push('EnumInfo.code is required');
    if (!this.label) errors.push('EnumInfo.label is required');

    // 验证 code 格式
    if (this.code && !/^[a-zA-Z0-9:]+$/.test(this.code)) {
      errors.push('EnumInfo.code can only contain letters, numbers and colons');
    }

    // 验证枚举值不能为空
    if (Object.keys(this.values).length === 0) {
      errors.push('Enum must have at least one value');
    }

    // 验证枚举项配置
    Object.keys(this.items).forEach(key => {
      if (!this.values[key]) {
        errors.push(`EnumItem config exists for undefined key: ${key}`);
      }
      
      const item = this.items[key];
      if (!item.label) {
        errors.push(`EnumItem.label is required for key: ${key}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convert to native enum-like object
   */
  toPlainObject(): Record<string, string> {
    return { ...this.values };
  }

  /**
   * Return string representation of enum
   */
  toString(): string {
    return `ADBEnum(${this.code})`;
  }

  /**
   * Support JSON serialization
   */
  toJSON() {
    return {
      id: this.id,
      code: this.code,
      label: this.label,
      description: this.description,
      values: this.values,
      items: this.items
    };
  }
}