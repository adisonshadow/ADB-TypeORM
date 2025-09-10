# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.3] - 2024-09-09

### Added
- **类型支持系统**: 新增完整的类型查询和管理功能
  - `getAllSupportedTypes()`: 获取所有支持的类型（ADB扩展类型 + TypeORM原生类型）
  - `getADBExtendTypes()`: 获取所有ADB扩展类型
  - `getTypeORMTypes()`: 获取所有TypeORM原生类型
- **ID类型扩展**: 新增三种主要的ID类型扩展
  - `adb-auto-increment-id`: 自增ID类型，支持起始值、增量等配置
  - `adb-guid-id`: GUID ID类型，支持多种版本和格式
  - `adb-snowflake-id`: Snowflake ID类型，支持分布式唯一ID生成
- **统一命名规范**: 所有ADB扩展类型使用 `adb-` 前缀
  - `adb-media`: 媒体类型
  - `adb-enum`: 枚举类型
  - `adb-auto-increment-id`: 自增ID类型
  - `adb-guid-id`: GUID ID类型
  - `adb-snowflake-id`: Snowflake ID类型

### Changed
- **extendType 命名**: 统一所有扩展类型标识，添加 `adb-` 前缀
- **类型标签**: 所有类型标签使用英文，便于国际化
- **文档更新**: 完善 README.md，添加类型支持系统和ID类型扩展说明

### Fixed
- 修复测试文件中的 extendType 名称引用
- 更新示例文件使用新的 extendType 名称
- 确保所有测试通过（55/55）

### Technical Details
- 新增 `AutoIncrementIdConfigOptions` 接口
- 新增 `GuidIdConfigOptions` 接口  
- 新增 `SnowflakeIdConfigOptions` 接口
- 更新验证逻辑支持新的扩展类型
- 添加完整的测试覆盖

## [0.0.2] - 2024-09-08

### Added
- **Function Calling 支持**: 完整的 AI 模型集成功能
- **ADB 增强枚举**: 替代传统枚举，支持丰富元数据
- **枚举元数据持久化**: 通过 EnumMetadata 实体实现数据库存储
- **媒体类型扩展**: 支持图片、视频、音频等媒体文件管理
- **枚举类型扩展**: 支持单选和多选枚举字段

### Changed
- 优化装饰器元数据收集机制
- 改进类型安全性和验证逻辑

## [0.0.1] - 2024-09-05

### Added
- 初始版本发布
- 基础 EntityInfo 和 ColumnInfo 装饰器
- TypeORM 完全兼容性支持
- 基础类型定义和工具类
