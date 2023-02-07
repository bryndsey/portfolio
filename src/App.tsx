import { PerspectiveCamera, ScrollControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "theatric";
import { DevicePage } from "./DevicePage";
import { GuitarPage } from "./GuitarPage";
import { IntroText } from "./IntroText";

export const pageCount = 5;

export const guitarPageIndex = 1;
export const devicePageIndex = 2;

const backgroundColor = "mediumseagreen";

function App() {
  const { cameraPosition } = useControls(
    {
      cameraPosition: { x: 0, y: 0.25, z: 2 },
    },
    { folder: "scene" }
  );

  return (
    <div id="App" style={{ height: "100%" }}>
      <Canvas style={{ backgroundColor: backgroundColor }}>
        {/* <Stats /> */}
        <PerspectiveCamera
          makeDefault
          position={[cameraPosition.x, cameraPosition.y, cameraPosition.z]}
        />
        {/* <CameraControls /> */}
        <ScrollControls pages={pageCount}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          {/* <DeviceContainer />
        <GuitarContainer /> */}
          <IntroText />
          <GuitarPage />
          <DevicePage />
        </ScrollControls>
      </Canvas>
    </div>
  );
}

export default App;
