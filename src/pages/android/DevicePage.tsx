import { useRef } from "react";
import { types, useControls } from "theatric";
import { Euler, Group, MathUtils } from "three";
import { Device } from "./Device";
import { PageComponentProps } from "../Pages";
import { useScrollPages } from "../useScrollPages";

// const deviceStartPosition = { x: -0.5, y: 0, z: 0 };
// const deviceStartRotation = { x: -0.5 * Math.PI, y: 0, z: 0.66 };
const deviceSize = { width: 0.15, height: 0.3, thickness: 0.02 };
const deviceBezelSize = 64;

export const DevicePage = (props: PageComponentProps) => {
  const groupRef = useRef<Group>(null);
  const innerGroupRef = useRef<Group>(null);

  const { size, bezelSize } = useControls(
    {
      size: {
        width: types.number(deviceSize.width, { nudgeMultiplier: 0.1 }),
        height: types.number(deviceSize.height, { nudgeMultiplier: 0.1 }),
        thickness: types.number(deviceSize.thickness, {
          nudgeMultiplier: 0.01,
        }),
      },
      bezelSize: deviceBezelSize,
    },
    { folder: "device" }
  );

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
        <Device {...size} bezelSize={bezelSize} />
      </group>
    </group>
  );
};
