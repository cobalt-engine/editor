import { CSSProperties, useEffect, useState } from "react";

import { V3 } from "../../primitives/vector3";
import { DragInput } from "../drag-input";

interface Props {
  fullLabels?: boolean;
  onChange?: (v: V3) => void;
  value?: V3;
  labels?: [string, string, string];
  style?: CSSProperties;
}

export const VectorInput = ({
  fullLabels = false,
  style,
  onChange,
  value: externalValue,
  labels = ["X", "Y", "Z"],
}: Props) => {
  const [value, setValue] = useState(new V3());

  useEffect(() => {
    if (externalValue) setValue(externalValue);
  }, [externalValue]);

  return (
    <div style={{ ...style, display: "flex" }}>
      <div style={{ flex: 1, display: "flex" }}>
        <DragInput
          fullLabel={fullLabels}
          label={labels[0]}
          value={value.x}
          onChange={(v) => {
            setValue((old) => {
              const newValue = new V3(v, old.y, old.z);
              if (onChange) onChange(newValue);
              return newValue;
            });
          }}
        />
      </div>
      <div style={{ marginLeft: 8, flex: 1, display: "flex" }}>
        <DragInput
          fullLabel={fullLabels}
          label={labels[1]}
          value={value.y}
          onChange={(v) => {
            setValue((old) => {
              const newValue = new V3(old.x, v, old.z);
              if (onChange) onChange(newValue);
              return newValue;
            });
          }}
        />
      </div>
      <div style={{ marginLeft: 8, flex: 1, display: "flex" }}>
        <DragInput
          fullLabel={fullLabels}
          label={labels[2]}
          value={value.z}
          onChange={(v) => {
            setValue((old) => {
              const newValue = new V3(old.x, old.y, v);
              if (onChange) onChange(newValue);
              return newValue;
            });
          }}
        />
      </div>
    </div>
  );
};
