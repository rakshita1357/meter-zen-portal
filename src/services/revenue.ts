import api from "@/lib/api";

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  date: string;
  payment_method: string;
  status: string;
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

export const revenueService = {
  getTransactions: async (params?: any) => {
    const response = await api.get("/api/transactions", { params });
    return response.data;
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
};

