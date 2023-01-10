import { CSSProperties, useEffect, useState } from "react";

import classes from "./styles.module.scss";

interface Props<T> {
  style?: CSSProperties;
  placeholder?: string;
  value?: T;
  onChange?: (v: T) => void;
}

export function Input<T extends string | number>({
  style,
  placeholder,
  value: externalValue,
  onChange,
}: Props<T>) {
  const [value, setValue] = useState<string | number>("");

  useEffect(() => {
    if (typeof externalValue === "string" || typeof externalValue === "number")
      setValue(externalValue);
  }, [externalValue]);

  return (
    <input
      style={style}
      placeholder={placeholder}
      className={classes.input}
      onChange={(e) => {
        setValue(e.target.value);
        if (onChange) onChange(e.target.value as T);
      }}
      value={value}
    />
  );
}
