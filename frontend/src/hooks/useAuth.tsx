import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { store, User } from "@/lib/store";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => User;
  register: (email: string, password: string, role: "academy" | "student", name: string) => User;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(store.getCurrentUser());

  const login = (email: string, password: string) => {
    const u = store.login(email, password);
    setUser(u);
    return u;
  };

  const register = (email: string, password: string, role: "academy" | "student", name: string) => {
    store.register(email, password, role, name);
    return store.login(email, password);
  };

  const logout = () => {
    store.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register: (e, p, r, n) => { const u = register(e, p, r, n); setUser(u); return u; }, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
