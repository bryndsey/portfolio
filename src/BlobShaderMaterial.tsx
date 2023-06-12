import { shaderMaterial } from "@react-three/drei";
import { MaterialNode, extend } from "@react-three/fiber";
import { Color } from "three";

export const BlobShaderMaterial = shaderMaterial(
  { uTime: 0, uBlobbiness: 1, color: new Color("green"), uOpacity: 1 },
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
    uniform float uOpacity;
    varying vec2 vUv;
    void main() {
      vec2 wavedUv = vec2(
        vUv.x + sin(vUv.y * 2.9 + uTime) * 0.05 * uBlobbiness,
        vUv.y + sin(vUv.x * 5.1 + uTime) * 0.05 * uBlobbiness
      );
      float strength = step(0.4, distance(wavedUv, vec2(0.5)));
      gl_FragColor.rgba = vec4(color.xyz, (1.0 - strength) * uOpacity);
    }
  `
);
extend({ BlobShaderMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    blobShaderMaterial: MaterialNode<
      BlobShaderMaterial,
      typeof BlobShaderMaterial
    >;
  }
}
