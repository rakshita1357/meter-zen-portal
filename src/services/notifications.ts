import api from "@/lib/api";

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  type: "complaint" | "sms" | "emergency" | "system";
  priority: "low" | "medium" | "high";
  is_read: boolean;
  created_at: string;
  reference_id?: string;
}

export const notificationService = {
  getLatest: async (limit = 20, only_unread = false): Promise<NotificationResponse[]> => {
    const response = await api.get("/api/notifications/", {
      params: { limit, only_unread },
    });
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get("/api/notifications/unread-count");
    return response.data.count;
  },

  markRead: async (id: string): Promise<NotificationResponse> => {
    const response = await api.patch(`/api/notifications/${id}/read`);
    return response.data;
  },

  markAllRead: async (): Promise<void> => {
    await api.patch("/api/notifications/read-all");
  },
};

