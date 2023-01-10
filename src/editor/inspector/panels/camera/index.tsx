import { useMemo } from "react";

import { Checkbox } from "../../../../componenets/checkbox";
import { DragInput } from "../../../../componenets/drag-input";
import { Select } from "../../../../componenets/select";
import { useSceneStore } from "../../../../stores/scene";

export const CameraPanel = () => {
  const selectedObject = useSceneStore((state) => state.selectedObject);
  const changeObjectCameraType = useSceneStore(
    (state) => state.changeObjectCameraType
  );
  const changeObjectCameraFov = useSceneStore(
    (state) => state.changeObjectCameraFov
  );
  const changeObjectCameraDefault = useSceneStore(
    (state) => state.changeObjectCameraDefault
  );

  const cameraOptions = useMemo(
    () => [
      { label: "Перспектива", value: "perspective" as const },
      { label: "Ортографическая", value: "orthographic" as const },
    ],
    []
  );
  const selectedCameraOption = useMemo(
    () =>
      cameraOptions.find(
        ({ value }) => value === selectedObject?.camera.type || undefined
      ),
    [cameraOptions, selectedObject?.camera.type]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Select
        options={cameraOptions}
        value={selectedCameraOption}
        onChange={(v) => {
          if (selectedObject && v?.value)
            changeObjectCameraType(selectedObject, v.value);
        }}
      />
      <DragInput
        style={{ marginTop: 6 }}
        fullLabel
        label="Угол обзора"
        value={selectedObject?.camera.fov}
        onChange={(v) => {
          if (selectedObject) changeObjectCameraFov(selectedObject, v);
        }}
      />
      <Checkbox
        value={selectedObject?.camera.isDefault}
        onChange={(v) => {
          if (selectedObject) changeObjectCameraDefault(selectedObject, v);
        }}
        style={{ marginTop: 4 }}
      >
        Сделать главной
      </Checkbox>
    </div>
  );
};
