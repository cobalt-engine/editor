import { useMemo } from "react";
import { HexColorPicker } from "react-colorful";

import { Checkbox } from "../../../../componenets/checkbox";
import { DragInput } from "../../../../componenets/drag-input";
import { Select } from "../../../../componenets/select";
import { useSceneStore } from "../../../../stores/scene";

export const LightPanel = () => {
  const selectedObject = useSceneStore((state) => state.selectedObject);
  const changeObjectLightIntensity = useSceneStore(
    (state) => state.changeObjectLightIntensity
  );
  const changeObjectLightType = useSceneStore(
    (state) => state.changeObjectLightType
  );
  const changeObjectLightColor = useSceneStore(
    (state) => state.changeObjectLightColor
  );
  const changeObjectLightCastShadows = useSceneStore(
    (state) => state.changeObjectLightCastShadows
  );

  const lightOptions = useMemo(
    () => [
      { label: "Точечный", value: "point" as const },
      { label: "Прожектор", value: "spot" as const },
      { label: "Направленный", value: "directional" as const },
      { label: "В области", value: "area" as const },
      { label: "Окружение", value: "ambient" as const },
    ],
    []
  );
  const selectedLightOption = useMemo(
    () =>
      lightOptions.find(
        ({ value }) => value === selectedObject?.light.type || undefined
      ),
    [lightOptions, selectedObject?.light.type]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Select
        options={lightOptions}
        value={selectedLightOption}
        onChange={(v) => {
          if (selectedObject && v?.value)
            changeObjectLightType(selectedObject, v.value);
        }}
      />
      <DragInput
        style={{ marginTop: 6 }}
        fullLabel
        label="Интенсивность"
        value={selectedObject?.light.intensity}
        onChange={(v) => {
          if (selectedObject) changeObjectLightIntensity(selectedObject, v);
        }}
      />
      <HexColorPicker
        style={{ width: "100%", marginTop: 6 }}
        color={selectedObject?.light.color}
        onChange={(v) => {
          if (selectedObject) changeObjectLightColor(selectedObject, v);
        }}
      />
      <Checkbox
        value={selectedObject?.light.castShadows}
        onChange={(v) => {
          if (selectedObject) changeObjectLightCastShadows(selectedObject, v);
        }}
      >
        Тени
      </Checkbox>
    </div>
  );
};
