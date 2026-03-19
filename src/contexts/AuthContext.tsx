import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ isLoggedIn: false, login: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => sessionStorage.getItem("ww_auth") === "true");

  const login = () => { setIsLoggedIn(true); sessionStorage.setItem("ww_auth", "true"); };
  const logout = () => { setIsLoggedIn(false); sessionStorage.removeItem("ww_auth"); };

  return <AuthContext.Provider value={{ isLoggedIn, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
