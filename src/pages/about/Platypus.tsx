import HDRI from "@assets/empty_warehouse_01_1k.hdr?url";
import {
  CameraControls,
  Environment,
  Float,
  PerspectiveCamera,
  Preload,
  View,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useRef } from "react";
import PlatypusGlb from "./platypus.glb?url";

function PlatypusModel() {
  const gltf = useGLTF(PlatypusGlb);
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
}

useGLTF.preload(PlatypusGlb);

interface PlatypusProps {
  className?: string;
}

export function Platypus({ className }: PlatypusProps) {
  return (
    <View className={className}>
      <ThreejsContent />
    </View>
  );
}

function ThreejsContent() {
  const cameraRef = useRef<CameraControls>(null);

  return (
    <Suspense fallback={null}>
      <Environment files={HDRI} />
      <Preload all />
      <PerspectiveCamera makeDefault position={[2, 2, 2.75]} />
      <CameraControls
        ref={cameraRef}
        distance={2.5}
        dollySpeed={0}
        maxPolarAngle={1.75}
      />
      <Float speed={2} floatIntensity={0.25} scale={4}>
        <PlatypusModel />
      </Float>
    </Suspense>
  );
}
