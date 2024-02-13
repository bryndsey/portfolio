import React, { forwardRef, useMemo } from "react";
import { N8AOPostPass } from "n8ao";
import { useThree } from "@react-three/fiber";

export const AO = forwardRef((_, ref) => {
  const three = useThree();
  const effect = useMemo(() => {
    const aoEffect = new N8AOPostPass(three.scene, three.camera);
    aoEffect.configuration.aoRadius = 0.5;
    aoEffect.configuration.distanceFalloff = 1;
    aoEffect.configuration.intensity = 6;
    aoEffect.configuration.halfRes = true;
    aoEffect.configuration.depthAwareUpsampling = true;
    return aoEffect;
  }, [three]);
  return <primitive ref={ref} object={effect} dispose={null} />;
});

AO.displayName = "AO";
