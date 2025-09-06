import { Repository, DataSource } from 'typeorm';
import { EnumMetadata } from '../entities/EnumMetadata';
import { getEnumInfo } from '../decorators/EnumInfo';
import { EnumInfoOptions } from '../types';
import { ADBEnum } from './ADBEnum';

/**
 * 枚举元数据服务
 * 提供枚举信息的数据库存储和查询功能
 */
export class EnumMetadataService {
  private repository: Repository<EnumMetadata>;

  constructor(private dataSource: DataSource) {
    this.repository = dataSource.getRepository(EnumMetadata);
  }

  /**
   * 将枚举信息保存到数据库
   * @param enumObject 枚举对象 或 CustomEnum 实例
   * @param enumName 枚举名称
   * @returns 保存的枚举元数据记录
   */
  async saveEnumMetadata(enumObject: any, enumName: string): Promise<EnumMetadata> {
    // 如果是 ADBEnum 实例，直接使用专用方法
    if (enumObject instanceof ADBEnum) {
      return await this.saveADBEnum(enumObject);
    }

    // 处理传统的 TypeScript 枚举
    const enumInfo = getEnumInfo(enumObject);
    if (!enumInfo) {
      throw new Error(`Enum ${enumName} does not have EnumInfo metadata`);
    }

    // 获取枚举的实际值映射
    const enumValues: Record<string, any> = {};
    Object.keys(enumObject).forEach(key => {
      if (isNaN(Number(key))) { // 排除数字索引
        enumValues[key] = enumObject[key];
      }
    });

    // 检查是否已存在
    let existingRecord = await this.repository.findOne({
      where: { enumId: enumInfo.id }
    });

    const metadataRecord = existingRecord || new EnumMetadata();
    metadataRecord.enumId = enumInfo.id;
    metadataRecord.code = enumInfo.code;
    metadataRecord.label = enumInfo.label;
    metadataRecord.description = enumInfo.description;
    metadataRecord.items = enumInfo.items || {};
    metadataRecord.enumName = enumName;
    metadataRecord.enumValues = enumValues;
    metadataRecord.isActive = true;

    return await this.repository.save(metadataRecord);
  }

  /**
   * 批量保存多个枚举的元数据
   * @param enums 枚举对象数组，格式: [{ enumObject, enumName }]
   */
  async saveMultipleEnumMetadata(enums: { enumObject: any; enumName: string }[]): Promise<EnumMetadata[]> {
    const results: EnumMetadata[] = [];
    
    for (const { enumObject, enumName } of enums) {
      try {
        const result = await this.saveEnumMetadata(enumObject, enumName);
        results.push(result);
      } catch (error) {
        console.error(`Failed to save enum metadata for ${enumName}:`, error);
      }
    }
    
    return results;
  }

  /**
   * 根据枚举ID获取元数据
   */
  async getEnumMetadataById(enumId: string): Promise<EnumMetadata | null> {
    return await this.repository.findOne({
      where: { enumId }
    });
  }

  /**
   * 根据代码获取元数据
   */
  async getEnumMetadataByCode(code: string): Promise<EnumMetadata | null> {
    return await this.repository.findOne({
      where: { code }
    });
  }

  /**
   * 获取所有枚举元数据
   */
  async getAllEnumMetadata(): Promise<EnumMetadata[]> {
    return await this.repository.find({
      where: { isActive: true },
      order: { code: 'ASC' }
    });
  }

  /**
   * 根据枚举名称获取元数据
   */
  async getEnumMetadataByName(enumName: string): Promise<EnumMetadata | null> {
    return await this.repository.findOne({
      where: { enumName }
    });
  }

  /**
   * 删除枚举元数据（软删除）
   */
  async deleteEnumMetadata(enumId: string): Promise<void> {
    await this.repository.update(
      { enumId },
      { isActive: false }
    );
  }

  /**
   * 同步枚举定义到数据库
   */
  async syncEnumMetadata(enumObject: any, enumName: string): Promise<EnumMetadata> {
    return await this.saveEnumMetadata(enumObject, enumName);
  }

  /**
   * 从数据库重建枚举配置
   */
  async rebuildEnumConfig(enumId: string): Promise<EnumInfoOptions | null> {
    const metadata = await this.getEnumMetadataById(enumId);
    if (!metadata) {
      return null;
    }

    return {
      id: metadata.enumId,
      code: metadata.code,
      label: metadata.label,
      description: metadata.description,
      items: metadata.items
    };
  }

  /**
   * 保存 ADBEnum 到数据库
   */
  async saveADBEnum(adbEnum: ADBEnum): Promise<EnumMetadata> {
    const enumInfo = adbEnum.getEnumInfo();
    const enumValues = adbEnum.getValues();

    // 检查是否已存在
    let existingRecord = await this.repository.findOne({
      where: { enumId: enumInfo.id }
    });

    const metadataRecord = existingRecord || new EnumMetadata();
    metadataRecord.enumId = enumInfo.id;
    metadataRecord.code = enumInfo.code;
    metadataRecord.label = enumInfo.label;
    metadataRecord.description = enumInfo.description;
    metadataRecord.items = enumInfo.items || {};
    metadataRecord.enumName = `ADBEnum_${enumInfo.code.replace(/:/g, '_')}`;
    metadataRecord.enumValues = enumValues;
    metadataRecord.isActive = true;

    return await this.repository.save(metadataRecord);
  }

  /**
   * 从数据库重建 ADBEnum
   */
  async rebuildADBEnum(enumId: string): Promise<ADBEnum | null> {
    const metadata = await this.getEnumMetadataById(enumId);
    if (!metadata || !metadata.enumValues) {
      return null;
    }

    return ADBEnum.create({
      id: metadata.enumId,
      code: metadata.code,
      label: metadata.label,
      description: metadata.description,
      items: metadata.items,
      values: metadata.enumValues
    });
  }

  /**
   * 批量保存多个 ADBEnum
   */
  async saveMultipleADBEnums(adbEnums: ADBEnum[]): Promise<EnumMetadata[]> {
    const results: EnumMetadata[] = [];
    
    for (const adbEnum of adbEnums) {
      try {
        const result = await this.saveADBEnum(adbEnum);
        results.push(result);
      } catch (error) {
        console.error(`Failed to save ADB enum ${adbEnum.code}:`, error);
      }
    }
    
    return results;
  }

  /**
   * 根据代码重建 ADBEnum
   */
  async rebuildADBEnumByCode(code: string): Promise<ADBEnum | null> {
    const metadata = await this.getEnumMetadataByCode(code);
    if (!metadata || !metadata.enumValues) {
      return null;
    }

    return ADBEnum.create({
      id: metadata.enumId,
      code: metadata.code,
      label: metadata.label,
      description: metadata.description,
      items: metadata.items,
      values: metadata.enumValues
    });
  }
}