import api from "@/lib/api";

export interface BalanceUsed {
  today: number;
  lastWeek: number;
  lastMonth: number;
  year: number;
}

export interface User {
  id: string;
  consumerId: string;
  name: string;
  meterId: string;
  phone: string;
  email: string;
  state: string;
  discom: string;
  billAmount: number;
  lastPayment: string;
  status: string; // "Paid", "Overdue", "Pending"
  active: boolean;
  activeComplaint: boolean;
  complaintId?: string;
  remainingBalance: number;
  balanceUsedByTime: BalanceUsed;
  region?: string;
}

export interface UserFilters {
  state?: string;
  discom?: string;
  active?: boolean;
  amount_gt?: number;
}

// Helper to map snake_case to camelCase if needed, assuming API returns snake_case
const mapUser = (data: any): User => ({
  id: data.id,
  consumerId: data.consumer_id || data.consumerId,
  name: data.name,
  meterId: data.meter_id || data.meterId,
  phone: data.phone || data.phone_number,
  email: data.email,
  state: data.state,
  discom: data.discom,
  billAmount: data.bill_amount || data.billAmount,
  lastPayment: data.last_payment || data.lastPayment,
  status: data.status,
  active: data.is_active !== undefined ? data.is_active : data.active,
  activeComplaint: data.active_complaint || data.activeComplaint,
  complaintId: data.complaint_id || data.complaintId,
  remainingBalance: data.remaining_balance || data.remainingBalance || 0,
  balanceUsedByTime: data.balance_used || { today: 0, lastWeek: 0, lastMonth: 0, year: 0 }, // Mocking if missing
  region: data.region
});

export const userService = {
  getAll: async (filters: UserFilters = {}): Promise<User[]> => {
    const params: any = {};
    if (filters.state && filters.state !== "all") params.state = filters.state;
    if (filters.discom && filters.discom !== "all") params.discom = filters.discom;
    if (filters.active !== undefined) params.active = filters.active;
    if (filters.amount_gt) params.amount_gt = filters.amount_gt;

    const response = await api.get("/api/users/", { params });
    return response.data.map(mapUser);
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/api/users/${id}`);
    return mapUser(response.data);
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    // Map camelCase to snake_case for API
    const payload: any = { ...data };
    if (data.phone) payload.phone_number = data.phone; // Assuming API expects phone or phone_number
    // ... map other fields if necessary
    
    const response = await api.put(`/api/users/${id}`, payload);
    return mapUser(response.data);
  },

  toggleActive: async (id: string): Promise<User> => {
    const response = await api.patch(`/api/users/${id}/toggle-active`);
    return mapUser(response.data);
  },

  getBalance: async (id: string, period?: string) => {
    const params = period ? { period } : {};
    const response = await api.get(`/api/users/${id}/balance`, { params });
    return response.data;
  }
};

