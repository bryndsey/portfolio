import { useThree } from "@react-three/fiber";
import { N8AOPostPass } from "n8ao";
import { forwardRef, useMemo } from "react";
import { useGpuSettings } from "../GpuDetection";

export const AO = forwardRef((_, ref) => {
  const gpuSettings = useGpuSettings();
  const qualityMode =
    gpuSettings === null ||
    gpuSettings.tier <= 1 ||
    (gpuSettings.type === "mobile" && gpuSettings.tier === 2)
      ? "Performance"
      : gpuSettings.type === "mobile" ||
        (gpuSettings.type === "desktop" && gpuSettings.tier === 2)
      ? "Low"
      : "Medium";
  const three = useThree();
  const effect = useMemo(() => {
    const aoEffect = new N8AOPostPass(three.scene, three.camera);
    aoEffect.configuration.aoRadius = 0.5;
    aoEffect.configuration.distanceFalloff = 1;
    aoEffect.configuration.intensity = 6;
    aoEffect.configuration.halfRes = true;
    aoEffect.configuration.depthAwareUpsampling = true;
    aoEffect.setQualityMode(qualityMode);
    return aoEffect;
  }, [three.scene, three.camera, qualityMode]);
  return <primitive ref={ref} object={effect} dispose={null} />;
});

AO.displayName = "AO";
