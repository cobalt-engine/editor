import clsx from "clsx";
import { Car } from "phosphor-react";
import { useMemo } from "react";
import Dropzone from "react-dropzone";

import { GameModel } from "../../../../../primitives/gameobject";
import { useLibraryStore } from "../../../../../stores/library";
import { useSceneStore } from "../../../../../stores/scene";
import { Select } from "../../../../select";
import { Paragraph } from "../../../../typography/paragraph";
import classes from "./styles.module.scss";

export const RenderingPanel = () => {
  const addModel = useLibraryStore((state) => state.addModel);
  const changeObjectModel = useSceneStore((state) => state.changeObjectModel);
  const selectedObject = useSceneStore((state) => state.selectedObject);
  const library = useLibraryStore((state) => state.objects);

  const options = useMemo<
    Array<{
      value: GameModel;
      label: string;
    }>
  >(
    () => [
      ...library.map(({ name, src }) => ({
        label: name,
        value: { type: "glb" as const, src },
      })),
      { label: "Default Cube", value: { type: "cube" } },
    ],
    [library]
  );
  const selectedOption = useMemo(
    () =>
      options.find(({ value }) =>
        value.type === "glb" && selectedObject?.rendering.model.type === "glb"
          ? value.src === selectedObject?.rendering.model.src
          : value.type === selectedObject?.rendering.model.type || undefined
      ),
    [options, selectedObject]
  );

  return (
    <>
      <div className={classes.modelContainer}>
        <Dropzone
          accept={{ "application/octet-stream": [".glb"] }}
          onDrop={([model]) => {
            if (!selectedObject) return;
            const url = URL.createObjectURL(model);
            addModel(url, model.name);
            changeObjectModel(selectedObject, {
              type: "glb",
              src: url,
            });
          }}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              className={clsx(classes.model, isDragActive && classes.hint)}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <Car />
            </div>
          )}
        </Dropzone>
        <div
          style={{
            marginLeft: 8,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Paragraph color="light" className={classes.description}>
            Перенеси модель из Проводника или выбери её из Библиотеки ниже
          </Paragraph>
          <Select
            placeholder="Поиск по Библиотеке..."
            options={options}
            value={selectedOption}
            onChange={(v) => {
              if (!selectedObject) return;
              if (!v) return;
              else {
                if (v.value.type === "cube")
                  changeObjectModel(selectedObject, { type: "cube" });
                if (v.value.type === "glb")
                  changeObjectModel(selectedObject, {
                    type: "glb",
                    src: v.value.src,
                  });
              }
            }}
          />
        </div>
      </div>
    </>
  );
};
