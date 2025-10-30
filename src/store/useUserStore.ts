'use client';
import { create } from "zustand";

interface UserStore {
    user: {} | null;
    setUser: (user: {} | null) => void;
    logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
}))