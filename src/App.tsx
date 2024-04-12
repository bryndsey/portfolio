// import { Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
// import { useControls } from "theatric";
import { PerformanceControl } from "@scene/PerformanceControl";
import { Scene } from "@scene/Scene";
import { ReactLenis } from "@studio-freight/react-lenis";
import { isFirefox, isSafari } from "react-device-detect";
import { CustomCursor } from "./CustomCursor";
import { GpuProvider, useGpuSettings } from "./gpuDetection";
import { MouseTracker } from "./mousePosition";
import { useRef } from "react";
import { MathUtils } from "three";

interface AppProps {
  htmlChildren?: React.ReactNode;
  canvasChildren?: React.ReactNode;
}

function App({ htmlChildren, canvasChildren }: AppProps) {
  return (
    <GpuProvider>
      <AppContent canvasChildren={canvasChildren} htmlChildren={htmlChildren} />
    </GpuProvider>
  );
}

interface AppContentProps {
  canvasChildren?: React.ReactNode;
  htmlChildren?: React.ReactNode;
}

const squigglyScaledClassName = "squiggly";

// export type NormalizedMousePosition = {
//   readonly x: number;
//   readonly y: number;
// };

// export let normalizedMousePosition: NormalizedMousePosition | null = null;

function AppContent({ canvasChildren, htmlChildren }: AppContentProps) {
  // const { showStats } = useControls({
  //   showStats: true,
  // });
  const showStats = import.meta.env.DEV;
  const gpuSettings = useGpuSettings();
  const shouldBeSquiggly =
    !isSafari &&
    !isFirefox &&
    gpuSettings !== null &&
    gpuSettings.type === "desktop" &&
    gpuSettings.tier >= 2;

  const containerRef = useRef<HTMLDivElement>(null!);

  return (
    // <div className="fixed inset-0">
    <ReactLenis
      root
      options={{
        syncTouch: true,
        touchInertiaMultiplier: 10,
        // wrapper: containerRef.current,
      }}
    >
      <MouseTracker>
        <div
          ref={containerRef}
          // className="relative"
          // className={`relative ${
          //   shouldBeSquiggly ? squigglyScaledClassName : undefined
          // }`}
        >
          <div className="fixed inset-0 bg-gradient-radial from-green-400 to-green-500 -z-50" />
          {/* <div className="fixed top-0 left-0 right-0 h-screen"> */}

          {/* <MouseTracker className="fixed inset-0" /> */}
          {htmlChildren}

          <Canvas
            gl={{
              powerPreference: "high-performance",
              stencil: false,
            }}
            shadows={false}
            eventSource={containerRef}
            eventPrefix="client"
            className="pointer-events-none"
            // className="fixed top-0 left-0 right-0 h-screen z-[-1]"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: "100vh",
              // pointerEvents: "none",
              // zIndex: -1,
            }}
          >
            <PerformanceControl />
            {import.meta.env.DEV && showStats && (
              <Perf position="bottom-left" />
            )}

            <Scene>{canvasChildren}</Scene>
          </Canvas>
          {/* </div> */}
          {/* </MouseTracker> */}
          <div id="htmlPortal" className="fixed top-0 left-0 w-0 h-0"></div>
          <CustomCursor />
        </div>
      </MouseTracker>
    </ReactLenis>
  );
}

export default App;
