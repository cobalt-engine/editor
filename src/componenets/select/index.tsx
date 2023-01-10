import { CaretDown, X } from "phosphor-react";
import { CSSProperties, useEffect, useState } from "react";
import SelectBase from "react-select";

import classes from "./styles.module.scss";

type Props<T> = {
  options: Array<T>;
  value?: T | undefined;
  onChange?: (v: T | undefined) => void;
  placeholder?: string;
  style?: CSSProperties;
};

export function Select<T extends { label: string; value: unknown }>({
  options,
  value: externalValue,
  onChange,
  placeholder,
  style,
}: Props<T>) {
  const [value, setValue] = useState<T | undefined>(undefined);

  useEffect(() => {
    setValue(externalValue);
  }, [externalValue]);

  const HEIGHT = 36;
  const ITEM_HEIGHT = 24;

  return (
    <SelectBase
      components={{
        DropdownIndicator: ({ isFocused }) => (
          <CaretDown
            weight="fill"
            width={12}
            height={12}
            color={isFocused ? "var(--gray-100)" : "var(--light-80)"}
            style={{
              transition: "all .3s ease",
              marginRight: 4,
              marginLeft: 4,
            }}
          />
        ),
        ClearIndicator: ({ clearValue }) => (
          <X onClick={clearValue} weight="bold" className={classes.clear} />
        ),
      }}
      styles={{
        control: (base) => ({
          ...base,
          ...style,
          cursor: "pointer",
          minHeight: HEIGHT,
          maxHeight: HEIGHT,
          borderColor: "transparent",
          boxShadow: "none",
          alignItems: "unset",
          backgroundColor: "var(--light-100)",
          transition: "all .3s ease",
          "&:hover": {
            backgroundColor: "var(--light-60)",
          },
        }),
        valueContainer: (base) => ({
          ...base,
          paddingBlock: 0,
          alignItems: "unset",
        }),
        indicatorsContainer: (base) => ({
          ...base,
          padding: 0,
        }),
        dropdownIndicator: (base) => ({
          ...base,
          padding: 0,
        }),
        input: (base) => ({
          ...base,
          padding: 0,
          margin: 0,
          font: "var(--paragraph-sm)",
          color: "var(--dark-100)",
        }),
        placeholder: (base) => ({
          ...base,
          color: "var(--dark-100)",
          font: "var(--paragraph-sm)",
          display: "flex",
          alignItems: "center",
        }),
        option: (base, state) => ({
          ...base,
          height: ITEM_HEIGHT,
          color: "var(--dark-100)",
          font: "var(--paragraph-sm)",
          display: "flex",
          alignItems: "center",
          transition: "all .3s ease",
          backgroundColor:
            state.isFocused || state.isSelected
              ? "var(--light-100)"
              : "transparent",
        }),
        singleValue: (base) => ({
          ...base,
          font: "var(--paragraph-sm)",
          color: "var(--dark-100)",
          height: HEIGHT,
          display: "flex",
          alignItems: "center",
        }),
      }}
      placeholder={placeholder}
      value={value}
      options={options}
      onChange={(e) => {
        setValue(e || undefined);
        if (onChange) onChange(e || undefined);
      }}
    />
  );
}
