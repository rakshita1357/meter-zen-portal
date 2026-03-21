import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { authService, LoginParams, RegisterParams, Admin } from "@/services/auth";
import { toast } from "sonner";

interface AuthContextType {
  isLoggedIn: boolean;
  user: Admin | null;
  login: (credentials: LoginParams) => Promise<void>;
  register: (data: RegisterParams) => Promise<any>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = sessionStorage.getItem("ww_token");
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Auth check failed:", error);
          sessionStorage.removeItem("ww_token");
          setIsLoggedIn(false);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials: LoginParams) => {
    try {
      const response = await authService.login(credentials);
      sessionStorage.setItem("ww_token", response.access_token);
      sessionStorage.setItem("ww_auth", "true");
      setIsLoggedIn(true);
      const profile = await authService.getProfile();
      setUser(profile);
      toast.success("Logged in successfully");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.detail || "Login failed");
      throw error;
    }
  };

  const register = async (data: RegisterParams) => {
    try {
      const result = await authService.register(data);
      toast.success("Registration successful. Please login.");
      return result;
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.detail || "Registration failed");
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
