import { config, useSpringValue } from "@react-spring/web";

export const useSpringScaleVisibility = () => {
  const visibilitySpring = useSpringValue(0);

  const setVisibility = (shouldBeVisible: boolean) => {
    // If already targeting the inteded state, don't change anything
    const visibilitySpringTarget = shouldBeVisible ? 1 : 0;
    if (visibilitySpring.goal != visibilitySpringTarget) {
      const currentConfig =
        visibilitySpringTarget === 1 ? config.wobbly : { duration: 120 };
      visibilitySpring.start(visibilitySpringTarget, {
        config: currentConfig,
      });
    }
  };

  return { springValue: visibilitySpring, setVisibility: setVisibility };
};
