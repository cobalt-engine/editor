import { DragInput } from "../../../../../componenets/drag-input";
import { useSceneStore } from "../../../../../stores/scene";

export const DofPanel = () => {
  const selectedObject = useSceneStore((state) => state.selectedObject);
  const changeObjectPostprocessingDofFocusDistance = useSceneStore(
    (state) => state.changeObjectPostprocessingDofFocusDistance
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <DragInput
        label="Фокусное расстояние"
        fullLabel
        // value={selectedObject?.postprocessing.dof.focusDistance}
        onChange={(value) => {
          if (selectedObject)
            changeObjectPostprocessingDofFocusDistance(selectedObject, value);
        }}
      />
    </div>
  );
};
