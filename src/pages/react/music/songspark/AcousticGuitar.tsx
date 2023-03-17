import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import Guitar from "./guitar.glb?url";

export function AcousticGuitar() {
  const gltf = useGLTF(Guitar);
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
}

useGLTF.preload(Guitar);
