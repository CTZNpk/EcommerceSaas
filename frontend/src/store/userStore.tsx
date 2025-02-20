import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IUser } from "@/interfaces/userInterface";

interface UserState {
  user: IUser | null;
  setUser: (user: IUser) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage", // Key for localStorage
    },
  ),
);
