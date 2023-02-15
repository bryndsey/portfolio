import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";

export function PedalModel() {
  const gltf = useGLTF("/assets/pedal.gltf");
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
}
