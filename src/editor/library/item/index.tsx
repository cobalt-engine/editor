import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Cube } from "phosphor-react";
import { CSSProperties, useId } from "react";
import { useDrag } from "react-dnd";
import { Vector3 } from "three";

import { Paragraph } from "../../../componenets/typography/paragraph";
import { GLBModel } from "../../renderer/glb-model";

interface Props {
  name: string;
  src: string;
  style?: CSSProperties;
}

const LookAtModel = () => {
  useThree(({ camera }) => {
    camera.lookAt(new Vector3());
  });

  return null;
};

export const LibraryItem = ({ style, name, src }: Props) => {
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
    <div style={{ ...style, display: "flex", flexDirection: "column" }}>
      <div
        ref={dragRef}
        style={{
          width: 64,
          height: 64,
          position: "relative",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <Canvas
          frameloop="demand"
          dpr={[0.75, 1]}
          style={{
            position: "absolute",
            opacity,
            width: 64,
            height: 64,
            backgroundColor: "white",
          }}
        >
          <LookAtModel />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <PerspectiveCamera position={[0, 6, 0]} makeDefault />
          <GLBModel src={src} />
        </Canvas>
        <div
          style={{
            backgroundColor: "var(--light-100)",
            position: "absolute",
            bottom: 4,
            right: 4,
            width: 12,
            height: 12,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Cube weight="fill" size={8} color="var(--dark-100)" />
        </div>
      </div>
      <Paragraph
        color="light"
        style={{
          width: 64,
          overflow: "hidden",
          textOverflow: "ellipsis",
          textAlign: "center",
          marginTop: 4,
          maxLines: 1,
        }}
      >
        {name}
      </Paragraph>
    </div>
  );
};
