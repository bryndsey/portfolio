import { Html, RoundedBox } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import { useRef } from "react";
import { types, useControls } from "theatric";
import { Color, Group } from "three";
import { ScreenContent } from "./ScreenContent";

interface DeviceScreenProps {
  width: number;
  height: number;
  bezelSize: number;
  position: Vector3;
  resolutionScale?: number;
}

const DeviceScreen = (props: DeviceScreenProps) => {
  const { width, height, bezelSize, position, resolutionScale } = props;
  const scaleFactor = resolutionScale === undefined ? 1 : resolutionScale;
  return (
    <Html
      transform
      occlude
      distanceFactor={1 / scaleFactor}
      position={position}
      style={{
        background: "black",
        margin: 0,
        padding: 0,
        borderRadius: 16 * (scaleFactor / 10),
        width: 400 * width * scaleFactor - bezelSize * (scaleFactor / 10),
        height: 400 * height * scaleFactor - bezelSize * (scaleFactor / 10),
        overflow: "scroll",
      }}
    >
      <ScreenContent />
    </Html>
  );
};

interface DeviceObjectProps {
  width: number;
  height: number;
  thickness: number;
  bezelSize: number;
}

function DeviceObject(props: DeviceObjectProps) {
  return (
    <RoundedBox
      onClick={() => {
        console.log("Clicked Device");
      }}
      args={[props.width, props.height, props.thickness]}
      radius={0.01}
      smoothness={12}
    >
      <meshStandardMaterial
        color={new Color(0.05, 0.06, 0.052)}
        roughness={0.5}
      />
      <DeviceScreen
        width={props.width}
        height={props.height}
        bezelSize={props.bezelSize}
        position={[0, 0, props.thickness / 2 + 0.001]}
        resolutionScale={7.5}
      />
    </RoundedBox>
  );
}

const startPosition = { x: -0.5, y: -0.5, z: 0 };
const startRotation = { x: -0.5 * Math.PI, y: 0, z: 0.66 };
const deviceSize = { width: 0.15, height: 0.3, thickness: 0.02 };
const deviceBezelSize = 64;

export const Device = () => {
  const { position, rotation, size, bezelSize } = useControls(
    {
      position: {
        x: types.number(startPosition.x, { nudgeMultiplier: 0.1 }),
        y: types.number(startPosition.y, { nudgeMultiplier: 0.1 }),
        z: types.number(startPosition.z, { nudgeMultiplier: 0.1 }),
      },
      rotation: {
        x: types.number(startRotation.x, { range: [-Math.PI, Math.PI] }),
        y: types.number(startRotation.y, { range: [-Math.PI, Math.PI] }),
        z: types.number(startRotation.z, { range: [-Math.PI, Math.PI] }),
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

  // const rotation = startRotation;
  // const size = deviceSize;
  // const bezelSize = deviceBezelSize;

  const groupRef = useRef<Group>(null);

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
      ref={groupRef}
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      onClick={() => {
        console.log("Clicked group");
      }}
      onPointerMissed={() => console.log("Clicked outside group")}
    >
      <DeviceObject {...size} bezelSize={bezelSize} />
    </group>
  );
};
