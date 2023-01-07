import {
  RigidBodyAutoCollider,
  RigidBodyTypeString,
} from "@react-three/rapier";
import create from "zustand";

import { GameModel, GameObject } from "../primitives/gameobject";
import { Q } from "../primitives/quaternion";
import { V3 } from "../primitives/vector3";

export enum TransformationMode {
  Translate,
  Rotate,
  Scale,
}

type ComponentName = "physics" | "rendering";

interface SceneStore {
  objects: Array<GameObject>;
  selectedObject: GameObject | null;
  setScene: (gameObjects: GameObject[]) => void;
  clearScene: () => void;
  addObject: (gameObject: GameObject) => void;
  removeObject: (gameObject: GameObject) => void;
  selectObject: (gameObject: GameObject) => void;
  moveObject: (gameObject: GameObject, to: V3) => void;
  rotateObject: (gameObject: GameObject, to: Q) => void;
  changeObjectName: (gameObject: GameObject, to: GameObject["name"]) => void;
  changeObjectModel: (gameObject: GameObject, model: GameModel) => void;
  unselectObject: () => void;
  transformationMode: TransformationMode;
  setTransformationMode: (mode: TransformationMode) => void;
  enableComponent: (gameObject: GameObject, component: ComponentName) => void;
  disableComponent: (gameObject: GameObject, component: ComponentName) => void;
  changeObjectRigidbodyType: (
    gameObject: GameObject,
    type: RigidBodyTypeString
  ) => void;
  changeObjectColliderType: (
    gameObject: GameObject,
    type: RigidBodyAutoCollider
  ) => void;
}

const changeObject = (gameObject: GameObject, props: Partial<GameObject>) => {
  useSceneStore.setState((old) => {
    const copy = [...old.objects];
    const index = copy.findIndex(({ id }) => id === gameObject.id);
    copy[index] = { ...gameObject, ...props };
    return { objects: copy };
  });
  if (useSceneStore.getState().selectedObject?.id === gameObject.id)
    useSceneStore.getState().selectObject({ ...gameObject, ...props });
};

export const useSceneStore = create<SceneStore>((set) => ({
  objects: [],
  selectedObject: null,
  setScene: (gameObjects) => set({ objects: gameObjects }),
  clearScene: () => set({ objects: [], selectedObject: null }),
  selectObject: (selected) => set({ selectedObject: selected }),
  unselectObject: () => set({ selectedObject: null }),
  changeObjectName: (gameObject, name) => changeObject(gameObject, { name }),
  enableComponent: (gameObject, component) =>
    changeObject(gameObject, {
      [component]: { ...gameObject[component], enabled: true },
    }),
  disableComponent: (gameObject, component) =>
    changeObject(gameObject, {
      [component]: { ...gameObject[component], enabled: false },
    }),
  changeObjectModel: (gameObject, model) =>
    changeObject(gameObject, { rendering: { ...gameObject.rendering, model } }),
  changeObjectRigidbodyType: (gameObject, type) =>
    changeObject(gameObject, {
      physics: {
        ...gameObject.physics,
        rigidbody: { type },
      },
    }),
  changeObjectColliderType: (gameObject, type) =>
    changeObject(gameObject, {
      physics: {
        ...gameObject.physics,
        collider: { ...gameObject.physics.collider, type },
      },
    }),
  moveObject: (gameObject, position) => changeObject(gameObject, { position }),
  rotateObject: (gameObject, rotation) =>
    changeObject(gameObject, { rotation }),
  addObject: (newObject) =>
    set((old) => ({ objects: [...old.objects, newObject] })),
  removeObject: (oldObject) =>
    set((old) => {
      const copy = [...old.objects];
      const index = copy.findIndex(({ id }) => id === oldObject.id);
      copy.splice(index, 1);
      if (old.selectedObject?.id === oldObject.id) old.unselectObject();
      return { objects: copy };
    }),
  transformationMode: TransformationMode.Translate,
  setTransformationMode: (mode: TransformationMode) =>
    set({ transformationMode: mode }),
}));
