import { Suspense } from "react";
import D20Glb from "./d20.glb?url";
import { useGLTF } from "@react-three/drei";

export function D20Model() {
  const gltf = useGLTF(D20Glb);
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
}

useGLTF.preload(D20Glb);
