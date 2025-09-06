import 'reflect-metadata';
import { ADBEnum } from '../utils/ADBEnum';

/**
 * 订单状态枚举示例
 * 使用 CustomEnum 类替代传统的 TypeScript 枚举
 * 完全兼容 TypeORM，支持丰富的元数据配置
 */
export const OrderStatus = ADBEnum.create({
  id: "enum-order-status-001",
  code: "order:status",
  label: "订单状态",
  description: "订单生命周期状态管理",
  values: {
    PENDING_PAYMENT: "pending_payment",
    PAID: "paid",
    PROCESSING: "processing",
    COMPLETED: "completed",
    CANCELLED: "cancelled"
  },
  items: {
    PENDING_PAYMENT: {
      label: "待支付",
      icon: "clock-circle",
      color: "#faad14",
      description: "订单已创建，等待用户支付",
      sort: 1,
      metadata: {
        timeoutMinutes: 30,
        canCancel: true
      }
    },
    PAID: {
      label: "已支付",
      icon: "check-circle",
      color: "#52c41a",
      description: "支付成功，订单确认",
      sort: 2,
      metadata: {
        autoConfirm: true,
        confirmDelayMinutes: 5
      }
    },
    PROCESSING: {
      label: "处理中",
      icon: "loading",
      color: "#1890ff",
      description: "订单正在处理中",
      sort: 3,
      metadata: {
        estimatedHours: 2,
        canRefund: false
      }
    },
    COMPLETED: {
      label: "已完成",
      icon: "check-circle",
      color: "#52c41a",
      description: "订单处理完成",
      sort: 4,
      metadata: {
        canReview: true,
        canRefund: true,
        refundDays: 7
      }
    },
    CANCELLED: {
      label: "已取消",
      icon: "close-circle",
      color: "#ff4d4f",
      description: "订单已取消",
      sort: 5,
      disabled: false,
      metadata: {
        reasonRequired: true,
        canRestore: false
      }
    }
  }
}) as ADBEnum & {
  readonly PENDING_PAYMENT: string;
  readonly PAID: string;
  readonly PROCESSING: string;
  readonly COMPLETED: string;
  readonly CANCELLED: string;
};

// 提供类型安全的枚举值访问
export type OrderStatusType = string;
export type OrderStatusValue = typeof OrderStatus.PENDING_PAYMENT | typeof OrderStatus.PAID | typeof OrderStatus.PROCESSING | typeof OrderStatus.COMPLETED | typeof OrderStatus.CANCELLED;

// 常量导出，方便使用
export const ORDER_STATUS_VALUES = {
  PENDING_PAYMENT: OrderStatus.getValue('PENDING_PAYMENT')!,
  PAID: OrderStatus.getValue('PAID')!,
  PROCESSING: OrderStatus.getValue('PROCESSING')!,
  COMPLETED: OrderStatus.getValue('COMPLETED')!,
  CANCELLED: OrderStatus.getValue('CANCELLED')!
} as const;
