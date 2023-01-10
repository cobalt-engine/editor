import type {
  RigidBodyAutoCollider,
  RigidBodyTypeString,
} from "@react-three/rapier/dist/declarations/src";
import { nanoid } from "nanoid";

import { V3 } from "./vector3";

export const makeDummyGameObject = (): GameObject => {
  return {
    id: nanoid(),
    name: "Игровой объект",
    physics: {
      enabled: false,
      collider: { type: "cuboid", sizes: new V3(1, 1, 1) },
      rigidbody: { type: "dynamic", sensor: false },
    },
    rendering: {
      enabled: false,
      model: { type: "cube" },
      castShadows: true,
      recieveShadows: true,
    },
    networking: { enabled: false, type: "udp", syncTransform: false },
    transform: {
      enabled: true,
      position: new V3(),
      rotation: new V3(),
      scale: new V3(1, 1, 1),
    },
    light: {
      enabled: false,
      type: "point",
      intensity: 1,
      color: "#ffffff",
      castShadows: true,
    },
    camera: { enabled: false, type: "perspective", fov: 75, isDefault: false },
    fog: { enabled: false, color: "#000000", near: 15, far: 21.5 },
    postprocessing: {
      enabled: true,
      dof: {
        enabled: false,
        focusDistance: 0,
        focalLength: 0.02,
        bokehScale: 2,
        height: 480,
      },
    },
  };
};

interface DefaultCube {
  type: "cube";
}

interface GlbModel {
  type: "glb";
  src: string;
}

export type GameModel = DefaultCube | GlbModel;

interface ExtendableModule {
  enabled: boolean;
}

interface PhysicsSettings extends ExtendableModule {
  collider: { type: RigidBodyAutoCollider; sizes: V3 };
  rigidbody: {
    type: RigidBodyTypeString;
    sensor: boolean;
  };
}

interface RenderingSettings extends ExtendableModule {
  model: GameModel;
  castShadows: boolean;
  recieveShadows: boolean;
}

interface NetworkingSettings extends ExtendableModule {
  syncTransform: boolean;
  type: "tcp" | "udp";
}

interface TransformSettings extends ExtendableModule {
  position: V3;
  scale: V3;
  rotation: V3;
}

interface LightSettings extends ExtendableModule {
  type: "spot" | "point" | "directional" | "area";
  intensity: number;
  color: string;
  castShadows: boolean;
}

interface CameraSettings extends ExtendableModule {
  type: "perspective" | "orthographic";
  fov: number;
  isDefault: boolean;
}

interface FogSettings extends ExtendableModule {
  near: number;
  far: number;
  color: string;
}

interface DofSettings extends ExtendableModule {
  focusDistance: number;
  focalLength: number;
  bokehScale: number;
  height: number;
}

interface PostprocessingSettings extends ExtendableModule {
  dof: DofSettings;
}

export interface GameObject {
  id: string;
  name: string;
  transform: TransformSettings;
  rendering: RenderingSettings;
  physics: PhysicsSettings;
  networking: NetworkingSettings;
  light: LightSettings;
  camera: CameraSettings;
  fog: FogSettings;
  postprocessing: PostprocessingSettings;
}
