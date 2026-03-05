import { createContext, useContext, useState, ReactNode } from "react";
import { store, User } from "@/lib/store";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, role: "academy" | "student", name: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(store.getCurrentUser());

  const login = async (email: string, password: string) => {
    const u = await store.login(email, password);
    setUser(u);
    return u;
  };

  const register = async (email: string, password: string, role: "academy" | "student", name: string) => {
    const u = await store.register(email, password, role, name);
    setUser(u);
    return u;
  };

  const logout = () => {
    store.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
