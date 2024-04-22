import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import CablePlug from "./cablePlug.glb?url";

export function CablePlugModel() {
  const gltf = useGLTF(CablePlug);
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
}
