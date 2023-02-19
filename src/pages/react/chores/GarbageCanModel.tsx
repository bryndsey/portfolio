import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";

export function GarbageCanModel() {
  const gltf = useGLTF("/assets/garbageCan.gltf");
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
}
