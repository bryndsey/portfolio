import { Plane, shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Color } from "three";

const BlobShaderMaterial = shaderMaterial(
  { uTime: 0, uBlobbiness: 1, color: new Color("green") },
  `
  varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
  uniform float time;
    uniform float uTime;
    uniform float uBlobbiness;
    uniform vec3 color;
    varying vec2 vUv;
    void main() {
      vec2 wavedUv = vec2(
        vUv.x + sin(vUv.y * 2.9 + uTime) * 0.05 * uBlobbiness,
        vUv.y + sin(vUv.x * 5.1 + uTime) * 0.05 * uBlobbiness
      );
      float strength = step(0.4, distance(wavedUv, vec2(0.5)));
      gl_FragColor.rgba = vec4(color.xyz, (1.0 - strength) * 0.33);
    }
  `
);
extend({ BlobShaderMaterial });
interface BlobProps {
  speed?: number;
  blobbiness?: number;
}
export function Blob(props: BlobProps) {
  const { speed = 1, blobbiness = 0.5 } = props;
  const blobMaterialRef = useRef<BlobShaderMaterial>(null!);

  useEffect(() => {
    blobMaterialRef.current.uBlobbiness = blobbiness;
  }, [blobbiness]);

  useFrame((state, delta) => {
    blobMaterialRef.current.uTime += delta * speed;
  });

  return (
    <Plane>
      <blobShaderMaterial ref={blobMaterialRef} />
    </Plane>
  );
}
