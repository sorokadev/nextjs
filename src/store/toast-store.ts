import { create } from "zustand";

export type ToastKind = "success" | "error" | "info";

export type Toast = {
  id: string;
  kind: ToastKind;
  title: string;
  message?: string;
};

type ToastState = {
  toasts: Toast[];
  push: (t: Omit<Toast, "id"> & { id?: string }) => void;
  remove: (id: string) => void;
  clear: () => void;
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (t) => {
    const id = t.id ?? uid();
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), 3500);
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));

