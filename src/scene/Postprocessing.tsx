import { AO } from "@/ao";
import { useGpuSettings } from "@/gpuDetection";
import { EffectComposer } from "@react-three/postprocessing";

export function Postprocessing() {
  const gpuSettings = useGpuSettings();
  const showPostprocessing = gpuSettings !== null && gpuSettings.tier > 1;

  return (
    <EffectComposer disableNormalPass enabled={true}>
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
