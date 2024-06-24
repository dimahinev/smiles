"use client";

import { useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import {
  Physics,
  RigidBody,
  BallCollider,
  CuboidCollider,
} from "@react-three/rapier";

export default function App({ shapes = ["heart", "blink", "blush", "laugh"] }) {
  return (
    <Canvas shadows orthographic camera={{ position: [0, 0, 10], zoom: 180 }}>
      <ambientLight intensity={Math.PI} />
      <spotLight decay={0} position={[5, 10, 2.5]} angle={0.2} castShadow />
      <Physics>
        {Array.from({ length: 100 }, (v, i) => (
          <Smiley
            key={i}
            which={shapes[i % shapes.length]}
            position={[Math.random(), 10 + Math.random() * 10, 0]}
          />
        ))}
        <Walls />
      </Physics>
      <Environment>
        <Lightformer
          form="rect"
          intensity={4}
          position={[15, 10, 10]}
          scale={20}
          onCreated={(self) => self.lookAt(0, 0, 0)}
        />
        <Lightformer
          intensity={2}
          position={[-10, 0, -20]}
          scale={[10, 100, 1]}
          onCreated={(self) => self.lookAt(0, 0, 0)}
        />
      </Environment>
    </Canvas>
  );
}

export function Smiley({ which, ...props }) {
  const api = useRef();
  const { nodes, materials } = useGLTF("/smileys-transformed.glb");
  return (
    <RigidBody
      colliders={false}
      ref={api}
      // uncomment next line to lock rotations to Z
      // enabledRotations={[false, false, true]}
      enabledTranslations={[true, true, false]}
      linearDamping={0.2}
      angularDamping={1}
      restitution={0.5}
      {...props}
    >
      <BallCollider args={[0.255]} />
      <mesh
        castShadow
        receiveShadow
        onClick={() => {
          api.current.applyImpulse({ x: 0, y: 0.7, z: 0 }, true);
          api.current.applyTorqueImpulse(
            {
              x: Math.random() * 10,
              y: Math.random() * 10,
              z: Math.random() * 10,
            },
            true
          );
        }}
        geometry={nodes[which].geometry}
        material={materials.PaletteMaterial001}
        material-roughness={0}
        material-toneMapped={false}
        scale={[0.5, 0.5, 0.5]}
      />
    </RigidBody>
  );
}

function Walls() {
  const { width, height } = useThree((state) => state.viewport);
  return (
    <>
      {/* <CuboidCollider position={[0, height / 2 + 1, 0]} args={[width / 2, 1, 1]} /> */}
      <CuboidCollider
        position={[0, -height / 2 - 1, 0]}
        args={[width / 2, 1, 1]}
      />
      <CuboidCollider
        position={[-width / 2 - 1, 0, 0]}
        args={[1, height * 10, 10]}
      />
      <CuboidCollider
        position={[width / 2 + 1, 0, 0]}
        args={[1, height * 10, 1]}
      />
    </>
  );
}
