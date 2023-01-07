import create from "zustand";

interface ModalStore {
  isAppBusyModalVisible: boolean;
  openAppBusyModal: () => void;
  closeAppBusyModal: () => void;

  isLoadSceneModalVisible: boolean;
  openLoadSceneModal: () => void;
  closeLoadSceneModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isAppBusyModalVisible: false,
  openAppBusyModal: () => set({ isAppBusyModalVisible: true }),
  closeAppBusyModal: () => set({ isAppBusyModalVisible: false }),

  isLoadSceneModalVisible: false,
  openLoadSceneModal: () => set({ isLoadSceneModalVisible: true }),
  closeLoadSceneModal: () => set({ isLoadSceneModalVisible: false }),
}));
