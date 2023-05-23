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

function App_old() {
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

          <ScrollControls pages={pages.totalPages}>
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
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
}

function App() {
  return (
    <div id="App" className="font-sans">
      <div id="hero-section" className="h-screen bg-green-500"></div>
      <section id="about" className="p-8">
        <h2>About Me</h2>
        {"Here is where my 'About Me' content will go."}
        <br />
        {"Here is where my 'About Me' content will go."}
        <br />
        {"Here is where my 'About Me' content will go."}
        <br />
        {"Here is where my 'About Me' content will go."}
        <br />
        {"Here is where my 'About Me' content will go."}
        <br />
      </section>
      <section id="project-list" className="p-8 bg-green-500 min-h-screen">
        <h2>Projects</h2>
        <ul className="flex flex-col justify-stretch font-handwritten text-4xl font-extrabold">
          <li>SongSpark</li>
          <li>Pedals</li>
          <li>Tic-Tac-Toe+</li>
          <li>Android Projects</li>
        </ul>
      </section>
      <section id="links" className="p-8 bg-yellow-300">
        <h2>More of my stuff</h2>
        <ul>
          <li>Github</li>
          <li>CodeSandbox</li>
          <li>LinkedIn</li>
          <li>Google Play</li>
        </ul>
      </section>
    </div>
  );
}

export default App;
