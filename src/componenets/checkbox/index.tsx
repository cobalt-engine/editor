import { CSSProperties, useEffect, useId, useState } from "react";

import { Paragraph } from "../typography/paragraph";

interface Props {
  children?: string;
  value?: boolean;
  onChange?: (v: boolean) => void;
  style?: CSSProperties;
}

export const Checkbox = ({
  style,
  children,
  onChange,
  value: externalValue,
}: Props) => {
  const id = useId();
  const [value, setValue] = useState(false);

  useEffect(() => {
    if (typeof externalValue === "boolean") setValue(externalValue);
  }, [externalValue]);

  return (
    <div
      style={{ ...style, display: "flex", marginTop: 8, alignItems: "center" }}
    >
      <input
        type="checkbox"
        id={id}
        checked={value}
        onChange={(v) => {
          setValue(v.target.checked);
          if (onChange) onChange(v.target.checked);
        }}
      />
      {children && (
        <label htmlFor={id} style={{ marginLeft: 6 }}>
          <Paragraph color="light">{children}</Paragraph>
        </label>
      )}
    </div>
  );
};
