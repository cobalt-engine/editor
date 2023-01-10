import {
  CSSProperties,
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";

import { Paragraph } from "../typography/paragraph";
import classes from "./styles.module.scss";

interface Props {
  label: string;
  value?: number;
  onChange?: (value: number) => void;
  fullLabel?: boolean;
  style?: CSSProperties;
}

// An numeric input element which has a label which can be dragged to change
// the value.
export function DragInput({
  fullLabel,
  value: externalValue,
  onChange,
  label,
  style,
}: Props) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (externalValue) setValue(externalValue);
  }, [externalValue]);

  return (
    <div
      style={style}
      title={label.length > 1 ? label : undefined}
      className={classes.dragInput}
    >
      <DragLabel
        fullLabel={fullLabel}
        value={value}
        setValue={(v: number) => {
          setValue(v);
          if (onChange) onChange(v);
        }}
      >
        {label}
      </DragLabel>
      <input
        value={value.toFixed(2)}
        onChange={(ev) => {
          const v = parseFloat(ev.target.value);
          setValue(v);
          if (onChange) onChange(v);
        }}
      />
    </div>
  );
}

function DragLabel({
  value,
  setValue,
  children,
  fullLabel = false,
}: {
  value: number;
  setValue: any;
  children: string;
  fullLabel?: boolean;
}) {
  // We are creating a snapshot of the values when the drag starts
  // because the [value] will itself change & we need the original
  // [value] to calculate during a drag.
  const [snapshot, setSnapshot] = useState(value);

  // This captures the starting position of the drag and is used to
  // calculate the diff in positions of the cursor.
  const [startVal, setStartVal] = useState(0);

  // Start the drag to change operation when the mouse button is down.
  const onStart = useCallback<MouseEventHandler<HTMLSpanElement>>(
    (event) => {
      setStartVal(event.clientX);
      setSnapshot(value);
    },
    [value]
  );

  // We use document events to update and end the drag operation
  // because the mouse may not be present over the label during
  // the operation..
  useEffect(() => {
    // Only change the value if the drag was actually started.
    const onUpdate = (event: MouseEvent) => {
      if (startVal) {
        setValue(snapshot + event.clientX - startVal);
      }
    };

    // Stop the drag operation now.
    const onEnd = () => {
      setStartVal(0);
    };

    document.addEventListener("mousemove", onUpdate);
    document.addEventListener("mouseup", onEnd);
    return () => {
      document.removeEventListener("mousemove", onUpdate);
      document.removeEventListener("mouseup", onEnd);
    };
  }, [startVal, setValue, snapshot]);

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <Paragraph color="custom" onMouseDown={onStart} className={classes.label}>
      {fullLabel ? children : children[0]}
    </Paragraph>
  );
}
