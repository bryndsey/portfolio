import { Html, RoundedBox, useScroll } from "@react-three/drei";
import { useFrame, useThree, Vector3 } from "@react-three/fiber";
import { useRef } from "react";
import { useControls, types } from "theatric";
import { Color, Euler, Group, MathUtils } from "three";
import { ScreenContent } from "./ScreenContent";

interface DeviceScreenProps {
  width: number;
  height: number;
  bezelSize: number;
  position: Vector3;
  resolutionScale?: number;
}

const DeviceScreen = (props: DeviceScreenProps) => {
  const { gl } = useThree();
  const { width, height, bezelSize, position, resolutionScale } = props;
  const scaleFactor = resolutionScale === undefined ? 1 : resolutionScale;
  return (
    <Html
      transform
      occlude
      portal={{ current: gl.domElement.parentNode }}
      distanceFactor={1 / scaleFactor}
      position={position}
      style={{
        background: "black",
        margin: 0,
        padding: 0,
        borderRadius: 8 * scaleFactor,
        width: (400 * width - bezelSize) * scaleFactor,
        height: (400 * height - bezelSize) * scaleFactor,
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
      args={[props.width, props.height, props.thickness]}
      radius={0.033}
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
        position={[0, 0.01, props.thickness / 2 + 0.001]}
        resolutionScale={1}
      />
    </RoundedBox>
  );
}

const startPosition = { x: -1, y: -2, z: -3 };
const startRotation = { x: -0.5 * Math.PI, y: 0, z: 0.66 };
const deviceSize = { width: 1, height: 2, thickness: 0.1 };
const deviceBezelSize = 32;

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

  const groupRef = useRef<Group>(null);

  const scrollData = useScroll();
  useFrame(() => {
    const deviceGroup = groupRef.current;
    if (deviceGroup === null) return;
    const scrollRange = scrollData.range(0, 2 / 3);
    const currentRotation = {
      x: MathUtils.lerp(rotation.x, 0, scrollRange),
      y: MathUtils.lerp(rotation.y, 0, scrollRange),
      z: MathUtils.lerp(rotation.z, 0, scrollRange),
    };
    deviceGroup.setRotationFromEuler(
      new Euler(currentRotation.x, currentRotation.y, currentRotation.z)
    );
    deviceGroup.position.setX(MathUtils.lerp(position.x, 0, scrollRange));
    deviceGroup.position.setY(MathUtils.lerp(position.y, 0, scrollRange));
    deviceGroup.position.setZ(MathUtils.lerp(position.z, 0.5, scrollRange));
  });

  return (
    <group ref={groupRef}>
      <DeviceObject {...size} bezelSize={bezelSize}></DeviceObject>
    </group>
  );
};
