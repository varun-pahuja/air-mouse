import { create } from "zustand";

const useStore = create((set) => ({
  activeTab: "dashboard",
  setActiveTab: (tab) => set({ activeTab: tab }),
  darkMode: true,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  activeProfileId: null,
  setActiveProfileId: (id) => set({ activeProfileId: id }),
}));

export default useStore;
