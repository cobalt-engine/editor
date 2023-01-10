import axios from "axios";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { nanoid } from "nanoid";
import { useMemo } from "react";
import { Item, Menu as ContextMenu, useContextMenu } from "react-contexify";

import { Paragraph } from "../../componenets/typography/paragraph";
import { useAppStore } from "../../stores/app";
import { useLibraryStore } from "../../stores/library";
import { useModalStore } from "../../stores/modals";
import { BackendStatus, useNetworkStore } from "../../stores/network";
import { useSceneStore } from "../../stores/scene";
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
  const backendStatus = useAppStore((state) => state.backendStatus);
  const tick = useNetworkStore((state) => state.tick);
  const localTick = useSceneStore((state) => state.tick);
  const fps = useAppStore((state) => state.fps);

  const notInSync = useMemo(() => localTick !== tick, [tick, localTick]);

  const backendStatusColor = useMemo(() => {
    if (backendStatus === BackendStatus.Awaiting) return "yellow";
    if (backendStatus === BackendStatus.Offline) return "gray";
    if (backendStatus === BackendStatus.Ready) return "green";
    if (backendStatus === BackendStatus.Signaling) return "blue";
    return "red";
  }, [backendStatus]);
  const backendStatusString = useMemo(() => {
    if (backendStatus === BackendStatus.Awaiting) return "Ожидаем Socket.io";
    if (backendStatus === BackendStatus.Offline) return "Офлайн";
    if (backendStatus === BackendStatus.Ready) return "Онлайн";
    if (backendStatus === BackendStatus.Signaling) return "Ожидаем WebRTC";
    return "Ошибка";
  }, [backendStatus]);

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
        <div style={{ flex: 1 }} />
        <div
          title={`Сцена отображается в ${fps} кадра в секунду`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
            height: "100%",
            paddingInline: 6,
            backgroundColor: "var(--dark-80)",
            border: "1px dashed var(--light-80)",
          }}
        >
          <Paragraph color="light">{fps.toString()}</Paragraph>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Paragraph
            title={
              notInSync
                ? "Текущий кадр клиента не совпадает с кадром сервера!"
                : "Текущий кадр клиента"
            }
            color={notInSync ? "custom" : "light"}
            style={{
              color: notInSync ? "yellow" : undefined,
              marginRight: 6,
            }}
          >
            {localTick.toString()}
          </Paragraph>
          <Paragraph
            title="Текущий кадр сервера"
            color="light"
            style={{ marginRight: 6 }}
          >
            {tick.toString()}
          </Paragraph>
          <div
            title={`Статус подключения к Бекенду: ${backendStatusString}`}
            style={{
              width: 8,
              height: 8,
              backgroundColor: backendStatusColor,
              borderRadius: 8 / 2,
            }}
          />
        </div>
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
