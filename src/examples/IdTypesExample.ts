import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityInfo, ColumnInfo } from '../decorators';

/**
 * ID类型扩展示例实体
 * 展示 auto-increment-id 和 guid-id 扩展类型的使用
 */
@Entity("id_types_example")
@EntityInfo({
  id: "id-types-example-001",
  code: "example:id:types",
  label: "ID类型示例实体",
  description: "展示不同ID类型扩展的用法",
  tags: ["example", "id", "types"]
})
export class IdTypesExample {
  // 自增ID主键
  @PrimaryGeneratedColumn()
  @ColumnInfo({
    id: "field_auto_id_001",
    label: "自增ID",
    extendType: "adb-auto-increment-id",
    autoIncrementIdConfig: {
      startValue: 1,
      increment: 1,
      isPrimaryKey: true,
      description: "自增主键，从1开始"
    }
  })
  id!: number;

  // GUID ID主键
  @Column({ 
    type: "varchar",
    length: 36,
    unique: true
  })
  @ColumnInfo({
    id: "field_guid_id_001",
    label: "GUID ID",
    extendType: "adb-guid-id",
    guidIdConfig: {
      version: "v4",
      format: "default",
      isPrimaryKey: true,
      generateOnInsert: true,
      description: "全局唯一标识符"
    }
  })
  uuid!: string;

  // 非主键的自增ID
  @Column({ 
    type: "int",
    generated: true
  })
  @ColumnInfo({
    id: "field_sequence_001",
    label: "序号",
    extendType: "adb-auto-increment-id",
    autoIncrementIdConfig: {
      startValue: 1000,
      increment: 1,
      isPrimaryKey: false,
      description: "业务序号，从1000开始"
    }
  })
  sequence!: number;

  // 自定义格式的GUID
  @Column({ 
    type: "varchar",
    length: 38,
    unique: true
  })
  @ColumnInfo({
    id: "field_braced_guid_001",
    label: "大括号GUID",
    extendType: "adb-guid-id",
    guidIdConfig: {
      version: "v4",
      format: "braced",
      isPrimaryKey: false,
      generateOnInsert: true,
      description: "大括号格式的GUID"
    }
  })
  bracedGuid!: string;

  // 基于时间戳的GUID
  @Column({ 
    type: "varchar",
    length: 36,
    unique: true
  })
  @ColumnInfo({
    id: "field_timestamp_guid_001",
    label: "时间戳GUID",
    extendType: "adb-guid-id",
    guidIdConfig: {
      version: "v1",
      format: "default",
      isPrimaryKey: false,
      generateOnInsert: true,
      description: "基于时间戳的GUID，包含时间信息"
    }
  })
  timestampGuid!: string;

  // Snowflake ID主键
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
      description: "分布式唯一ID，包含时间信息"
    }
  })
  snowflakeId!: number;

  // 字符串格式的Snowflake ID
  @Column({ 
    type: "varchar",
    length: 20,
    unique: true
  })
  @ColumnInfo({
    id: "field_snowflake_str_001",
    label: "Snowflake ID字符串",
    extendType: "adb-snowflake-id",
    snowflakeIdConfig: {
      machineId: 2,
      datacenterId: 1,
      isPrimaryKey: false,
      format: "string",
      generateOnInsert: true,
      description: "字符串格式的Snowflake ID，便于调试"
    }
  })
  snowflakeIdStr!: string;

  // 自定义起始时间的Snowflake ID
  @Column({ 
    type: "bigint",
    unique: true
  })
  @ColumnInfo({
    id: "field_custom_snowflake_001",
    label: "自定义Snowflake ID",
    extendType: "adb-snowflake-id",
    snowflakeIdConfig: {
      machineId: 10,
      datacenterId: 2,
      epoch: 1640995200000, // 2022-01-01 00:00:00 UTC
      isPrimaryKey: false,
      format: "number",
      generateOnInsert: true,
      description: "从2022年开始的Snowflake ID"
    }
  })
  customSnowflakeId!: number;

  // 普通字段
  @Column({ length: 100 })
  @ColumnInfo({
    id: "field_name_001",
    label: "名称"
  })
  name!: string;
}
