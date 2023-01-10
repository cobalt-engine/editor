import create from "zustand";

import { GameObject } from "../primitives/gameobject";
import { V3 } from "../primitives/vector3";

export enum TransformationMode {
  Translate,
  Rotate,
  Scale,
}

export type ComponentName =
  | "physics"
  | "rendering"
  | "networking"
  | "transform"
  | "light"
  | "camera"
  | "fog";

interface SceneStore {
  objects: GameObject[];
  setScene: (gameObjects: GameObject[]) => void;
  clearScene: () => void;
  selectedObject: null | GameObject;
  selectObject: (selected: GameObject) => void;
  unselectObject: () => void;
  addObject: (newObject: GameObject) => void;
  removeObject: (oldObject: GameObject) => void;

  tick: number;
  setTick: (v: number) => void;
  increaseTick: () => void;

  enableComponent: (gameObject: GameObject, component: ComponentName) => void;
  disableComponent: (gameObject: GameObject, component: ComponentName) => void;

  changeObjectName: (gameObject: GameObject, name: GameObject["name"]) => void;

  changeObjectRenderingModel: (
    gameObject: GameObject,
    model: GameObject["rendering"]["model"]
  ) => void;
  changeObjectRenderingCastShadows: (
    gameObject: GameObject,
    v: GameObject["rendering"]["castShadows"]
  ) => void;
  changeObjectRenderingRecieveShadows: (
    gameObject: GameObject,
    v: GameObject["rendering"]["recieveShadows"]
  ) => void;

  changeObjectRigidbodyType: (
    gameObject: GameObject,
    type: GameObject["physics"]["rigidbody"]["type"]
  ) => void;
  changeObjectColliderType: (
    gameObject: GameObject,
    type: GameObject["physics"]["collider"]["type"]
  ) => void;
  changeObjectColliderSize: (gameObject: GameObject, sizes: V3) => void;

  changeObjectCameraType: (
    gameObject: GameObject,
    type: GameObject["camera"]["type"]
  ) => void;
  changeObjectCameraFov: (
    gameObject: GameObject,
    fov: GameObject["camera"]["fov"]
  ) => void;
  changeObjectCameraDefault: (
    gameObject: GameObject,
    fov: GameObject["camera"]["isDefault"]
  ) => void;

  changeObjectLightType: (
    gameObject: GameObject,
    type: GameObject["light"]["type"]
  ) => void;
  changeObjectLightIntensity: (
    gameObject: GameObject,
    intensity: GameObject["light"]["intensity"]
  ) => void;
  changeObjectLightColor: (
    gameObject: GameObject,
    color: GameObject["light"]["color"]
  ) => void;
  changeObjectLightCastShadows: (
    gameObject: GameObject,
    castShadows: GameObject["light"]["castShadows"]
  ) => void;

  changeObjectPostprocessingDofFocusDistance: (
    gameObject: GameObject,
    castShadows: GameObject["postprocessing"]["dof"]["focusDistance"]
  ) => void;

  changeObjectFogNear: (
    gameObject: GameObject,
    near: GameObject["fog"]["near"]
  ) => void;
  changeObjectFogFar: (
    gameObject: GameObject,
    far: GameObject["fog"]["far"]
  ) => void;
  changeObjectFogColor: (
    gameObject: GameObject,
    color: GameObject["fog"]["color"]
  ) => void;

  moveObject: (
    gameObject: GameObject,
    position: GameObject["transform"]["position"]
  ) => void;
  scaleObject: (
    gameObject: GameObject,
    scale: GameObject["transform"]["scale"]
  ) => void;
  rotateObject: (
    gameObject: GameObject,
    rotation: GameObject["transform"]["rotation"]
  ) => void;

  transformationMode: TransformationMode;
  setTransformationMode: (mode: TransformationMode) => void;
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
  setScene: (gameObjects) => set({ objects: gameObjects }),
  clearScene: () => set({ objects: [], selectedObject: null }),
  selectedObject: null,
  selectObject: (selected) => set({ selectedObject: selected }),
  unselectObject: () => set({ selectedObject: null }),
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

  tick: 0,
  setTick: (v) => set({ tick: v }),
  increaseTick: () => set((old) => ({ tick: old.tick + 1 })),

  enableComponent: (gameObject, component) =>
    changeObject(gameObject, {
      [component]: { ...gameObject[component], enabled: true },
    }),
  disableComponent: (gameObject, component) =>
    changeObject(gameObject, {
      [component]: { ...gameObject[component], enabled: false },
    }),

  changeObjectName: (gameObject, name) => changeObject(gameObject, { name }),

  changeObjectRenderingModel: (gameObject, model) =>
    changeObject(gameObject, { rendering: { ...gameObject.rendering, model } }),
  changeObjectRenderingCastShadows: (gameObject, castShadows) =>
    changeObject(gameObject, {
      rendering: { ...gameObject.rendering, castShadows },
    }),
  changeObjectRenderingRecieveShadows: (gameObject, recieveShadows) =>
    changeObject(gameObject, {
      rendering: { ...gameObject.rendering, recieveShadows },
    }),

  changeObjectRigidbodyType: (gameObject, type) =>
    changeObject(gameObject, {
      physics: {
        ...gameObject.physics,
        rigidbody: {
          ...gameObject.physics.rigidbody,
          type,
        },
      },
    }),
  changeObjectColliderType: (gameObject, type) =>
    changeObject(gameObject, {
      physics: {
        ...gameObject.physics,
        collider: { ...gameObject.physics.collider, type },
      },
    }),
  changeObjectColliderSize: (gameObject, sizes) =>
    changeObject(gameObject, {
      physics: {
        ...gameObject.physics,
        collider: { ...gameObject.physics.collider, sizes },
      },
    }),

  changeObjectCameraType: (gameObject, type) =>
    changeObject(gameObject, { camera: { ...gameObject.camera, type } }),
  changeObjectCameraFov: (gameObject, fov) =>
    changeObject(gameObject, { camera: { ...gameObject.camera, fov } }),
  changeObjectCameraDefault: (gameObject, isDefault) =>
    changeObject(gameObject, { camera: { ...gameObject.camera, isDefault } }),

  changeObjectLightType: (gameObject, type) =>
    changeObject(gameObject, { light: { ...gameObject.light, type } }),
  changeObjectLightIntensity: (gameObject, intensity) =>
    changeObject(gameObject, { light: { ...gameObject.light, intensity } }),
  changeObjectLightColor: (gameObject, color) =>
    changeObject(gameObject, { light: { ...gameObject.light, color } }),
  changeObjectLightCastShadows: (gameObject, castShadows) =>
    changeObject(gameObject, { light: { ...gameObject.light, castShadows } }),

  changeObjectFogNear: (gameObject, near) =>
    changeObject(gameObject, { fog: { ...gameObject.fog, near } }),
  changeObjectFogFar: (gameObject, far) =>
    changeObject(gameObject, { fog: { ...gameObject.fog, far } }),
  changeObjectFogColor: (gameObject, color) =>
    changeObject(gameObject, { fog: { ...gameObject.fog, color } }),

  changeObjectPostprocessingDofFocusDistance: (gameObject, focusDistance) =>
    changeObject(gameObject, {
      postprocessing: {
        ...gameObject.postprocessing,
        dof: { ...gameObject.postprocessing.dof, focusDistance },
      },
    }),

  moveObject: (gameObject, position) =>
    changeObject(gameObject, {
      transform: { ...gameObject.transform, position },
    }),
  scaleObject: (gameObject, scale) =>
    changeObject(gameObject, {
      transform: { ...gameObject.transform, scale },
    }),
  rotateObject: (gameObject, rotation) =>
    changeObject(gameObject, {
      transform: { ...gameObject.transform, rotation },
    }),

  transformationMode: TransformationMode.Translate,
  setTransformationMode: (mode) => set({ transformationMode: mode }),
}));
