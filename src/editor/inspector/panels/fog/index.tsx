import { HexColorPicker } from "react-colorful";

import { DragInput } from "../../../../componenets/drag-input";
import { useSceneStore } from "../../../../stores/scene";

export const FogPanel = () => {
  const selectedObject = useSceneStore((state) => state.selectedObject);
  const changeObjectFogNear = useSceneStore(
    (state) => state.changeObjectFogNear
  );
  const changeObjectFogFar = useSceneStore((state) => state.changeObjectFogFar);
  const changeObjectFogColor = useSceneStore(
    (state) => state.changeObjectFogColor
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <DragInput
        fullLabel
        label="Ближний план"
        value={selectedObject?.fog.near}
        onChange={(v) => {
          if (selectedObject) changeObjectFogNear(selectedObject, v);
        }}
      />
      <DragInput
        style={{ marginTop: 6 }}
        fullLabel
        label="Дальний план"
        value={selectedObject?.fog.far}
        onChange={(v) => {
          if (selectedObject) changeObjectFogFar(selectedObject, v);
        }}
      />
      <HexColorPicker
        style={{ width: "100%", marginTop: 6 }}
        color={selectedObject?.fog.color}
        onChange={(v) => {
          if (selectedObject) changeObjectFogColor(selectedObject, v);
        }}
      />
    </div>
  );
};
