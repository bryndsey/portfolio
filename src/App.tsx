import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  ScrollControls,
  Sphere,
  Stats,
  useHelper,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { useControls } from "theatric";
import { CameraHelper } from "three";
import { pages } from "./pages/Pages";
import HDRI from "./assets/studio_small_03_1k.hdr?url";

const cameraPosition = { x: 0, y: 0, z: 3 };

const CameraRig = () => {
  const { debugCamera } = useControls({
    debugCamera: false,
  });
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
      {/* <Sphere args={[0.1]} position={[xOffset, 0, zPosition]}>
        <meshBasicMaterial color={"blue"} />
      </Sphere> */}
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
  const { showStats } = useControls({
    showStats: true,
  });
  return (
    <div id="App" className="bg-green-500 h-screen font-sans">
      <Canvas>
        {showStats && <Stats />}
        <CameraRig />
        <Environment files={HDRI} />
        <Suspense fallback={null}>
          <ScrollControls pages={pages.totalPages}>
            {/* <ambientLight intensity={0.5} /> */}
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
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
