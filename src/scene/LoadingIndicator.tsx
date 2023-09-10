import { Html } from "@react-three/drei";
import { useEffect } from "react";
import { useLoadingState } from "../hooks/useLoadingState";
import { animated as animatedDom, useSpringValue } from "@react-spring/web";
import { easings } from "@react-spring/web";

export function LoadingIndicator() {
  const { loadingTransistionValue } = useLoadingState();
  const initialAnimationValue = useSpringValue(0, {
    config: { duration: 450, easing: easings.easeOutBack },
  });

  useEffect(() => {
    initialAnimationValue.start(1);
  }, []);
  return (
    <Html fullscreen className="h-screen flex place-content-center">
      <animatedDom.div
        className="font-handwritten text-4xl m-auto text-center"
        style={{
          scale: loadingTransistionValue.to((value) =>
            easings.easeOutBack(1 - Math.min(1, value * 2))
          ),
        }}
      >
        <animatedDom.div
          style={{
            scale: initialAnimationValue,
          }}
        >
          Loading . . .
        </animatedDom.div>
      </animatedDom.div>
    </Html>
  );
}
