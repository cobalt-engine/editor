import JSZip from "jszip";
import { FileArrowUp } from "phosphor-react";
import Dropzone from "react-dropzone";

import { Heading } from "../componenets/typography/heading";
import { Paragraph } from "../componenets/typography/paragraph";
import { GameObject } from "../primitives/gameobject";
import { useLibraryStore } from "../stores/library";
import { useModalStore } from "../stores/modals";
import { useSceneStore } from "../stores/scene";
import { BaseModal } from "./base";

export const LoadSceneModal = () => {
  const isLoadSceneModalVisible = useModalStore(
    (state) => state.isLoadSceneModalVisible
  );
  const closeLoadSceneModal = useModalStore(
    (state) => state.closeLoadSceneModal
  );
  const openAppBusyModal = useModalStore((state) => state.openAppBusyModal);
  const closeAppBusyModal = useModalStore((state) => state.closeAppBusyModal);
  const addObject = useSceneStore((state) => state.addObject);
  const addModel = useLibraryStore((state) => state.addModel);
  const clearScene = useSceneStore((state) => state.clearScene);
  const clearLibrary = useLibraryStore((state) => state.clearLibrary);

  return (
    <BaseModal show={isLoadSceneModalVisible} onHide={closeLoadSceneModal}>
      <Heading color="light">Загрузить сцену</Heading>
      <Paragraph color="light" style={{ marginTop: 12 }}>
        Убедитесь, что сцена это не просто комок мюсли из под дивана. Cobalt
        пока не умеет распозновать ошибки и ни в коем случае не справится с
        проверкой на прочность
      </Paragraph>
      <Dropzone
        accept={{ "application/zip": [".zip"] }}
        onDrop={async ([archive]) => {
          closeLoadSceneModal();
          openAppBusyModal();

          clearScene();
          clearLibrary();

          const urls = new Map<string, string>();
          const { files } = await JSZip.loadAsync(archive);

          const scene = JSON.parse(
            await files["scene.json"].async("string")
          ) as Array<GameObject>;
          delete files["scene.json"];

          for (const file of Object.values(files)) {
            const url = URL.createObjectURL(await file.async("blob"));
            urls.set(file.name, url);
            addModel(url, file.name);
          }

          for (const gameObject of scene) {
            if (gameObject.rendering.model.type === "glb") {
              const newUrl = urls.get(gameObject.rendering.model.src);
              if (newUrl) gameObject.rendering.model.src = newUrl;
            }
            addObject(gameObject);
          }

          closeAppBusyModal();
        }}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            style={{
              marginTop: 12,
              width: "100%",
              height: 120,
              border: isDragActive
                ? "1px dashed var(--light-100)"
                : "1px dashed var(--light-80)",
              transition: "all .3s ease",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <FileArrowUp size={32} color="var(--light-100)" />
              <Paragraph
                color="light"
                style={{
                  textAlign: "center",
                  paddingLeft: 8,
                  paddingRight: 8,
                  marginTop: 12,
                }}
              >
                Просто перенесите сгенерированный архив прямо сюда. Drag-n-drop,
                как доктор прописал
              </Paragraph>
            </div>
          </div>
        )}
      </Dropzone>
    </BaseModal>
  );
};
