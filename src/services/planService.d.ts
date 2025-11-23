declare module '@/services/planService' {
  export interface PlanData {
    packageId: string;
    planName: string;
    startDate: string;
    endDate: string;
    price: number;
    description?: string;
    planDate: string;
    planTime: string;
    planDescription: string;
    planLocation: string;
  }

  export interface Plan {
    id: string;
    packageId: string;
    planName: string;
    startDate: string;
    endDate: string;
    price: number;
    description?: string;
    planDate?: string;
    planTime?: string;
    planDescription?: string;
    planLocation?: string;
  }

  export interface ApiResponse<T = unknown> {
    data?: T;
    id?: string;
    message?: string;
  }

  const planService: {
    getAllPlans: () => Promise<ApiResponse<Plan[]>>;
    getPlanById: (id: string | null) => Promise<ApiResponse<Plan>>;
    getPlansByPackageId: (packageId: string | null) => Promise<ApiResponse<Plan[]>>;
    createPlan: (planData: Partial<PlanData>) => Promise<ApiResponse<Plan>>;
    updatePlan: (id: string | null, planData: Partial<PlanData>) => Promise<ApiResponse<Plan>>;
    deletePlan: (id: string) => Promise<ApiResponse<void>>;
  };

  export default planService;
}
