import create from "zustand";

export enum BackendStatus {
  Awaiting,
  Signaling,
  Ready,
  Error,
  Offline,
}

interface NetworkStore {
  tick: number;
  setTick: (v: number) => void;
}

export const useNetworkStore = create<NetworkStore>((set) => ({
  tick: 0,
  setTick: (v) => set({ tick: v }),
}));
