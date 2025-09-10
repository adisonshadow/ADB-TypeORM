import 'reflect-metadata';

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityInfo, ColumnInfo } from '../decorators';

/**
 * 用户实体示例
 * 展示 EntityInfo 和 ColumnInfo 的基本用法
 */
@Entity("users")
@EntityInfo({
  id: "user-entity-001",
  code: "user:admin:super",
  label: "用户实体",
  description: "系统用户管理实体",
  tags: ["user", "auth", "admin"]
})
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50, unique: true })
  @ColumnInfo({
    id: "field_username_001",
    label: "用户名"
  })
  username!: string;

  @Column({ type: "int", default: 0 })
  @ColumnInfo({
    id: "field_age_001",
    label: "年龄"
  })
  age!: number;

  @Column({ type: "boolean", default: true })
  @ColumnInfo({
    id: "field_is_active_001",
    label: "是否激活"
  })
  isActive!: boolean;

  @Column({ type: "varchar", length: 100, nullable: true })
  @ColumnInfo({
    id: "field_email_001",
    label: "邮箱"
  })
  email!: string;

  // 用户头像 - media类型示例
  @Column({ 
    type: "varchar",
    length: 500,
    nullable: true
  })
  @ColumnInfo({
    id: "field_avatar_001",
    label: "用户头像",
    extendType: "adb-media",
    mediaConfig: {
      mediaType: "image",
      formats: ["jpg", "png", "gif", "webp"],
      maxSize: 5,
      isMultiple: false,
      storagePath: "uploads/avatars"
    }
  })
  avatar!: string;

  // 用户证件照片 - 多文件media类型示例
  @Column({ 
    type: "simple-array",
    nullable: true
  })
  @ColumnInfo({
    id: "field_identity_photos_001",
    label: "证件照片",
    extendType: "adb-media",
    mediaConfig: {
      mediaType: "image",
      formats: ["jpg", "png"],
      maxSize: 10,
      isMultiple: true,
      storagePath: "uploads/identity"
    }
  })
  identityPhotos!: string[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
