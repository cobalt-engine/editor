import clsx from "clsx";
import { Scroll } from "phosphor-react";
import { useMemo } from "react";

import { Select } from "../../../../componenets/select";
import { Paragraph } from "../../../../componenets/typography/paragraph";
import { VectorInput } from "../../../../componenets/vector-input";
import { useSceneStore } from "../../../../stores/scene";
import classes from "./styles.module.scss";

export const PhysicsPanel = () => {
  const selectedObject = useSceneStore((state) => state.selectedObject);
  const changeObjectRigidbodyType = useSceneStore(
    (state) => state.changeObjectRigidbodyType
  );
  const changeObjectColliderType = useSceneStore(
    (state) => state.changeObjectColliderType
  );
  const changeObjectColliderSize = useSceneStore(
    (state) => state.changeObjectColliderSize
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
    () => [
      { label: "Куб", value: "cuboid" as const },
      { label: "Сфера", value: "ball" as const },
      { label: "Сложный меш", value: "trimesh" as const },
      { label: "Упрощённый меш", value: "hull" as const },
    ],

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
      <div className={classes.modelContainer}>
        <div className={clsx(classes.model, false && classes.hint)}>
          <Scroll />
        </div>
        <div
          style={{
            marginLeft: 8,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Paragraph color="light" className={classes.description}>
            Перенеси скрипт из Библиотеки или выбери его ниже
          </Paragraph>
          <Select
            placeholder="Поиск по Библиотеке..."
            options={[]}
            value={undefined}
          />
        </div>
      </div>
      <VectorInput
        labels={["Высота", "Ширина", "Глубина"]}
        style={{ marginTop: 8 }}
        value={selectedObject?.physics.collider.sizes}
        onChange={(value) => {
          if (selectedObject) changeObjectColliderSize(selectedObject, value);
        }}
      />
    </div>
  );
};
