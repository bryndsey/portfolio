import { Html, RoundedBox } from "@react-three/drei";
import { Vector3 } from "@react-three/fiber";
import { useControls, types } from "theatric";
import { Euler } from "three";

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
        background: "white",
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

export const Device = () => {
  const { rotation, size, bezelSize } = useControls(
    {
      rotation: {
        x: types.number(-0.2, { range: [-Math.PI, Math.PI] }),
        y: types.number(0.2, { range: [-Math.PI, Math.PI] }),
        z: types.number(0.1, { range: [-Math.PI, Math.PI] }),
      },
      size: {
        width: types.number(1, { nudgeMultiplier: 0.1 }),
        height: types.number(2, { nudgeMultiplier: 0.1 }),
        thickness: types.number(0.1, { nudgeMultiplier: 0.01 }),
      },
      bezelSize: 32,
    },
    { folder: "device" }
  );

  return (
    <RoundedBox
      args={[size.width, size.height, size.thickness]}
      rotation={new Euler(rotation.x, rotation.y, rotation.z)}
      radius={0.033}
    >
      <meshStandardMaterial color="dimgray" />
      <DeviceScreen
        width={size.width}
        height={size.height}
        bezelSize={bezelSize}
        position={[0, 0.01, size.thickness / 2 + 0.001]}
        resolutionScale={1}
      />
    </RoundedBox>
  );
};

function ScreenContent() {
  return (
    <div style={{ padding: 8 }}>
      <h1>Bryan Lindsey</h1>
      <h2>Developer Extraordinaire</h2>
      <ul>
        <li>Android</li>
        <li>React</li>
        <li>Music</li>
        <li>Video Games</li>
      </ul>
    </div>
  );
}
