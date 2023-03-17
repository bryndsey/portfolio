import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Preload,
  ScrollControls,
  Stats,
  useHelper,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
// import { useControls } from "theatric";
import { CameraHelper, MathUtils, Vector3 } from "three";
import HDRI from "./assets/empty_warehouse_01_1k.hdr?url";
import { pages } from "./pages/Pages";

const cameraPosition = { x: 0, y: 0, z: 3 };

const targetCameraPositionVector = new Vector3(
  cameraPosition.x,
  cameraPosition.y,
  cameraPosition.z
);

const CameraRig = () => {
  // const { debugCamera } = useControls({
  //   debugCamera: false,
  // });
  const debugCamera = false;

  const mainCameraRef = useRef<THREE.PerspectiveCamera>(null!);
  useHelper(debugCamera ? mainCameraRef : null, CameraHelper);

  useFrame((state) => {
    mainCameraRef.current.position.lerp(targetCameraPositionVector, 0.1);
  });

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
      <Canvas
        onPointerMove={(e) => {
          if (e.pointerType === "mouse") {
            const normalizedX = MathUtils.mapLinear(
              e.clientX,
              0,
              e.currentTarget.clientWidth,
              -1,
              1
            );

            // Go from positive to negative to map properly
            const normalizedY = MathUtils.mapLinear(
              e.clientY,
              0,
              e.currentTarget.clientHeight,
              1,
              -1
            );
            targetCameraPositionVector.set(
              cameraPosition.x + normalizedX / 50,
              cameraPosition.y + normalizedY / 50,
              cameraPosition.z
            );
          }
        }}
        onPointerLeave={() => {
          targetCameraPositionVector.set(
            cameraPosition.x,
            cameraPosition.y,
            cameraPosition.z
          );
        }}
      >
        {import.meta.env.DEV && showStats && <Stats />}
        <CameraRig />
        <Suspense fallback={<ambientLight intensity={0.75} />}>
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
