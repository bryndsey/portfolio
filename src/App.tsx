import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Preload,
  ScrollControls,
  Stats,
  useHelper,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
// import { useControls } from "theatric";
import { CameraHelper } from "three";
import HDRI from "./assets/empty_warehouse_01_1k.hdr?url";
import { pages } from "./pages/Pages";

const cameraPosition = { x: 0, y: 0, z: 3 };

const CameraRig = () => {
  // const { debugCamera } = useControls({
  //   debugCamera: false,
  // });
  const debugCamera = false;

  const mainCameraRef = useRef<THREE.PerspectiveCamera>(null!);
  useHelper(debugCamera ? mainCameraRef : null, CameraHelper);

  return (
    <>
      <PerspectiveCamera
        ref={mainCameraRef}
        makeDefault={!debugCamera}
        position={[cameraPosition.x, cameraPosition.y, cameraPosition.z]}
        fov={35}
      />
      {debugCamera && (
        <>
          <PerspectiveCamera
            makeDefault={debugCamera}
            position={[cameraPosition.x, cameraPosition.y, cameraPosition.z]}
            fov={46}
          />
          <OrbitControls enabled={debugCamera} />
        </>
      )}
    </>
  );
};

function App() {
  // const { showStats } = useControls({
  //   showStats: true,
  // });
  const showStats = import.meta.env.DEV;

  return (
    <div id="App" className="bg-green-500 h-screen font-sans">
      <Canvas>
        {import.meta.env.DEV && showStats && <Stats />}
        <CameraRig />
        <Suspense fallback={null}>
          <Environment files={HDRI} />
          <Preload all />
        </Suspense>
        <ScrollControls pages={pages.totalPages}>
          <ambientLight intensity={0.15} />
          {/* <directionalLight position={[10, 10, 10]} intensity={0.5} /> */}
          {pages.pagesWithStartIndex.map((page) => {
            return (
              <page.page.component
                key={page.page.id}
                startPageIndex={page.startIndex}
                exitPageIndex={page.startIndex + page.page.contentLength}
              />
            );
          })}
        </ScrollControls>
      </Canvas>
    </div>
  );
}

export default App;
