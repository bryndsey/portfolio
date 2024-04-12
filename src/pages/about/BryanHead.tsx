import { Suspense, useRef } from "react";
import {
  CameraControls,
  Environment,
  OrbitControls,
  Preload,
  View,
  useGLTF,
} from "@react-three/drei";
import Head from "./bryan-head.glb?url";
import HDRI from "@assets/empty_warehouse_01_1k.hdr?url";
import { useFrame } from "@react-three/fiber";

function BryanHeadModel() {
  const gltf = useGLTF(Head);
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
}

useGLTF.preload(Head);

interface BryanHeadProps {
  className?: string;
}

export function BryanHead({ className }: BryanHeadProps) {
  return (
    <View className={className}>
      <ThreejsContent />
    </View>
  );
}

function ThreejsContent() {
  const cameraRef = useRef<CameraControls>(null);
  useFrame((_, delta) => {
    cameraRef.current?.rotate(delta / 2, 0);
  });

  return (
    <Suspense fallback={null}>
      <Environment files={HDRI} />
      <Preload all />
      {/* <ambientLight intensity={1} /> */}
      <CameraControls ref={cameraRef} distance={2.75} dollySpeed={0} />
      <group scale={15}>
        <BryanHeadModel />
      </group>
    </Suspense>
  );
}
