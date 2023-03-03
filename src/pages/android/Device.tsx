import { Html, RoundedBox } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import { Color } from "three";
import { useHtmlPortal } from "../../useHtmlPortal";
import { PhoneModel } from "./PhoneModel";
import { ScreenContent } from "./ScreenContent";

interface DeviceScreenProps {
  width: number;
  height: number;
  bezelSize?: number;
  position: Vector3;
  resolutionScale?: number;
  isOn?: boolean;
}

const DeviceScreen = (props: DeviceScreenProps) => {
  const {
    width,
    height,
    bezelSize = 0,
    position,
    resolutionScale,
    isOn = true,
  } = props;
  const scaleFactor = resolutionScale === undefined ? 1 : resolutionScale;

  const htmlPortal = useHtmlPortal();

  return (
    <>
      {isOn && (
        <Html
          transform
          occlude
          portal={{ current: htmlPortal }}
          distanceFactor={1 / scaleFactor}
          position={position}
          style={{
            width: 400 * width * scaleFactor - bezelSize * (scaleFactor / 10),
            height: 400 * height * scaleFactor - bezelSize * (scaleFactor / 10),
          }}
        >
          <ScreenContent />
        </Html>
      )}
      {/* <mesh position={[position[0], position[1], position[2] + 0.001]}>
        <planeGeometry args={[width - 0.02, height - 0.02]} />
        <meshPhysicalMaterial
          // transparent
          thickness={0.005}
          // metalness={1}
          roughness={0}
          transmission={1}
          reflectivity={0.75}
          opacity={0.01}
          color="lightgrey"
        />
      </mesh> */}
    </>
  );
};

interface DeviceProps {
  width: number;
  height: number;
  thickness: number;
  bezelSize: number;
  isOn?: boolean;
}

export function Device(props: DeviceProps) {
  return (
    <>
      <PhoneModel scale={5} />
      <DeviceScreen
        width={0.335}
        height={0.745}
        position={[0, 0, 0.02]}
        resolutionScale={3.5}
        isOn={props.isOn}
      />
    </>
  );
}
