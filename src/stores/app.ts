import create from "zustand";

import { BackendStatus } from "./network";

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
  backendStatus: BackendStatus;
  changeBackendStatus: (v: BackendStatus) => void;
  fps: number;
  setFps: (v: number) => void;
  is3dIconsVisible: boolean;
  toggle3dIcons: () => void;
  isCreateObjectPopupVisible: boolean;
  setCreateObjectPopupVisible: (v: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  fps: 0,
  setFps: (v) => set({ fps: v }),
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
  backendStatus: BackendStatus.Awaiting,
  changeBackendStatus: (v) => set({ backendStatus: v }),
  is3dIconsVisible: true,
  toggle3dIcons: () =>
    set((old) => ({ is3dIconsVisible: !old.is3dIconsVisible })),
  isCreateObjectPopupVisible: false,
  setCreateObjectPopupVisible: (v: boolean) =>
    set({ isCreateObjectPopupVisible: v }),
}));
