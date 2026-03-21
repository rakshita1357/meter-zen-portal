import api from "@/lib/api";

export interface Complaint {
  id: string;
  userName: string;
  issueType: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved" | "Escalated";
  agent: string;
  created: string;
  notes: string[];
}

export interface ComplaintFilters {
  status?: string;
  priority?: string;
}

const mapComplaint = (data: any): Complaint => ({
  id: data.id,
  userName: data.user_name || data.userName || "Unknown",
  issueType: data.issue_type || data.issueType,
  priority: data.priority,
  status: data.status,
  agent: data.agent || "Unassigned",
  created: data.created_at || data.created,
  notes: data.notes || []
});

export const complaintService = {
  getAll: async (filters: ComplaintFilters = {}): Promise<Complaint[]> => {
    const params: any = {};
    if (filters.status && filters.status !== "all") params.status = filters.status;
    if (filters.priority && filters.priority !== "all") params.priority = filters.priority;
    
    const response = await api.get("/api/complaints/", { params });
    return response.data.map(mapComplaint);
  },

  getById: async (id: string): Promise<Complaint> => {
    const response = await api.get(`/api/complaints/${id}`);
    return mapComplaint(response.data);
  },

  updateStatus: async (id: string, status: string): Promise<Complaint> => {
    const response = await api.patch(`/api/complaints/${id}/status`, { status });
    return mapComplaint(response.data);
  },

  addNote: async (id: string, note: string): Promise<void> => {
    // API doc says key is 'note' in query params
    await api.post(`/api/complaints/${id}/notes`, null, { params: { note } });
  }
};

