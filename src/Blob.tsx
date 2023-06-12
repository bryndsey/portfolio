import { Plane } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { BlobShaderMaterial } from "./BlobShaderMaterial";

interface BlobProps {
  speed?: number;
  blobbiness?: number;
  size?: number;
}

export function Blob(props: BlobProps) {
  const { speed = 1, blobbiness = 0.5, size = 1 } = props;
  const blobMaterialRef = useRef<BlobShaderMaterial>(null!);

  useEffect(() => {
    blobMaterialRef.current.uBlobbiness = blobbiness;
  }, [blobbiness]);

  useFrame((state, delta) => {
    blobMaterialRef.current.uTime += delta * speed;
  });

  return (
    <Plane args={[size, size]}>
      <blobShaderMaterial
        key={BlobShaderMaterial.key}
        ref={blobMaterialRef}
        depthWrite={false}
      />
    </Plane>
  );
}
