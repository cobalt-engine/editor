import create from "zustand";

interface AppStore {
  isLibraryOpen: boolean;
  isHierarchyOpen: boolean;
  isInPlayMode: boolean;
  physicsDebug: boolean;
  toggleLibrary: () => void;
  toggleHierarchy: () => void;
  togglePlayMode: () => void;
  openHierarchy: () => void;
  closeHierarchy: () => void;
  togglePhysicsDebug: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isLibraryOpen: false,
  toggleLibrary: () => set((old) => ({ isLibraryOpen: !old.isLibraryOpen })),
  isHierarchyOpen: false,
  toggleHierarchy: () =>
    set((old) => ({ isHierarchyOpen: !old.isHierarchyOpen })),
  openHierarchy: () => set({ isHierarchyOpen: true }),
  closeHierarchy: () => set({ isHierarchyOpen: false }),
  isInPlayMode: false,
  togglePlayMode: () => set((old) => ({ isInPlayMode: !old.isInPlayMode })),
  physicsDebug: false,
  togglePhysicsDebug: () => set((old) => ({ physicsDebug: !old.physicsDebug })),
}));
