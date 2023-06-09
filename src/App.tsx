import {
  Environment,
  Html,
  OrbitControls,
  PerspectiveCamera,
  Preload,
  ScrollControls,
  Stats,
  View,
  useHelper,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { Suspense, useRef } from "react";
// import { useControls } from "theatric";
import { CameraHelper, MathUtils, Vector2, Vector3 } from "three";
import HDRI from "./assets/empty_warehouse_01_1k.hdr?url";
import { pages } from "./pages/Pages";
import { LinkPageContents } from "./pages/LinksPage";
import { AvatarModel } from "./pages/intro/AvatarModel";

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
  const eventSource = useRef<HTMLDivElement>(null!);
  const heroSectionTrackingRef = useRef<HTMLDivElement>(null!);

  return (
    <div id="App" className="font-sans relative" ref={eventSource}>
      <div
        id="hero-section"
        className="h-screen bg-green-500"
        ref={heroSectionTrackingRef}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();

          const normalizedX = MathUtils.mapLinear(
            e.nativeEvent.offsetX,
            0,
            rect.width,
            -1,
            1
          );

          // Go from positive to negative to map properly
          const normalizedY = MathUtils.mapLinear(
            e.nativeEvent.offsetY,
            0,
            rect.height,
            1,
            -1
          );
          lastNormalizedMousePosition.set(normalizedX, normalizedY);
          normalizedMousePosition = lastNormalizedMousePosition;
        }}
        onPointerLeave={() => {
          normalizedMousePosition = null;
        }}
      />
      <section id="about" className="p-8 min-h-screen">
        <h2 className="text-6xl font-extrabold">About Me</h2>
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
      <section
        id="project-list"
        className="p-8 bg-green-500 min-h-screen flex flex-col"
      >
        <h2 className="text-6xl font-extrabold">Projects</h2>
        <ul className="flex flex-col flex-grow gap-4 justify-evenly  ">
          <li>
            <h3 className="text-4xl font-handwritten font-extrabold">
              SongSpark
            </h3>
            <p>Tagline here</p>
          </li>
          <li>
            <h3 className="text-4xl font-handwritten font-extrabold">Pedals</h3>
            <p>Tagline here</p>
          </li>
          <li>
            <h3 className="text-4xl font-handwritten font-extrabold">
              Tic-Tac-Toe+
            </h3>
            <p>Tagline here</p>
          </li>
          <li>
            <h3 className="text-4xl font-handwritten font-extrabold">
              Android Projects
            </h3>
            <p>Tagline here</p>
          </li>
        </ul>
      </section>
      <section id="links" className="p-8 bg-yellow-300">
        {/* This is placeholder content for now - I want to make a better version of this */}
        <LinkPageContents />
      </section>

      <ProjectDescriptionPage />

      <Canvas
        style={{ position: "fixed", top: "0", left: "0", right: "0" }}
        eventSource={eventSource}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        {import.meta.env.DEV && <Stats />}
        {import.meta.env.DEV && <Perf position="bottom-left" />}
        <View track={heroSectionTrackingRef}>
          <CameraRig />
          <ambientLight intensity={0.15} />
          <AvatarModel position-y={-0.5} />
        </View>
      </Canvas>
    </div>
  );
}

export default App;

function ProjectDescriptionPage() {
  return (
    <div className="grid grid-cols-2 min-h-screen">
      <section className="p-8">
        <h2 className="text-6xl font-bold">Project title</h2>
        <br />
        <p>
          This is the project description. It will be kinda long and take up
          more space.
        </p>
        <button className="bg-yellow-300 p-2 rounded">Try it out!</button>
        <p>Tech stack info here</p>
      </section>
      <div id="project-hero-display" className="bg-green-500"></div>
    </div>
  );
}
