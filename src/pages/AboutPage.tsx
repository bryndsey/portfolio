import { Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";
import { PageComponentProps } from "./Pages";
import { useScrollPages } from "./useScrollPages";

export const AboutPage = (props: PageComponentProps) => {
  const viewportWidth = useThree((state) => state.viewport.width);
  const groupRef = useRef<Group>(null);
  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    (enterAmount, exitAmount, state) => {
      if (groupRef.current === null) return;

      const yPercent = enterAmount + exitAmount;

      const viewportHeight = state.viewport.height;
      groupRef.current.position.setY(yPercent * viewportHeight);
    }
  );

  return (
    <group ref={groupRef}>
      <Text fontSize={0.1} maxWidth={viewportWidth * 0.6} lineHeight={1.5}>
        {
          "I'm a React and Android developer.\nI make interactive apps, including tools to make music."
        }
      </Text>
    </group>
  );
};
