import { makeDummyGameObject } from "../primitives/gameobject";
import { useAppStore } from "../stores/app";
import { useSceneStore } from "../stores/scene";

export const createDummyGameObject = () => {
  const newGO = makeDummyGameObject();
  const withBaseName = useSceneStore
    .getState()
    .objects.filter(({ name }) => name.startsWith(newGO.name)).length;
  if (withBaseName) newGO.name += ` (${withBaseName})`;
  useSceneStore.getState().addObject(newGO);
  useSceneStore.getState().selectObject(newGO);
  useAppStore.getState().openHierarchy();
  return newGO;
};

export const createDummyCamera = () => {
  const newGO = makeDummyGameObject();
  newGO.camera.enabled = true;
  newGO.name = "Камера";
  const withBaseName = useSceneStore
    .getState()
    .objects.filter(({ name }) => name.startsWith(newGO.name)).length;
  if (withBaseName) newGO.name += ` (${withBaseName})`;
  useSceneStore.getState().addObject(newGO);
  useSceneStore.getState().selectObject(newGO);
  useAppStore.getState().openHierarchy();
  return newGO;
};

export const createDummyLight = () => {
  const newGO = makeDummyGameObject();
  newGO.light.enabled = true;
  newGO.light.type = "directional";
  newGO.name = "Источник света";
  const withBaseName = useSceneStore
    .getState()
    .objects.filter(({ name }) => name.startsWith(newGO.name)).length;
  if (withBaseName) newGO.name += ` (${withBaseName})`;
  useSceneStore.getState().addObject(newGO);
  useSceneStore.getState().selectObject(newGO);
  useAppStore.getState().openHierarchy();
  return newGO;
};
