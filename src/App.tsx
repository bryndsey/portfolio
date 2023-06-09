import {
  Environment,
  Html,
  OrbitControls,
  PerspectiveCamera,
  Preload,
  ScrollControls,
  Stats,
  useHelper,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { Suspense, useRef } from "react";
// import { useControls } from "theatric";
import { CameraHelper, MathUtils, Vector2, Vector3 } from "three";
import HDRI from "./assets/empty_warehouse_01_1k.hdr?url";
import { pages } from "./pages/Pages";
import { ReactLenis } from "@studio-freight/react-lenis";

const lastNormalizedMousePosition = new Vector2();
export let normalizedMousePosition: Vector2 | null = null;

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

  useFrame(() => {
    let lerpFactor = 0.1;
    if (normalizedMousePosition === null) {
      targetCameraPositionVector.set(
        cameraPosition.x,
        cameraPosition.y,
        cameraPosition.z
      );
      lerpFactor = 0.025;
    } else {
      targetCameraPositionVector.set(
        cameraPosition.x + normalizedMousePosition.x / 50,
        cameraPosition.y + normalizedMousePosition.y / 50,
        cameraPosition.z
      );
    }

    mainCameraRef.current.position.lerp(targetCameraPositionVector, lerpFactor);
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

function LoadingIndicator() {
  return (
    <Html fullscreen className="h-screen flex place-content-center">
      <div className="font-handwritten text-4xl m-auto text-center">
        Loading . . .
      </div>
    </Html>
  );
}

function App() {
  // const { showStats } = useControls({
  //   showStats: true,
  // });
  const showStats = import.meta.env.DEV;

  return (
    <ReactLenis root>
      <div style={{ height: `${pages.totalPages * 100}vh` }} />
      <div id="App" className="bg-green-500 h-screen font-sans fixed inset-0">
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
              lastNormalizedMousePosition.set(normalizedX, normalizedY);
              normalizedMousePosition = lastNormalizedMousePosition;
            }
          }}
          onPointerLeave={() => {
            normalizedMousePosition = null;
          }}
          dpr={Math.min(window.devicePixelRatio, 2)}
        >
          {import.meta.env.DEV && showStats && <Stats />}
          {import.meta.env.DEV && showStats && <Perf position="bottom-left" />}
          <CameraRig />
          <Suspense fallback={<LoadingIndicator />}>
            <Environment files={HDRI} />
            <Preload all />

            {/* <ScrollControls pages={pages.totalPages}> */}
            <ambientLight intensity={0.15} />
            {pages.pagesWithStartIndex.map((page) => {
              return (
                <page.page.component
                  key={page.page.id}
                  startPageIndex={page.startIndex}
                  exitPageIndex={page.startIndex + page.page.contentLength}
                />
              );
            })}
            {/* </ScrollControls> */}
          </Suspense>
        </Canvas>
      </div>
    </ReactLenis>
  );
}

export default App;
