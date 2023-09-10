import { Float } from "@react-three/drei";
import { Blob } from "./Blob";
import { useLoadingState } from "../hooks/useLoadingState";
import { animated } from "@react-spring/three";
import { easings } from "@react-spring/web";

export function BackgroundBlobs() {
  const { loadingTransistionValue } = useLoadingState();
  return (
    <>
      <animated.group
        position-y={loadingTransistionValue
          .to((value) => easings.easeOutExpo(value))
          .to([0, 1], [3, 0])}
      >
        <Float floatIntensity={0.5} speed={0.66} rotationIntensity={0.5}>
          <group position={[2.66, 1, -5.5]}>
            <Blob
              speed={0.2}
              blobbiness={1}
              size={1.5}
              color={"#16a34a"}
              opacity={0.15}
            />
          </group>
        </Float>
      </animated.group>
      <animated.group
        position-y={loadingTransistionValue
          .to((value) => easings.easeOutCirc(value))
          .to([0, 1], [3, 0])}
      >
        <Float floatIntensity={0.5} speed={0.66} rotationIntensity={0.5}>
          <group position={[-2.5, 2.5, -6]}>
            <Blob
              speed={0.2}
              blobbiness={1.2}
              size={3}
              color={"#16a34a"}
              opacity={0.15}
            />
          </group>
        </Float>
      </animated.group>
      <animated.group
        position-y={loadingTransistionValue
          .to((value) => easings.easeOutSine(value))
          .to([0, 1], [-3, 0])}
      >
        <Float floatIntensity={0.5} speed={0.5} rotationIntensity={0.5}>
          <group position={[-0.5, -3.5, -5]}>
            <Blob
              speed={0.2}
              blobbiness={1.1}
              size={6.5}
              color={"#16a34a"}
              opacity={0.15}
            />
          </group>
        </Float>
      </animated.group>
    </>
  );
}
