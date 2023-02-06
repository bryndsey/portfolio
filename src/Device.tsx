import { Html, RoundedBox } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import { Color } from "three";
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
      occlude="blending"
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
      {props.isOn && (
        <DeviceScreen
          width={props.width}
          height={props.height}
          bezelSize={props.bezelSize}
          position={[0, 0, props.thickness / 2 + 0.001]}
          resolutionScale={7.5}
        />
      )}
    </RoundedBox>
  );
}
