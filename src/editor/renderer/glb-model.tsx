import { useGLTF } from "@react-three/drei";
import { Suspense, useMemo } from "react";

interface Props {
  src: string;
  castShadows?: boolean;
  recieveShadows?: boolean;
}

export const GLBModel = ({ src, castShadows, recieveShadows }: Props) => {
  // useEffect(() => gltf.scene.traverse((x) => x.castShadow), [castShadows]);

  const gltf = useGLTF(src);
  const copy = useMemo(() => gltf.scene.clone(true), [gltf]);

  return (
    <Suspense fallback={null}>
      <group
        dispose={null}
        castShadow={castShadows}
        receiveShadow={recieveShadows}
      >
        <primitive object={copy} />
      </group>
    </Suspense>
  );
};
