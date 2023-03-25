import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import Violin from "./violin.glb?url";

export function ViolinModel() {
  const gltf = useGLTF(Violin);
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
}

useGLTF.preload(Violin);
