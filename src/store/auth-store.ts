import { create } from "zustand";
import type { UserRole } from "@/lib/constants";

type AuthState = {
  role: UserRole | null;
  isHydrated: boolean;
  setRole: (role: UserRole | null) => void;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  isHydrated: false,
  setRole: (role) => set({ role }),
  hydrate: async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = (await res.json().catch(() => null)) as { role?: UserRole | null } | null;
      set({ role: data?.role ?? null, isHydrated: true });
    } catch {
      set({ role: null, isHydrated: true });
    }
  },
  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    set({ role: null });
  },
}));

