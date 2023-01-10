import {
  Box,
  Grid,
  OrbitControls,
  PerformanceMonitor,
  PerspectiveCamera,
  TransformControls,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { Debug, Physics, RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useMemo } from "react";
import { Euler, Vector3 } from "three";

import { GameObject } from "../../primitives/gameobject";
import { V3 } from "../../primitives/vector3";
import { useAppStore } from "../../stores/app";
import { TransformationMode, useSceneStore } from "../../stores/scene";
import cameraModel from "./camera.glb";
import { GLBModel } from "./glb-model";
import lampModel from "./lamp.glb";
import sunModel from "./sun.glb";

const Controls = () => {
  const selectedObject = useSceneStore((state) => state.selectedObject);
  const moveObject = useSceneStore((state) => state.moveObject);
  const rotateObject = useSceneStore((state) => state.rotateObject);
  const scaleObject = useSceneStore((state) => state.scaleObject);
  const scene = useThree((state) => state.scene);
  const transformationMode = useSceneStore((state) => state.transformationMode);

  return (
    <>
      {selectedObject && (
        <TransformControls
          onObjectChange={() => {
            const threeObject = scene.getObjectByName(selectedObject.id);
            if (threeObject) {
              if (transformationMode === TransformationMode.Translate)
                moveObject(
                  selectedObject,
                  new V3(
                    threeObject.position.x,
                    threeObject.position.y,
                    threeObject.position.z
                  )
                );
              if (transformationMode === TransformationMode.Rotate)
                rotateObject(
                  selectedObject,
                  new V3(
                    threeObject.rotation.x,
                    threeObject.rotation.y,
                    threeObject.rotation.z
                  )
                );
              if (transformationMode === TransformationMode.Scale)
                scaleObject(
                  selectedObject,
                  new V3(
                    threeObject.scale.x,
                    threeObject.scale.y,
                    threeObject.scale.z
                  )
                );
            }
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
  const isInPlayMode = useAppStore((state) => state.isInPlayMode);
  const is3dIconsVisible = useAppStore((state) => state.is3dIconsVisible);

  return (
    <group
      name={isPhysic ? undefined : gameObject.id}
      key={gameObject.id}
      position={
        isPhysic
          ? undefined
          : new Vector3(
              gameObject.transform.position.x,
              gameObject.transform.position.y,
              gameObject.transform.position.z
            )
      }
      scale={
        isPhysic
          ? undefined
          : new Vector3(
              gameObject.transform.scale.x,
              gameObject.transform.scale.y,
              gameObject.transform.scale.z
            )
      }
      rotation={
        isPhysic
          ? undefined
          : new Euler(
              gameObject.transform.rotation.x,
              gameObject.transform.rotation.y,
              gameObject.transform.rotation.z
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
      {gameObject.camera.enabled && (
        <>
          {gameObject.camera.type === "perspective" && (
            <PerspectiveCamera
              makeDefault={gameObject.camera.isDefault}
              fov={gameObject.camera.fov}
            />
          )}
        </>
      )}
      {gameObject.fog.enabled && (
        <fog
          attach="fog"
          args={[gameObject.fog.color, gameObject.fog.near, gameObject.fog.far]}
        />
      )}
      {gameObject.light.enabled && (
        <>
          {gameObject.light.type === "area" && (
            <rectAreaLight
              intensity={gameObject.light.intensity}
              color={gameObject.light.color}
              castShadow={gameObject.light.castShadows}
            />
          )}
          {gameObject.light.type === "spot" && (
            <>
              {is3dIconsVisible && !isInPlayMode && (
                <group scale={1} position={[0, -2, 0]}>
                  <GLBModel
                    src={lampModel}
                    recieveShadows={false}
                    castShadows={false}
                  />
                </group>
              )}
              <spotLight
                intensity={gameObject.light.intensity}
                color={gameObject.light.color}
                castShadow={gameObject.light.castShadows}
              />
            </>
          )}
          {gameObject.light.type === "point" && (
            <pointLight
              intensity={gameObject.light.intensity}
              color={gameObject.light.color}
              castShadow={gameObject.light.castShadows}
            />
          )}
          {gameObject.light.type === "directional" && (
            <>
              {is3dIconsVisible && !isInPlayMode && (
                <group scale={5}>
                  <GLBModel
                    src={sunModel}
                    recieveShadows={false}
                    castShadows={false}
                  />
                </group>
              )}
              <directionalLight
                intensity={gameObject.light.intensity}
                color={gameObject.light.color}
                castShadow={gameObject.light.castShadows}
              />
            </>
          )}
        </>
      )}
      {is3dIconsVisible && !isInPlayMode && gameObject.camera.enabled && (
        <>
          <group scale={0.1}>
            <GLBModel
              src={cameraModel}
              recieveShadows={false}
              castShadows={false}
            />
          </group>
        </>
      )}
      {gameObject.rendering.enabled &&
        gameObject.rendering.model.type === "cube" && (
          <Box
            castShadow={gameObject.rendering.castShadows}
            receiveShadow={gameObject.rendering.recieveShadows}
          >
            <meshStandardMaterial />
          </Box>
        )}
      {gameObject.rendering.enabled &&
        gameObject.rendering.model.type === "glb" && (
          <GLBModel
            src={gameObject.rendering.model.src}
            castShadows={gameObject.rendering.castShadows}
            recieveShadows={gameObject.rendering.recieveShadows}
          />
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

const SyncStep = () => {
  const { isPaused } = useRapier();
  const increaseTick = useSceneStore((state) => state.increaseTick);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) increaseTick();
    }, 16);
    return () => clearInterval(interval);
  }, [isPaused]);

  return null;
};

export const Editor = () => {
  const scene = useSceneStore((state) => state.objects);
  const selectedObject = useSceneStore((state) => state.selectedObject);
  const setTransformationMode = useSceneStore(
    (state) => state.setTransformationMode
  );
  const isInPlayMode = useAppStore((state) => state.isInPlayMode);
  const physicsDebug = useAppStore((state) => state.physicsDebug);
  const setFps = useAppStore((state) => state.setFps);

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
      <Canvas shadows dpr={[1, 2]}>
        <PerformanceMonitor onChange={({ fps }) => setFps(fps)} />
        {!isInPlayMode && <Controls />}
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
          <SyncStep />
          {physicBodies.map((gameObject) => (
            <RigidBody
              name={gameObject.id}
              position={
                new Vector3(
                  gameObject.transform.position.x,
                  gameObject.transform.position.y,
                  gameObject.transform.position.z
                )
              }
              scale={
                new Vector3(
                  gameObject.transform.scale.x,
                  gameObject.transform.scale.y,
                  gameObject.transform.scale.z
                )
              }
              rotation={
                new Euler(
                  gameObject.transform.rotation.x,
                  gameObject.transform.rotation.y,
                  gameObject.transform.rotation.z
                )
              }
              key={gameObject.id}
              colliders={gameObject.physics.collider.type}
              type={gameObject.physics.rigidbody.type}
              sensor={gameObject.physics.rigidbody.sensor}
              args={[
                gameObject.physics.collider.sizes.x,
                gameObject.physics.collider.sizes.y,
                gameObject.physics.collider.sizes.z,
              ]}
            >
              <BasicBody isPhysic gameObject={gameObject} />
            </RigidBody>
          ))}

          {physicsDebug && <Debug />}
        </Physics>

        {/* <EffectComposer>
          { <DepthOfField
            focusDistance={0}
            focalLength={0.02}
            bokehScale={2}
            height={480}
          />}
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
          <Noise opacity={0.02} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer> */}
      </Canvas>
    </div>
  );
};
