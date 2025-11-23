declare module '@/services/orderedQuantityService' {
  export interface OrderedQuantityData {
    activityId: string;
    orderedQuota: number;
  }

  export interface OrderedQuantity {
    id: string;
    planId: string;
    activityId: string;
    orderedQuota: number;
    quota: number;
    price: number;
    activityName: string;
    activityItem: string;
    startDate: string;
    endDate: string;
  }

  export interface ApiResponse<T = unknown> {
    data?: T;
    id?: string;
    message?: string;
  }

  const orderedQuantityService: {
    getOrderedQuantityById: (id: string) => Promise<ApiResponse<OrderedQuantity>>;
    createOrderedQuantity: (
      planId: string,
      data: OrderedQuantityData
    ) => Promise<ApiResponse<OrderedQuantity>>;
    updateOrderedQuantity: (
      id: string,
      newQuota: number
    ) => Promise<ApiResponse<OrderedQuantity>>;
    deleteOrderedQuantity: (id: string) => Promise<ApiResponse<void>>;
  };

  export default orderedQuantityService;
}
