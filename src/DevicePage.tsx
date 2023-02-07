import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { types, useControls } from "theatric";
import { Group } from "three";
import { Device } from "./Device";
import { devicePageIndex, pageCount } from "./App";

const deviceStartPosition = { x: -0.5, y: 0, z: 0 };
const deviceStartRotation = { x: -0.5 * Math.PI, y: 0, z: 0.66 };
const deviceSize = { width: 0.15, height: 0.3, thickness: 0.02 };
const deviceBezelSize = 64;

const DeviceContainer = () => {
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

  const [isSelected, setIsSelected] = useState(false);

  // const rotation = startRotation;
  // const size = deviceSize;
  // const bezelSize = deviceBezelSize;
  // const groupRef = useRef<Group>(null);
  // const scrollData = useScroll();
  // useFrame(() => {
  //   const deviceGroup = groupRef.current;
  //   if (deviceGroup === null) return;
  //   const scrollRange = scrollData.range(0, 2 / 3);
  //   const currentRotation = {
  //     x: MathUtils.lerp(rotation.x, 0, scrollRange),
  //     y: MathUtils.lerp(rotation.y, 0, scrollRange),
  //     z: MathUtils.lerp(rotation.z, 0, scrollRange),
  //   };
  //   deviceGroup.setRotationFromEuler(
  //     new Euler(currentRotation.x, currentRotation.y, currentRotation.z)
  //   );
  //   deviceGroup.position.setX(MathUtils.lerp(position.x, 0, scrollRange));
  //   deviceGroup.position.setY(MathUtils.lerp(position.y, 0, scrollRange));
  //   deviceGroup.position.setZ(MathUtils.lerp(position.z, 0.5, scrollRange));
  // });
  return (
    <group
      // ref={groupRef}
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      onClick={() => {
        // console.log("Clicked group");
        setIsSelected(!isSelected);
      }}
    >
      <Device {...size} bezelSize={bezelSize} isOn={isSelected} />
    </group>
  );
};

export const DevicePage = () => {
  const groupRef = useRef<Group>(null);
  const scrollData = useScroll();

  useFrame((state) => {
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

    const yPercent = enterAmount + exitAmount;

    const viewportHeight = state.viewport.height;
    groupRef.current.position.setY(yPercent * viewportHeight);
  });

  return (
    <group ref={groupRef}>
      <DeviceContainer />
    </group>
  );
};
