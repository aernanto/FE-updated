export interface OrderedActivity {
  id: string; // ID OrderedQuantity (UUID)
  activityId: string;
  activityName: string;
  price: number;
  quota: number;
  orderedQuota: number;
  totalPrice: number;
  startDate: string;
  endDate: string;
}

export interface CreateOrderedActivityRequest {
  activityId: string;
  planId: string;
  orderedQuota: number;
}

export interface UpdateOrderedActivityRequest {
  orderedQuota: number;
}
