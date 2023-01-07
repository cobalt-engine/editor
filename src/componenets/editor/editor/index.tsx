import { Box, Grid, OrbitControls, TransformControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Debug, Physics, RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useMemo } from "react";
import { Vector3 } from "three";

import { GameObject } from "../../../primitives/gameobject";
import { V3 } from "../../../primitives/vector3";
import { useAppStore } from "../../../stores/app";
import { TransformationMode, useSceneStore } from "../../../stores/scene";
import { GLBModel } from "./glb-model";

const Controls = () => {
  const selectedObject = useSceneStore((state) => state.selectedObject);
  const moveObject = useSceneStore((state) => state.moveObject);
  const scene = useThree((state) => state.scene);
  const transformationMode = useSceneStore((state) => state.transformationMode);

  return (
    <>
      {selectedObject && (
        <TransformControls
          onObjectChange={() => {
            const threeObject = scene.getObjectByName(selectedObject.id);
            if (threeObject)
              moveObject(
                selectedObject,
                new V3(
                  threeObject.position.x,
                  threeObject.position.y,
                  threeObject.position.z
                )
              );
          }}
          object={scene.getObjectByName(selectedObject.id)}
          mode={
            transformationMode === TransformationMode.Scale
              ? "scale"
              : transformationMode === TransformationMode.Translate
              ? "translate"
              : "rotate"
          }
        />
      )}
      <OrbitControls makeDefault />
    </>
  );
};

const BasicBody = ({
  gameObject,
  isPhysic = false,
}: {
  gameObject: GameObject;
  isPhysic?: boolean;
}) => {
  const transformationMode = useSceneStore((state) => state.transformationMode);
  const selectObject = useSceneStore((state) => state.selectObject);
  const unselectObject = useSceneStore((state) => state.unselectObject);
  const selectedObject = useSceneStore((state) => state.selectedObject);
  const setTransformationMode = useSceneStore(
    (state) => state.setTransformationMode
  );

  return (
    <group
      name={gameObject.id}
      key={gameObject.id}
      position={
        isPhysic
          ? undefined
          : new Vector3(
              gameObject.position.x,
              gameObject.position.y,
              gameObject.position.z
            )
      }
      onContextMenu={(e) =>
        selectedObject?.id === gameObject.id &&
        (e.stopPropagation(),
        setTransformationMode(
          transformationMode + 1 > 2
            ? TransformationMode.Translate
            : transformationMode + 1
        ))
      }
      onPointerMissed={(e) => e.type === "click" && unselectObject()}
      onClick={(e) => (e.stopPropagation(), selectObject(gameObject))}
    >
      {gameObject.rendering.enabled &&
        gameObject.rendering.model.type === "cube" && <Box />}
      {gameObject.rendering.enabled &&
        gameObject.rendering.model.type === "glb" && (
          <GLBModel src={gameObject.rendering.model.src} />
        )}
    </group>
  );
};

// const SyncPhysicPositions = () => {
//   const { colliderStates } = useRapier();
//   const scene = useSceneStore((state) => state.objects);
//   const moveObject = useSceneStore((state) => state.moveObject);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       for (const { object } of Array.from(colliderStates.values())) {
//         const gameObject = scene.find(({ id }) => id === object.name);
//         if (gameObject)
//           moveObject(
//             gameObject,
//             new V3(object.position.x, object.position.y, object.position.z)
//           );
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [colliderStates]);

//   return null;
// };

export const Editor = () => {
  const scene = useSceneStore((state) => state.objects);
  const selectedObject = useSceneStore((state) => state.selectedObject);
  const setTransformationMode = useSceneStore(
    (state) => state.setTransformationMode
  );
  const isInPlayMode = useAppStore((state) => state.isInPlayMode);
  const physicsDebug = useAppStore((state) => state.physicsDebug);

  useEffect(() => {
    setTransformationMode(TransformationMode.Translate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedObject?.id]);

  const nonPhysicBodies = useMemo(
    () => scene.filter(({ physics }) => !physics.enabled),
    [scene]
  );
  const physicBodies = useMemo(
    () => scene.filter(({ physics }) => physics.enabled),
    [scene]
  );

  return (
    <div style={{ width: "100%", height: "100%", position: "absolute" }}>
      <Canvas>
        <Controls />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {!isInPlayMode && (
          <Grid
            position={[0, -0.01, 0]}
            args={[10.5, 10.5]}
            cellSize={0.6}
            cellThickness={1}
            cellColor="#d7dae0"
            sectionSize={3.3}
            sectionColor="#d0d3d9"
            fadeDistance={25}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid
          />
        )}
        {nonPhysicBodies.map((gameObject) => (
          <BasicBody key={gameObject.id} gameObject={gameObject} />
        ))}

        <Physics paused={!isInPlayMode}>
          {/* <SyncPhysicPositions /> */}
          {physicBodies.map((gameObject) => (
            <RigidBody
              position={
                new Vector3(
                  gameObject.position.x,
                  gameObject.position.y,
                  gameObject.position.z
                )
              }
              key={gameObject.id}
              colliders={gameObject.physics.collider.type}
              type={gameObject.physics.rigidbody.type}
            >
              <BasicBody isPhysic gameObject={gameObject} />
            </RigidBody>
          ))}

          {physicsDebug && <Debug />}
        </Physics>
      </Canvas>
    </div>
  );
};
