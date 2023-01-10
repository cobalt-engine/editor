import { degToRad, radToDeg } from "three/src/math/MathUtils";

import { VectorInput } from "../../../../componenets/vector-input";
import { V3 } from "../../../../primitives/vector3";
import { useSceneStore } from "../../../../stores/scene";

export const TransformPanel = () => {
  const moveObject = useSceneStore((state) => state.moveObject);
  const scaleObject = useSceneStore((state) => state.scaleObject);
  const rotateObject = useSceneStore((state) => state.rotateObject);
  const selectedObject = useSceneStore((state) => state.selectedObject);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <VectorInput
        value={selectedObject?.transform.position}
        onChange={(value) => {
          if (selectedObject) moveObject(selectedObject, value);
        }}
      />
      <VectorInput
        fullLabels
        labels={["RX", "RY", "RZ"]}
        style={{ marginTop: 6 }}
        value={
          selectedObject
            ? new V3(
                radToDeg(selectedObject.transform.rotation.x),
                radToDeg(selectedObject.transform.rotation.y),
                radToDeg(selectedObject.transform.rotation.z)
              )
            : undefined
        }
        onChange={(value) => {
          if (selectedObject)
            rotateObject(
              selectedObject,
              new V3(degToRad(value.x), degToRad(value.y), degToRad(value.z))
            );
        }}
      />
      <VectorInput
        fullLabels
        labels={["SX", "SY", "SZ"]}
        style={{ marginTop: 6 }}
        value={selectedObject?.transform.scale}
        onChange={(value) => {
          if (selectedObject) scaleObject(selectedObject, value);
        }}
      />
    </div>
  );
};
