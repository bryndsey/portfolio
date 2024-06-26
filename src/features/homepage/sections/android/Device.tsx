import { Center, Html, Svg, Text } from "@react-three/drei";
import { MeshBasicMaterial } from "three";
import { useHtmlPortal } from "@hooks/useHtmlPortal";
import { useScreenState } from "@hooks/useScreenState";
import LockIcon from "./icons/lock_FILL0_wght400_GRAD0_opsz48.svg";
import { PhoneModel } from "./PhoneModel";
import { ScreenContent } from "./ScreenContent";

interface DeviceScreenProps {
  width: number;
  height: number;
  resolutionScale?: number;
  isOn: boolean;
}

const DeviceScreen = (props: DeviceScreenProps) => {
  const { width, height, resolutionScale, isOn } = props;
  const scaleFactor = resolutionScale === undefined ? 1 : resolutionScale;

  const htmlPortal = useHtmlPortal();

  return (
    <Html
      transform
      portal={{ current: htmlPortal }}
      distanceFactor={1 / scaleFactor}
      style={{
        overflow: "hidden",
        borderRadius: 10 * scaleFactor,
        width: 400 * width * scaleFactor,
        height: 400 * height * scaleFactor,
        opacity: isOn ? 1 : 0,
        pointerEvents: isOn ? "auto" : "none",
      }}
    >
      <ScreenContent />
    </Html>
  );
};

const iconColor = new MeshBasicMaterial();

const LockScreen = () => {
  return (
    <group>
      <Text fontSize={0.02} position-y={0.2} color="white">
        Scroll to unlock
      </Text>
      <Center position-y={-0.2}>
        <Svg src={LockIcon.src} scale={0.00005} fillMaterial={iconColor} />
      </Center>
    </group>
  );
};

interface DeviceProps {
  isOn: boolean;
}

export function Device(props: DeviceProps) {
  const screenState = useScreenState();

  const useSmallResolution =
    screenState.deviceClass === "small" &&
    screenState.orientation === "portrait";
  const resolutionScale = useSmallResolution ? 2 : 2.5;

  const { isOn } = props;
  return (
    <>
      <PhoneModel scale={6} />

      <group position-z={0.03}>
        <DeviceScreen
          width={0.4}
          height={0.89}
          resolutionScale={resolutionScale}
          isOn={isOn}
        />
        {!isOn && <LockScreen />}
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
      </group>
    </>
  );
}
