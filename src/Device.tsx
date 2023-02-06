import { Html, RoundedBox } from "@react-three/drei";
import { useThree, Vector3 } from "@react-three/fiber";
import { Color } from "three";
import { ScreenContent } from "./ScreenContent";

interface DeviceScreenProps {
  width: number;
  height: number;
  bezelSize: number;
  position: Vector3;
  resolutionScale?: number;
  isOn: boolean;
}

const DeviceScreen = (props: DeviceScreenProps) => {
  const { gl } = useThree();
  const { width, height, bezelSize, position, resolutionScale, isOn } = props;
  const scaleFactor = resolutionScale === undefined ? 1 : resolutionScale;
  return (
    <>
      {isOn && (
        <Html
          onClickCapture={() => console.log("Click captured")}
          transform
          occlude="blending"
          portal={{ current: gl.domElement.parentNode }}
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
      )}
      <mesh position={[position[0], position[1], position[2] + 0.001]}>
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
      </mesh>
    </>
  );
};

interface DeviceProps {
  width: number;
  height: number;
  thickness: number;
  bezelSize: number;
  isOn: boolean;
}

export function Device(props: DeviceProps) {
  return (
    <RoundedBox
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
        isOn={props.isOn}
      />
    </RoundedBox>
  );
}
