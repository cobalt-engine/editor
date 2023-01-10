import { useMemo } from "react";

import { Checkbox } from "../../../../componenets/checkbox";
import { Select } from "../../../../componenets/select";
import { useSceneStore } from "../../../../stores/scene";

export const NetworkingPanel = () => {
  const selectedObject = useSceneStore((state) => state.selectedObject);

  const networkingOptions = useMemo(
    () => [
      { label: "TCP (Not yet ready)", value: "tcp" as const },
      { label: "UDP", value: "udp" as const },
    ],
    []
  );
  const selectedNetworkingOption = useMemo(
    () =>
      networkingOptions.find(
        ({ value }) => value === selectedObject?.networking.type || undefined
      ),
    [networkingOptions, selectedObject?.networking.type]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Select
        value={selectedNetworkingOption}
        placeholder="Тип Бекенда"
        options={networkingOptions}
        onChange={(v) => {
          if (!selectedObject || !v) return;
          // Not yet implemented
        }}
      />
      <Checkbox>Синхронизировать позицию</Checkbox>
      <Checkbox style={{ marginTop: 4 }}>Синхронизировать поворот</Checkbox>
    </div>
  );
};
