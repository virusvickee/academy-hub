import { authAPI } from './api';

export type UserRole = "academy" | "student";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface PdfDocument {
  _id?: string;
  id: string;
  fileName: string;
  fileUrl: string;
  subjectName: string;
  className: string;
  schoolName: string;
  uploadedBy: string;
  createdAt?: string;
  uploadedAt: string;
}

const CURRENT_USER_KEY = "edu_current_user";
const TOKEN_KEY = "token";

export const store = {
  async register(email: string, password: string, role: UserRole, name: string): Promise<User> {
    try {
      const data = await authAPI.register(name, email, password, role);
      
      // Validate response
      if (!data || !data.token || !data.user) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Registration failed');
    }
  },

  async login(email: string, password: string): Promise<User> {
    try {
      const data = await authAPI.login(email, password);
      
      // Validate response
      if (!data || !data.token || !data.user) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Login failed');
    }
  },

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
};
