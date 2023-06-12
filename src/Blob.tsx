import { Plane } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { BlobShaderMaterial, BlobUniforms } from "./BlobShaderMaterial";
import { ColorRepresentation, ShaderMaterial } from "three";

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
  const blobMaterialRef = useRef<
    ShaderMaterial & {
      key: string;
    } & BlobUniforms
  >(null!);

  const offset = useRef(Math.random() * 4);

  useFrame((state, delta) => {
    blobMaterialRef.current.uTime += delta * speed;
  });

  return (
    <Plane args={[size, size]}>
      <blobShaderMaterial
        key={BlobShaderMaterial.key}
        ref={blobMaterialRef}
        transparent
        color={color}
        uOpacity={opacity}
        uBlobbiness={blobbiness}
        offset={offset.current}
      />
    </Plane>
  );
}
