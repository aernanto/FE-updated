export interface TopUpResponseDTO {
  id: string;                // UUID
  endUserId: string;         // UUID
  amount: number;
  paymentMethodId: string;   // UUID
  methodName?: string | null;  // opsional
  status: string;
  createdAt: string;         // ISO date-time string
}
