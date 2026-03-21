import api from "@/lib/api";

export interface DashboardStats {
  total_users: number;
  active_meters: number;
  total_revenue: number;
  total_complaints: number;
  overdue_bills: number;
  recharge_volume: number;
}

export interface ComplaintStatusCount {
  status: string;
  count: number;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/api/dashboard/stats");
    return response.data;
  },
  getComplaintStatus: async (): Promise<ComplaintStatusCount[]> => {
    const response = await api.get("/api/dashboard/complaints-status");
    return response.data;
  },
};

