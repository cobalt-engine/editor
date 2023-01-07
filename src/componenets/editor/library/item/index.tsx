import { useDrag } from "react-dnd";

import { Paragraph } from "../../../typography/paragraph";

interface Props {
  name: string;
}

export const LibraryItem = ({ name }: Props) => {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: "LibraryItem",
      item: 0,
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }),
    []
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        ref={dragRef}
        style={{
          opacity,
          width: 64,
          height: 64,
          backgroundColor: "red",
          borderRadius: 6,
        }}
      />
      <Paragraph
        color="light"
        style={{
          width: 64,
          overflow: "hidden",
          textOverflow: "ellipsis",
          textAlign: "center",
          marginTop: 4,
        }}
      >
        {name}
      </Paragraph>
    </div>
  );
};
