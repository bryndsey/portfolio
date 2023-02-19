import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import Pedal from "./pedal.gltf";

export function PedalModel() {
  const gltf = useGLTF(Pedal);
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
}
