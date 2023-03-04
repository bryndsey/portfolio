import { Html, RoundedBox } from "@react-three/drei";
import { useThree, Vector3 } from "@react-three/fiber";
import { Color } from "three";
import { useHtmlPortal } from "../../useHtmlPortal";
import { PhoneModel } from "./PhoneModel";
import { ScreenContent } from "./ScreenContent";

interface DeviceScreenProps {
  width: number;
  height: number;
  position: Vector3;
  resolutionScale?: number;
  isOn?: boolean;
}

const DeviceScreen = (props: DeviceScreenProps) => {
  const { width, height, position, resolutionScale, isOn = true } = props;
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
            overflow: "hidden",
            borderRadius: 10 * scaleFactor,
            width: 400 * width * scaleFactor,
            height: 400 * height * scaleFactor,
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

const resolutionThresholdSize = 640;

interface DeviceProps {
  isOn?: boolean;
}

export function Device(props: DeviceProps) {
  const size = useThree((state) => state.size);
  const useSmallResolution =
    Math.min(size.height, size.width) < resolutionThresholdSize;
  const resolutionScale = useSmallResolution ? 3 : 3.5;

  const { isOn } = props;
  return (
    <>
      <PhoneModel scale={5} />
      <DeviceScreen
        width={0.335}
        height={0.745}
        position={[0, 0, 0.02]}
        resolutionScale={resolutionScale}
        isOn={isOn}
      />
    </>
  );
}
