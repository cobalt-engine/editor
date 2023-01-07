import { useMemo } from "react";

import { useSceneStore } from "../../../../../stores/scene";
import { Select } from "../../../../select";

export const PhysicsPanel = () => {
  const selectedObject = useSceneStore((state) => state.selectedObject);
  const changeObjectRigidbodyType = useSceneStore(
    (state) => state.changeObjectRigidbodyType
  );
  const changeObjectColliderType = useSceneStore(
    (state) => state.changeObjectColliderType
  );

  const rigidbodyOptions = useMemo(
    () => [
      { label: "Недвижимое", value: "fixed" as const },
      { label: "Движимое", value: "dynamic" as const },
    ],
    []
  );
  const selectedRigidbodyOption = useMemo(
    () =>
      rigidbodyOptions.find(
        ({ value }) =>
          value === selectedObject?.physics.rigidbody.type || undefined
      ),
    [rigidbodyOptions, selectedObject?.physics.rigidbody.type]
  );

  const colliderOptions = useMemo(
    () => [{ label: "Куб", value: "cuboid" as const }],
    []
  );
  const selectedColliderOption = useMemo(
    () =>
      colliderOptions.find(
        ({ value }) =>
          value === selectedObject?.physics.collider.type || undefined
      ),
    [colliderOptions, selectedObject?.physics.collider.type]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Select
        value={selectedRigidbodyOption}
        placeholder="Тип тела"
        options={rigidbodyOptions}
        onChange={(v) => {
          if (!selectedObject || !v) return;
          changeObjectRigidbodyType(selectedObject, v.value);
        }}
      />
      <Select
        style={{ marginTop: 6 }}
        placeholder="Тип коллайдера"
        options={colliderOptions}
        value={selectedColliderOption}
        onChange={(v) => {
          if (!selectedObject || !v) return;
          changeObjectColliderType(selectedObject, v.value);
        }}
      />
    </div>
  );
};
