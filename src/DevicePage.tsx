import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { types, useControls } from "theatric";
import { Euler, Group, MathUtils } from "three";
import { Device } from "./Device";
import { devicePageIndex, pageCount } from "./App";

const deviceStartPosition = { x: -0.5, y: 0, z: 0 };
const deviceStartRotation = { x: -0.5 * Math.PI, y: 0, z: 0.66 };
const deviceSize = { width: 0.15, height: 0.3, thickness: 0.02 };
const deviceBezelSize = 64;

export const DevicePage = () => {
  const groupRef = useRef<Group>(null);
  const innerGroupRef = useRef<Group>(null);
  const scrollData = useScroll();

  const { position, rotation, size, bezelSize } = useControls(
    {
      position: {
        x: types.number(deviceStartPosition.x, { nudgeMultiplier: 0.1 }),
        y: types.number(deviceStartPosition.y, { nudgeMultiplier: 0.1 }),
        z: types.number(deviceStartPosition.z, { nudgeMultiplier: 0.1 }),
      },
      rotation: {
        x: types.number(deviceStartRotation.x, { range: [-Math.PI, Math.PI] }),
        y: types.number(deviceStartRotation.y, { range: [-Math.PI, Math.PI] }),
        z: types.number(deviceStartRotation.z, { range: [-Math.PI, Math.PI] }),
      },
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

    groupRef.current.position.setX(-Math.abs(progress) * state.viewport.width);

    const currentRotation = {
      x: MathUtils.lerp(0, rotation.x, progress),
      y: MathUtils.lerp(0, rotation.y, progress),
      z: MathUtils.lerp(0, rotation.z, progress),
    };
    if (innerGroupRef.current === null) return;

    innerGroupRef.current.setRotationFromEuler(
      new Euler(currentRotation.x, currentRotation.y, currentRotation.z)
    );
  });

  return (
    <group ref={groupRef}>
      <group ref={innerGroupRef}>
        <Device {...size} bezelSize={bezelSize} />
      </group>
    </group>
  );
};
