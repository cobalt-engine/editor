import { V3 } from "../../../../../primitives/vector3";
import { useSceneStore } from "../../../../../stores/scene";
import { DragInput } from "../../../../drag-input";
import classes from "./styles.module.scss";

export const TransformPanel = () => {
  const moveObject = useSceneStore((state) => state.moveObject);
  const selectedObject = useSceneStore((state) => state.selectedObject);

  if (!selectedObject) return null;

  return (
    <div className={classes.transformPanel}>
      <div style={{ flex: 1, display: "flex" }}>
        <DragInput
          label="X"
          value={selectedObject.position.x}
          onChange={(v) => {
            moveObject(
              selectedObject,
              new V3(v, selectedObject.position.y, selectedObject.position.z)
            );
          }}
        />
      </div>
      <div style={{ marginLeft: 8, flex: 1, display: "flex" }}>
        <DragInput
          label="Y"
          value={selectedObject.position.y}
          onChange={(v) => {
            moveObject(
              selectedObject,
              new V3(selectedObject.position.x, v, selectedObject.position.z)
            );
          }}
        />
      </div>
      <div style={{ marginLeft: 8, flex: 1, display: "flex" }}>
        <DragInput
          label="Z"
          value={selectedObject.position.z}
          onChange={(v) => {
            moveObject(
              selectedObject,
              new V3(selectedObject.position.x, selectedObject.position.y, v)
            );
          }}
        />
      </div>
    </div>
  );
};
