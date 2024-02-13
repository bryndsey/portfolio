import { AO } from "@/ao";
import { EffectComposer, N8AO } from "@react-three/postprocessing";

export function Postprocessing() {
  return (
    <EffectComposer disableNormalPass>
      {/* <N8AO
        aoRadius={0.5}
        distanceFalloff={0.08}
        intensity={6}
        quality="medium"
        halfRes
        depthAwareUpsampling
      /> */}
      <AO />
    </EffectComposer>
  );
}
