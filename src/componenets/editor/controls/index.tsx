import clsx from "clsx";
import { BoundingBox, Files, ListDashes, ListPlus, Play } from "phosphor-react";

import { makeDummyGameObject } from "../../../primitives/gameobject";
import { useAppStore } from "../../../stores/app";
import { useSceneStore } from "../../../stores/scene";
import classes from "./styles.module.scss";

export const Controls = () => {
  const isLibraryOpen = useAppStore((state) => state.isLibraryOpen);
  const scene = useSceneStore((state) => state.objects);
  const toggleLibrary = useAppStore((state) => state.toggleLibrary);
  const isHierarchyOpen = useAppStore((state) => state.isHierarchyOpen);
  const toggleHierarchy = useAppStore((state) => state.toggleHierarchy);
  const isInPlayMode = useAppStore((state) => state.isInPlayMode);
  const togglePlayMode = useAppStore((state) => state.togglePlayMode);
  const openHierarchy = useAppStore((state) => state.openHierarchy);
  const addObject = useSceneStore((state) => state.addObject);
  const selectObject = useSceneStore((state) => state.selectObject);
  const unselectObject = useSceneStore((state) => state.unselectObject);
  const closeHierarchy = useAppStore((state) => state.closeHierarchy);
  const togglePhysicsDebug = useAppStore((state) => state.togglePhysicsDebug);
  const physicsDebug = useAppStore((state) => state.physicsDebug);

  return (
    <div className={classes.controls}>
      <button
        title="Создать новый игровой объект"
        onClick={() => {
          const newGO = makeDummyGameObject();
          newGO.name = "Test GameObject";
          addObject(newGO);
          selectObject(newGO);
          openHierarchy();
        }}
      >
        <ListPlus />
      </button>
      <button
        title="Показать/скрыть Библиотеку"
        className={clsx(isLibraryOpen && classes.active)}
        onClick={() => toggleLibrary()}
      >
        <Files />
      </button>
      <button
        title="Показать/скрыть Иерархию"
        className={clsx(isHierarchyOpen && classes.active)}
        onClick={() => {
          if (!scene.length) return;
          toggleHierarchy();
        }}
      >
        <ListDashes />
      </button>
      <button
        title="Показать/скрыть дебаг коллайдеров"
        className={clsx(physicsDebug && classes.active)}
        onClick={() => togglePhysicsDebug()}
      >
        <BoundingBox />
      </button>
      <button
        title="Включить/отключить игровой режим"
        className={clsx(isInPlayMode && classes.active)}
        onClick={() => {
          togglePlayMode();
          unselectObject();
          closeHierarchy();
        }}
      >
        <Play />
      </button>
    </div>
  );
};
