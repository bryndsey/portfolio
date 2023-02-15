import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";

export function CablePlugModel() {
  const gltf = useGLTF("/assets/cablePlug.gltf");
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
}
