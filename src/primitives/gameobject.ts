import type {
  RigidBodyAutoCollider,
  RigidBodyTypeString,
} from "@react-three/rapier/dist/declarations/src";
import { nanoid } from "nanoid";

import { Q } from "./quaternion";
import { V3 } from "./vector3";

export const makeDummyGameObject = (): GameObject => {
  return {
    id: nanoid(),
    name: "Unnamed GameObject",
    position: new V3(),
    rotation: new Q(),
    physics: {
      enabled: false,
      collider: { type: "cuboid", sizes: new V3(1, 1, 1) },
      rigidbody: { type: "dynamic" },
    },
    rendering: { enabled: false, model: { type: "cube" } },
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
  };
}

interface RenderingSettings extends ExtendableModule {
  model: GameModel;
}

export interface GameObject {
  id: string;
  name: string;
  position: V3;
  rotation: Q;
  rendering: RenderingSettings;
  physics: PhysicsSettings;
}
