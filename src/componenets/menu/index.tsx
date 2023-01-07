import axios from "axios";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { nanoid } from "nanoid";
import { Item, Menu as ContextMenu, useContextMenu } from "react-contexify";

import { useAppStore } from "../../stores/app";
import { useLibraryStore } from "../../stores/library";
import { useModalStore } from "../../stores/modals";
import { useSceneStore } from "../../stores/scene";
import { Paragraph } from "../typography/paragraph";
import classes from "./styles.module.scss";

export const Menu = () => {
  const scene = useSceneStore((state) => state.objects);
  const library = useLibraryStore((state) => state.objects);
  const clearScene = useSceneStore((state) => state.clearScene);
  const toggleLibrary = useAppStore((state) => state.toggleLibrary);
  const toggleHierarchy = useAppStore((state) => state.toggleHierarchy);
  const isLibraryOpen = useAppStore((state) => state.isLibraryOpen);
  const isHierarchyOpen = useAppStore((state) => state.isHierarchyOpen);
  const openAppBusyModal = useModalStore((state) => state.openAppBusyModal);
  const closeAppBusyModal = useModalStore((state) => state.closeAppBusyModal);
  const openLoadSceneModal = useModalStore((state) => state.openLoadSceneModal);

  const { show: showFile } = useContextMenu({
    id: "CONTEXT_MENU_FILE",
  });
  const { show: showView } = useContextMenu({
    id: "CONTEXT_MENU_VIEW",
  });

  return (
    <>
      <div className={classes.menu}>
        <button onClick={(event) => showFile({ event })}>
          <Paragraph color="light">Файл</Paragraph>
        </button>
        <button onClick={(event) => showView({ event })}>
          <Paragraph color="light">Окно</Paragraph>
        </button>
      </div>

      <ContextMenu id="CONTEXT_MENU_FILE">
        <Item
          onClick={async () => {
            openAppBusyModal();
            const renamed = new Map<string, string>();
            const zip = new JSZip();
            for (const { rendering } of scene) {
              if (rendering.model.type === "glb") {
                const model = library.find(
                  ({ src }) =>
                    rendering.model.type === "glb" &&
                    src === rendering.model.src
                );
                if (!model) return;
                renamed.set(model.src, nanoid() + ".glb");
                const { data } = await axios.get(model.src, {
                  responseType: "arraybuffer",
                });
                const newName = renamed.get(model.src);
                if (newName) zip.file(newName, data);
              }
            }
            zip.file(
              "scene.json",
              JSON.stringify(
                scene.map(({ rendering, ...rest }) => ({
                  ...rest,
                  rendering: {
                    ...rendering,
                    model:
                      rendering.model.type === "glb"
                        ? {
                            ...rendering.model,
                            src: renamed.get(rendering.model.src),
                          }
                        : { ...rendering.model },
                  },
                }))
              )
            );
            const file = await zip.generateAsync({ type: "blob" });
            saveAs(file, "new_level.zip");
            closeAppBusyModal();
          }}
        >
          Сохранить сцену
        </Item>
        <Item onClick={() => openLoadSceneModal()}>Загрузить сцену</Item>
        <Item onClick={() => clearScene()}>Начать заново</Item>
      </ContextMenu>

      <ContextMenu id="CONTEXT_MENU_VIEW">
        <Item onClick={() => toggleLibrary()}>
          {isLibraryOpen ? "Скрыть" : "Показать"} Библиотеку
        </Item>
        <Item
          onClick={() => {
            if (!scene.length) return;
            toggleHierarchy();
          }}
        >
          {isHierarchyOpen ? "Скрыть" : "Показать"} Иерархию
        </Item>
      </ContextMenu>
    </>
  );
};
