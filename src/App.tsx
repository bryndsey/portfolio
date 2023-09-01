import {
  Environment,
  Float,
  Html,
  OrbitControls,
  PerformanceMonitor,
  PerspectiveCamera,
  Preload,
  Stats,
  useHelper,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { Suspense, useEffect, useRef } from "react";
// import { useControls } from "theatric";
import { CameraHelper, MathUtils, Vector2, Vector3 } from "three";
import HDRI from "./assets/empty_warehouse_01_1k.hdr?url";
import { pages } from "./pages/Pages";
import { ReactLenis } from "@studio-freight/react-lenis";
import { Blob } from "./Blob";
import AnimatedCursor from "react-animated-cursor";
import { useLoadingState } from "./useLoadingState";
import { animated } from "@react-spring/three";
import { animated as animatedDom, useSpringValue } from "@react-spring/web";
import { easings } from "@react-spring/web";
import { EffectComposer, N8AO } from "@react-three/postprocessing";

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
  const { loadingTransistionValue } = useLoadingState();
  const initialAnimationValue = useSpringValue(0, {
    config: { duration: 450, easing: easings.easeOutBack },
  });

  useEffect(() => {
    initialAnimationValue.start(1);
  }, []);
  return (
    <Html fullscreen className="h-screen flex place-content-center">
      <animatedDom.div
        className="font-handwritten text-4xl m-auto text-center"
        style={{
          scale: loadingTransistionValue.to((value) =>
            easings.easeOutBack(1 - Math.min(1, value * 2))
          ),
        }}
      >
        <animatedDom.div
          style={{
            scale: initialAnimationValue,
          }}
        >
          Loading . . .
        </animatedDom.div>
      </animatedDom.div>
    </Html>
  );
}

function BackgroundBlobs() {
  const { loadingTransistionValue } = useLoadingState();
  return (
    <>
      <animated.group
        position-y={loadingTransistionValue
          .to((value) => easings.easeOutExpo(value))
          .to([0, 1], [3, 0])}
      >
        <Float floatIntensity={0.5} speed={0.66} rotationIntensity={0.5}>
          <group position={[2.66, 1, -5.5]}>
            <Blob
              speed={0.2}
              blobbiness={1}
              size={1.5}
              color={"#16a34a"}
              opacity={0.15}
            />
          </group>
        </Float>
      </animated.group>
      <animated.group
        position-y={loadingTransistionValue
          .to((value) => easings.easeOutCirc(value))
          .to([0, 1], [3, 0])}
      >
        <Float floatIntensity={0.5} speed={0.66} rotationIntensity={0.5}>
          <group position={[-2.5, 2.5, -6]}>
            <Blob
              speed={0.2}
              blobbiness={1.2}
              size={3}
              color={"#16a34a"}
              opacity={0.15}
            />
          </group>
        </Float>
      </animated.group>
      <animated.group
        position-y={loadingTransistionValue
          .to((value) => easings.easeOutSine(value))
          .to([0, 1], [-3, 0])}
      >
        <Float floatIntensity={0.5} speed={0.5} rotationIntensity={0.5}>
          <group position={[-0.5, -3.5, -5]}>
            <Blob
              speed={0.2}
              blobbiness={1.1}
              size={6.5}
              color={"#16a34a"}
              opacity={0.15}
            />
          </group>
        </Float>
      </animated.group>
    </>
  );
}

function PerformanceControl() {
  const setDpr = useThree((state) => state.setDpr);
  return (
    <PerformanceMonitor
      factor={0.6}
      bounds={(refreshRate) => {
        return refreshRate > 60 ? [50, 60] : [25, 45];
      }}
      onChange={({ factor }) => {
        const newDpr = 0.5 + 1.5 * factor;
        setDpr(Math.min(window.devicePixelRatio, newDpr));
      }}
    ></PerformanceMonitor>
  );
}

function App() {
  // const { showStats } = useControls({
  //   showStats: true,
  // });
  const showStats = import.meta.env.DEV;

  const { loadingState } = useLoadingState();

  return (
    <ReactLenis root>
      <div style={{ height: `${pages.totalPages * 100}vh` }} />
      <div>
        <AnimatedCursor
          innerSize={20}
          innerScale={2}
          outerAlpha={0}
          innerStyle={{ backgroundColor: "rgba(0, 150, 60, 0.97)" }}
        />
      </div>
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
          onPointerLeave={(e) => {
            const clientRect = e.currentTarget.getBoundingClientRect();
            if (
              e.clientX < clientRect.left ||
              e.clientY < clientRect.top ||
              e.clientX > clientRect.right ||
              e.clientY > clientRect.bottom
            ) {
              normalizedMousePosition = null;
            }
          }}
        >
          <PerformanceControl />

          {import.meta.env.DEV && showStats && <Stats />}
          {import.meta.env.DEV && showStats && <Perf position="bottom-left" />}
          <CameraRig />
          {loadingState !== "loaded" && <LoadingIndicator />}
          <Suspense fallback={null}>
            <Environment files={HDRI} />
            <Preload all />

            <BackgroundBlobs />
            {/* <ambientLight intensity={0.15} /> */}
            <EffectComposer>
              <N8AO
                aoRadius={0.5}
                distanceFalloff={0.08}
                intensity={6}
                quality="medium"
                halfRes
                depthAwareUpsampling
              />
            </EffectComposer>

            {pages.pagesWithStartIndex.map((page) => {
              return (
                <page.page.component
                  key={page.page.id}
                  startPageIndex={page.startIndex}
                  exitPageIndex={page.startIndex + page.page.contentLength}
                />
              );
            })}
          </Suspense>
        </Canvas>
      </div>
    </ReactLenis>
  );
}

export default App;
