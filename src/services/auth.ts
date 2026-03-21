import api from '@/lib/api';

export interface Admin {
  admin_id: string;
  name: string;
  email: string;
  phone_number: string;
}

export interface RegisterParams {
  name: string;
  email: string;
  phone_number: string;
}

export interface LoginParams {
  admin_id: string;
  password?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface ForgotPasswordParams {
  email: string;
}

export interface VerifyOtpParams {
  email: string;
  otp: string;
  new_password?: string;
}

export const authService = {
  login: async (credentials: LoginParams): Promise<LoginResponse> => {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  },
  
  register: async (data: RegisterParams) => {
    const response = await api.post('/admin/register', data);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/admin/logout');
    } catch {
      // Ignore
    }
    sessionStorage.removeItem('ww_token');
    sessionStorage.removeItem('ww_auth');
  },

  getProfile: async (): Promise<Admin> => {
    const response = await api.get('/admin/profile');
    return response.data;
  },
  
  forgotPassword: async (data: ForgotPasswordParams) => {
    const response = await api.post('/admin/forgot-password', data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpParams) => {
    const response = await api.post('/admin/verify-otp', data);
    return response.data;
  }
};

