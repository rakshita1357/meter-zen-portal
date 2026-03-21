import api from "@/lib/api";

export interface State {
  id: number;
  name: string;
}

export interface Discom {
  id: number;
  name: string;
  state: string;
}

export const referenceService = {
  getStates: async (): Promise<State[]> => {
    const response = await api.get("/api/states");
    return response.data;
  },
  
  getDiscoms: async (stateId?: number): Promise<Discom[]> => {
    const params = stateId ? { state_id: stateId } : {};
    const response = await api.get("/api/discoms", { params });
    return response.data;
  },
};

