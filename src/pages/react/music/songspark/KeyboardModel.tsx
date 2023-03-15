import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import Keyboard from "./keyboard.gltf?url";

export function KeyboardModel() {
  const gltf = useGLTF(Keyboard);
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
}

useGLTF.preload(Keyboard);
