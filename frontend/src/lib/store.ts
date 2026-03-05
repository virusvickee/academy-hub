// Mock data store using localStorage

export type UserRole = "academy" | "student";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface PdfDocument {
  id: string;
  fileName: string;
  fileUrl: string;
  subjectName: string;
  className: string;
  schoolName: string;
  uploadedBy: string;
  uploadedAt: string;
}

const USERS_KEY = "edu_users";
const CURRENT_USER_KEY = "edu_current_user";
const PDFS_KEY = "edu_pdfs";

function getUsers(): User[] {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function getPdfs(): PdfDocument[] {
  return JSON.parse(localStorage.getItem(PDFS_KEY) || "[]");
}

// Simple cache with TTL
const cache = new Map<string, { data: PdfDocument[]; expiry: number }>();
const CACHE_TTL = 30000; // 30 seconds

export const store = {
  register(email: string, password: string, role: UserRole, name: string): User {
    const users = getUsers();
    if (users.find((u) => u.email === email)) {
      throw new Error("Email already registered");
    }
    const user: User = { id: crypto.randomUUID(), email, role, name };
    users.push({ ...user, password } as any);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return user;
  },

  login(email: string, password: string): User {
    const users: any[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid credentials");
    const { password: _, ...user } = found;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  uploadPdf(doc: Omit<PdfDocument, "id" | "uploadedAt">): PdfDocument {
    const pdfs = getPdfs();
    const newDoc: PdfDocument = {
      ...doc,
      id: crypto.randomUUID(),
      uploadedAt: new Date().toISOString(),
    };
    pdfs.push(newDoc);
    localStorage.setItem(PDFS_KEY, JSON.stringify(pdfs));
    cache.clear(); // invalidate cache
    return newDoc;
  },

  searchPdfs(filters: { subject?: string; className?: string; school?: string }): PdfDocument[] {
    const cacheKey = JSON.stringify(filters);
    const cached = cache.get(cacheKey);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }

    let pdfs = getPdfs();
    if (filters.subject) {
      pdfs = pdfs.filter((p) => p.subjectName.toLowerCase().includes(filters.subject!.toLowerCase()));
    }
    if (filters.className) {
      pdfs = pdfs.filter((p) => p.className.toLowerCase().includes(filters.className!.toLowerCase()));
    }
    if (filters.school) {
      pdfs = pdfs.filter((p) => p.schoolName.toLowerCase().includes(filters.school!.toLowerCase()));
    }

    cache.set(cacheKey, { data: pdfs, expiry: Date.now() + CACHE_TTL });
    return pdfs;
  },

  getMyPdfs(userId: string): PdfDocument[] {
    return getPdfs().filter((p) => p.uploadedBy === userId);
  },

  deletePdf(id: string) {
    const pdfs = getPdfs().filter((p) => p.id !== id);
    localStorage.setItem(PDFS_KEY, JSON.stringify(pdfs));
    cache.clear();
  },

  updatePdf(id: string, updates: Partial<Pick<PdfDocument, "subjectName" | "className" | "schoolName">>) {
    const pdfs = getPdfs();
    const index = pdfs.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("PDF not found");
    pdfs[index] = { ...pdfs[index], ...updates };
    localStorage.setItem(PDFS_KEY, JSON.stringify(pdfs));
    cache.clear();
    return pdfs[index];
  },};
