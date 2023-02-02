import { PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "theatric";
import { Device } from "./Device";

const backgroundColor = "mediumseagreen";

function App() {
  const { cameraPosition } = useControls(
    {
      cameraPosition: { x: 0, y: 0, z: 3 },
    },
    { folder: "scene" }
  );

  return (
    <div id="App" style={{ height: "100%" }}>
      <Canvas style={{ backgroundColor: backgroundColor }}>
        <PerspectiveCamera
          makeDefault
          position={[cameraPosition.x, cameraPosition.y, cameraPosition.z]}
        />
        <ambientLight intensity={0.5} color={backgroundColor} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <Device />
      </Canvas>
    </div>
  );
}

export default App;
