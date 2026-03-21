import api from "@/lib/api";

export interface Transaction {
  id: string;
  userName: string;
  meterId: string;
  amount: number;
  date: string;
  method: string;
  status: "Success" | "Pending" | "Failed";
}

export interface TransactionResponse {
  total: number;
  page: number;
  page_size: number;
  data: Transaction[];
}

export interface RevenueSummary {
  total_revenue: number;
  pending_revenue: number;
  average_bill_amount: number;
  highest_payment: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface PaymentMethodDistribution {
  payment_method: string;
  count: number;
  total_amount: number;
}

export interface RevenueByState {
  state: string;
  revenue: number;
}

export const revenueService = {
  getTransactions: async (params?: any): Promise<TransactionResponse> => {
    const response = await api.get("/api/transactions", { params });
    // Mapping assuming snake_case from backend
    const data = response.data.data.map((t: any) => ({
      id: t.id,
      userName: t.user_name || t.userName || "Unknown",
      meterId: t.meter_id || t.meterId || "Unknown",
      amount: t.amount,
      date: t.date || t.created_at,
      method: t.payment_method || t.method,
      status: t.status
    }));
    return { ...response.data, data };
  },
  getSummary: async (): Promise<RevenueSummary> => {
    const response = await api.get("/api/revenue/summary");
    return response.data;
  },
  getMonthlyRevenue: async (): Promise<MonthlyRevenue[]> => {
    const response = await api.get("/api/revenue/monthly");
    return response.data;
  },
  getPaymentMethodDistribution: async (): Promise<PaymentMethodDistribution[]> => {
    const response = await api.get("/api/revenue/payment-methods");
    return response.data;
  },
  getRevenueByState: async (): Promise<RevenueByState[]> => {
    const response = await api.get("/api/revenue/by-state");
    return response.data;
  },
};
