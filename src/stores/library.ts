import { nanoid } from "nanoid";
import create from "zustand";

interface LibraryObject {
  id: string;
  src: string;
  name: string;
  type: "model";
}

interface LibraryStore {
  objects: LibraryObject[];
  addModel: (src: string, name: string) => LibraryObject;
  clearLibrary: () => void;
}

export const useLibraryStore = create<LibraryStore>((set, get) => ({
  objects: [],
  clearLibrary: () => set({ objects: [] }),
  addModel: (src, name) => {
    const duplicate = get().objects.find((obj) => src === obj.src);
    if (duplicate) return duplicate;
    const newObject = { id: nanoid(), type: "model" as const, src, name };
    set((old) => ({
      objects: [...old.objects, newObject],
    }));
    return newObject;
  },
}));
