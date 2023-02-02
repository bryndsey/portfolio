import { Html, PerspectiveCamera, RoundedBox } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls, types } from "theatric";
import { Euler } from "three";

const Device = () => {
  const { rotation, size, bezelSize } = useControls(
    {
      rotation: {
        x: types.number(-0.2, { range: [-Math.PI, Math.PI] }),
        y: types.number(0.2, { range: [-Math.PI, Math.PI] }),
        z: types.number(0.1, { range: [-Math.PI, Math.PI] }),
      },
      size: { width: 1, height: 2, thickness: 0.1 },
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
      <Html
        transform
        occlude
        distanceFactor={1}
        position={[0, 0.01, size.thickness / 2 + 0.001]}
        style={{
          background: "white",
          margin: 0,
          padding: 0,
          borderRadius: "8px",
          width: 400 * size.width - bezelSize,
          height: 400 * size.height - bezelSize,
        }}
      >
        <div style={{ padding: 8 }}>
          <p>Hello, World!</p>
          <button>Click me!</button>
        </div>
      </Html>
    </RoundedBox>
  );
};

function App() {
  const { position } = useControls(
    {
      position: { x: 0, y: 0, z: 5 },
    },
    { folder: "camera" }
  );

  return (
    <div id="App" style={{ height: "100%" }}>
      <Canvas>
        <PerspectiveCamera
          makeDefault
          position={[position.x, position.y, position.z]}
        />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Device />
      </Canvas>
    </div>
  );
}

export default App;
