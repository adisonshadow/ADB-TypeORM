import 'reflect-metadata';

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { EntityInfo, ColumnInfo } from '../decorators';
import { OrderStatus, OrderStatusValue } from './OrderStatus';

/**
 * 订单实体示例
 * 展示如何使用高级枚举
 */
@Entity("orders")
@EntityInfo({
  id: "order-entity-001",
  code: "order:business:transaction",
  label: "订单实体",
  description: "订单业务实体",
  tags: ["order", "business", "transaction"]
})
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  @ColumnInfo({
    id: "field_order_number_001",
    label: "订单号"
  })
  orderNumber!: string;

  // 使用高级枚举的订单状态字段
  @Column({ 
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING_PAYMENT
  })
  @ColumnInfo({
    id: "field_order_status_001",
    label: "订单状态",
    extendType: "adb-enum",
    enumConfig: {
      enum: OrderStatus,
      isMultiple: false,
      default: OrderStatus.PENDING_PAYMENT
    }
  })
  status!: OrderStatusValue;

  // 多选状态字段示例
  @Column({ 
    type: "simple-array",
    enum: OrderStatus,
    default: [OrderStatus.PENDING_PAYMENT]
  })
  @ColumnInfo({
    id: "field_order_statuses_001",
    label: "订单状态集合",
    extendType: "adb-enum",
    enumConfig: {
      enum: OrderStatus,
      isMultiple: true,
      default: [OrderStatus.PENDING_PAYMENT]
    }
  })
  statuses!: OrderStatusValue[];

  @Column({ type: "decimal", precision: 10, scale: 2 })
  @ColumnInfo({
    id: "field_order_amount_001",
    label: "订单金额"
  })
  amount!: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;
}
