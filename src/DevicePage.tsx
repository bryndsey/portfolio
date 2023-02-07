import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { types, useControls } from "theatric";
import { Euler, Group, MathUtils } from "three";
import { Device } from "./Device";
import { devicePageIndex, pageCount } from "./App";

// const deviceStartPosition = { x: -0.5, y: 0, z: 0 };
// const deviceStartRotation = { x: -0.5 * Math.PI, y: 0, z: 0.66 };
const deviceSize = { width: 0.15, height: 0.3, thickness: 0.02 };
const deviceBezelSize = 64;

export const DevicePage = () => {
  const groupRef = useRef<Group>(null);
  const innerGroupRef = useRef<Group>(null);
  const scrollData = useScroll();

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

  useFrame((state, delta) => {
    if (groupRef.current === null) return;

    const enterAmount =
      scrollData.range(
        (devicePageIndex - 1) / pageCount,
        devicePageIndex / pageCount
      ) - 1;
    const exitAmount = scrollData.range(
      devicePageIndex / pageCount,
      (devicePageIndex + 1) / pageCount
    );

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
  });

  return (
    <group ref={groupRef}>
      <group ref={innerGroupRef} scale={3}>
        <Device {...size} bezelSize={bezelSize} />
      </group>
    </group>
  );
};
