import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";

export function Guitar() {
  const gltf = useGLTF("/assets/guitar.gltf");
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
}
