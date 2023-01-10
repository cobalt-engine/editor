import clsx from "clsx";
import {
  AppWindow,
  BoundingBox,
  Files,
  ListDashes,
  ListPlus,
  Play,
  PushPin,
} from "phosphor-react";
import { useContextMenu } from "react-contexify";

import { useAppStore } from "../../stores/app";
import { useSceneStore } from "../../stores/scene";
import classes from "./styles.module.scss";

export const Controls = () => {
  const isLibraryOpen = useAppStore((state) => state.isLibraryOpen);
  const scene = useSceneStore((state) => state.objects);
  const toggleLibrary = useAppStore((state) => state.toggleLibrary);
  const isHierarchyOpen = useAppStore((state) => state.isHierarchyOpen);
  const toggleHierarchy = useAppStore((state) => state.toggleHierarchy);
  const isInPlayMode = useAppStore((state) => state.isInPlayMode);
  const togglePlayMode = useAppStore((state) => state.togglePlayMode);
  const unselectObject = useSceneStore((state) => state.unselectObject);
  const closeHierarchy = useAppStore((state) => state.closeHierarchy);
  const togglePhysicsDebug = useAppStore((state) => state.togglePhysicsDebug);
  const physicsDebug = useAppStore((state) => state.physicsDebug);
  const toggle3dIcons = useAppStore((state) => state.toggle3dIcons);
  const is3dIconsVisible = useAppStore((state) => state.is3dIconsVisible);
  const isCreateObjectPopupVisible = useAppStore(
    (state) => state.isCreateObjectPopupVisible
  );

  const { show } = useContextMenu({ id: "CONTEXT_MENU_CREATE_OBJECT" });

  return (
    <div className={classes.controls}>
      <button
        className={clsx(isCreateObjectPopupVisible && classes.active)}
        title="Создать новый игровой объект"
        onClick={(event) => show({ event })}
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
        title="Показать/скрыть 3D иконки"
        className={clsx(is3dIconsVisible && !isInPlayMode && classes.active)}
        onClick={() => toggle3dIcons()}
      >
        <PushPin />
      </button>
      <button
        title="Закрыть/открыть Рабочий стол"
        // className={clsx(isInPlayMode && classes.active)}
        onClick={() => {
          alert("Пока не готово");
        }}
      >
        <AppWindow />
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
