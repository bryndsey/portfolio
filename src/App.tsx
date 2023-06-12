import {
  Environment,
  Float,
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
import { Blob } from "./Blob";

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

function BackgroundBlobs() {
  return (
    <>
      <Float floatIntensity={0.5} speed={0.66} rotationIntensity={0.5}>
        <group position={[2.66, 1, -5.5]}>
          <Blob
            speed={0.2}
            blobbiness={1}
            size={1.5}
            color={"limegreen"}
            opacity={0.15}
          />
        </group>
      </Float>
      <Float floatIntensity={0.5} speed={0.66} rotationIntensity={0.5}>
        <group position={[-2.5, 2.5, -6]}>
          <Blob
            speed={0.2}
            blobbiness={1.2}
            size={3}
            color={"limegreen"}
            opacity={0.15}
          />
        </group>
      </Float>
      <Float floatIntensity={0.5} speed={0.5} rotationIntensity={0.5}>
        <group position={[-0.5, -3.5, -5]}>
          <Blob
            speed={0.2}
            blobbiness={1.1}
            size={6.5}
            color={"limegreen"}
            opacity={0.15}
          />
        </group>
      </Float>
    </>
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
      <div
        id="App"
        className="bg-gradient-radial from-green-400 to-green-500 h-screen font-sans fixed inset-0"
      >
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

            <BackgroundBlobs />
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
