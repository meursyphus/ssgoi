import { create } from "zustand";
import type { NavigationItem } from "@/app/[lang]/docs/sidebar";

interface NavigationStore {
  navigation: NavigationItem[] | null;
  setNavigation: (navigation: NavigationItem[]) => void;
  clearNavigation: () => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  navigation: null,
  setNavigation: (navigation) => set({ navigation }),
  clearNavigation: () => set({ navigation: null }),
}));
