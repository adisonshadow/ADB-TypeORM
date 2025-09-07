import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { EntityInfo, ColumnInfo } from '../decorators';
import { EnumItemOptions } from '../types';

/**
 * Enum metadata entity
 * Core system table for persisting enum information to database
 */
@Entity("__enums__")
@EntityInfo({
  id: "enum-metadata-entity-001",
  code: "system:enum:metadata",
  label: "Enum Metadata Table",
  description: "Store metadata information for all enums in the system",
  tags: ["system", "enum", "metadata"]
})
export class EnumMetadata {
  @PrimaryGeneratedColumn()
  @ColumnInfo({
    id: "field_enum_meta_id_001",
    label: "Primary Key ID"
  })
  id!: number;

  @Column({ length: 50, unique: true })
  @ColumnInfo({
    id: "field_enum_meta_enum_id_001",
    label: "Enum Unique Identifier"
  })
  enumId!: string;

  @Column({ length: 100, unique: true })
  @ColumnInfo({
    id: "field_enum_meta_code_001",
    label: "Enum Code"
  })
  code!: string;

  @Column({ length: 200 })
  @ColumnInfo({
    id: "field_enum_meta_label_001",
    label: "Enum Display Name"
  })
  label!: string;

  @Column({ type: "text", nullable: true })
  @ColumnInfo({
    id: "field_enum_meta_description_001",
    label: "Enum Description"
  })
  description?: string;

  @Column({ type: "json" })
  @ColumnInfo({
    id: "field_enum_meta_items_001",
    label: "Enum Items Configuration",
    extendType: "json"
  })
  items!: Record<string, EnumItemOptions>;

  @Column({ length: 100 })
  @ColumnInfo({
    id: "field_enum_meta_enum_name_001",
    label: "Enum Name"
  })
  enumName!: string;

  @Column({ type: "json", nullable: true })
  @ColumnInfo({
    id: "field_enum_meta_enum_values_001",
    label: "Enum Values Mapping",
    extendType: "json"
  })
  enumValues?: Record<string, any>;

  @Column({ default: true })
  @ColumnInfo({
    id: "field_enum_meta_is_active_001",
    label: "Is Active"
  })
  isActive!: boolean;

  @CreateDateColumn()
  @ColumnInfo({
    id: "field_enum_meta_created_at_001",
    label: "Created At"
  })
  createdAt!: Date;

  @UpdateDateColumn()
  @ColumnInfo({
    id: "field_enum_meta_updated_at_001",
    label: "Updated At"
  })
  updatedAt!: Date;
}