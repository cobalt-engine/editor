import { useGLTF } from "@react-three/drei";
import { Suspense } from "react";

interface Props {
  src: string;
}

export const GLBModel = ({ src }: Props) => {
  const gltf = useGLTF(src);
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
};
