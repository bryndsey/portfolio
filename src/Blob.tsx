import { Plane } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { BlobShaderMaterial } from "./BlobShaderMaterial";
import { ColorRepresentation } from "three";

interface BlobProps {
  speed?: number;
  blobbiness?: number;
  size?: number;
  color?: ColorRepresentation;
  opacity?: number;
}

export function Blob(props: BlobProps) {
  const {
    speed = 1,
    blobbiness = 0.5,
    size = 1,
    color = "green",
    opacity = 1,
  } = props;
  const blobMaterialRef = useRef<BlobShaderMaterial>(null!);

  useFrame((state, delta) => {
    blobMaterialRef.current.uTime += delta * speed;
  });

  return (
    <Plane args={[size, size]}>
      <blobShaderMaterial
        key={BlobShaderMaterial.key}
        ref={blobMaterialRef}
        // depthWrite={false}
        transparent
        color={color}
        uOpacity={opacity}
        uBlobbiness={blobbiness}
      />
    </Plane>
  );
}
