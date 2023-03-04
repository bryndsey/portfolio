import { Center, Html, RoundedBox, Svg, Text } from "@react-three/drei";
import { useThree, Vector3 } from "@react-three/fiber";
import { Color, MeshBasicMaterial } from "three";
import { useHtmlPortal } from "../../useHtmlPortal";
import { PhoneModel } from "./PhoneModel";
import { ScreenContent } from "./ScreenContent";

interface DeviceScreenProps {
  width: number;
  height: number;
  resolutionScale?: number;
  isOn?: boolean;
}

const DeviceScreen = (props: DeviceScreenProps) => {
  const { width, height, resolutionScale, isOn = true } = props;
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

const iconColor = new MeshBasicMaterial();

const LockScreen = () => {
  return (
    <group>
      <Text fontSize={0.02} position-y={0.2} color="white">
        Scroll to unlock
      </Text>
      <Center position-y={-0.2}>
        <Svg
          src={
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='icon icon-tabler icon-tabler-circle-filled' width='24' height='24' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath stroke='none' d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M7 3.34a10 10 0 1 1 -4.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 4.995 -8.336z' stroke-width='0' fill='currentColor' /%3E%3C/svg%3E"
          }
          scale={0.003}
          fillMaterial={iconColor}
        />
      </Center>
    </group>
  );
};

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

      <group position-z={0.02}>
        {!isOn && <LockScreen />}
        <DeviceScreen
          width={0.335}
          height={0.745}
          resolutionScale={resolutionScale}
          isOn={isOn}
        />
      </group>
    </>
  );
}
