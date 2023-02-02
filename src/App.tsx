import { PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "theatric";
import { Device } from "./Device";

function App() {
  const { position } = useControls(
    {
      position: { x: 0, y: 0, z: 3 },
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
