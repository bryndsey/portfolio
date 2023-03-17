import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";
import Avatar from "./avatar.glb?url";

export function AvatarModel() {
  const gltf = useGLTF(Avatar);
  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} />
    </Suspense>
  );
}

useGLTF.preload(Avatar);
