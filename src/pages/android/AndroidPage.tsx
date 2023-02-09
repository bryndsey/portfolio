import { useRef } from "react";
import { Euler, Group, MathUtils } from "three";
import { PageComponentProps } from "../Pages";
import { useScrollPages } from "../useScrollPages";
import { Device } from "./Device";

const deviceSize = { width: 0.15, height: 0.3, thickness: 0.02 };
const deviceBezelSize = 64;

export const AndroidPage = (props: PageComponentProps) => {
  const groupRef = useRef<Group>(null);
  const innerGroupRef = useRef<Group>(null);

  useScrollPages(
    props.startPageIndex,
    props.exitPageIndex,
    (enterAmount, exitAmount, state, delta) => {
      if (groupRef.current === null) return;

      const progress = enterAmount + exitAmount;

      const position = MathUtils.lerp(
        -state.viewport.width / 6,
        -state.viewport.width,
        Math.abs(progress)
      );
      groupRef.current.position.setX(position);

      const currentRotation = MathUtils.lerp(
        0.2,
        Math.PI * 2,
        Math.abs(progress)
      );

      if (innerGroupRef.current === null) return;

      innerGroupRef.current.setRotationFromEuler(
        new Euler(0, currentRotation, 0)
      );
    }
  );

  return (
    <group ref={groupRef}>
      <group ref={innerGroupRef} scale={4}>
        <Device {...deviceSize} bezelSize={deviceBezelSize} />
      </group>
    </group>
  );
};
