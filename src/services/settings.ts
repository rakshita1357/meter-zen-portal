import api from "@/lib/api";

export interface BillingSettings {
  billing_cycle_days: number;
  late_fee_amount: number;
  grace_period_days: number;
  auto_disconnect_enabled: boolean;
  currency?: string; 
}

export interface AdminProfile {
  name: string;
  email: string;
  phone_number: string;
  department?: string;
  current_password?: string;
  password?: string; // For update
}

export interface NotificationSettings {
  sms_alerts_enabled: boolean;
  email_alerts_enabled: boolean;
  outage_notifications: boolean;
  billing_notifications: boolean;
  daily_summary?: boolean; // Mapped or additional
  weekly_digest?: boolean; // Mapped or additional
  maintenance_alerts?: boolean; // Mapped or additional
}

export const settingsService = {
  getBilling: async (): Promise<BillingSettings> => {
    const response = await api.get("/api/settings/billing");
    return response.data;
  },

  updateBilling: async (data: BillingSettings): Promise<BillingSettings> => {
    const response = await api.put("/api/settings/billing", data);
    return response.data;
  },

  getProfile: async (): Promise<AdminProfile> => {
    const response = await api.get("/api/admin/profile");
    return response.data;
  },

  updateProfile: async (data: Partial<AdminProfile>): Promise<AdminProfile> => {
    const response = await api.put("/api/admin/profile", data);
    return response.data;
  },

  getNotifications: async (): Promise<NotificationSettings> => {
    const response = await api.get("/api/settings/notifications");
    return response.data;
  },

  updateNotifications: async (data: NotificationSettings): Promise<NotificationSettings> => {
    const response = await api.put("/api/settings/notifications", data);
    return response.data;
  }
};

