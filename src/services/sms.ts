import api from "@/lib/api";

export interface SMSLog {
  id: string;
  userId: string;
  userName: string;
  type: string;
  status: "Delivered" | "Pending" | "Failed";
  sentDate: string;
  message: string;
}

export interface SendSMSParams {
  user_id: string;
  phone_number?: string; // Optional if backend looks it up from user_id
  message: string;
}

export interface SendBulkSMSParams {
  category: "all" | "overdue" | "pending" | "selected_users";
  message: string;
  user_ids?: string[];
}

export interface SMSTemplate {
  id: string;
  title: string;
  body: string;
}

export const smsService = {
  getLogs: async (params?: Record<string, unknown>): Promise<SMSLog[]> => {
    const response = await api.get("/api/sms/logs", { params });
    // Map snake_case to camelCase
    return response.data.map((log: Record<string, any>) => ({
      id: log.id,
      userId: log.user_id,
      userName: log.user_name || "Unknown",
      type: log.type || "Notification",
      status: log.status,
      sentDate: log.sent_date || log.created_at,
      message: log.message
    }));
  },

  sendSingle: async (data: SendSMSParams) => {
    const response = await api.post("/api/sms/send", data);
    return response.data;
  },

  sendBulk: async (data: SendBulkSMSParams) => {
    const response = await api.post("/api/sms/send-bulk", data);
    return response.data;
  },

  getTemplates: async (): Promise<SMSTemplate[]> => {
    const response = await api.get("/api/sms/templates");
    return response.data;
  },

  updateTemplate: async (id: string, body: string) => {
    const response = await api.put(`/api/sms/templates/${id}`, { body });
    return response.data;
  },

  retry: async (id: string) => {
    const response = await api.post(`/api/sms/retry/${id}`);
    return response.data;
  }
};
