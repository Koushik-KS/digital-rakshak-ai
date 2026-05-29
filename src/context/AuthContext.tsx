import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { storage } from "@/lib/storage";

export type Role = "user" | "admin";
export type AuthUser = { id: string; name: string; email: string; role: Role };

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const KEY = "dr_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(storage.get<AuthUser | null>(KEY, null));
  }, []);

  const login = async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    const role: Role = email.toLowerCase().includes("admin") ? "admin" : "user";
    const u: AuthUser = {
      id: "u_" + Math.random().toString(36).slice(2, 9),
      name: email.split("@")[0] || "User",
      email,
      role,
    };
    storage.set(KEY, u);
    setUser(u);
    return u;
  };

  const signup = async (name: string, email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 700));
    const u: AuthUser = {
      id: "u_" + Math.random().toString(36).slice(2, 9),
      name,
      email,
      role: email.toLowerCase().includes("admin") ? "admin" : "user",
    };
    storage.set(KEY, u);
    setUser(u);
    return u;
  };

  const logout = () => {
    storage.remove(KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
