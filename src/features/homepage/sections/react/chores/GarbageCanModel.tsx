import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import GarbageCan from "./garbageCan.gltf?url";

export function GarbageCanModel() {
  const gltf = useGLTF(GarbageCan);
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
}
