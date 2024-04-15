// import { Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
// import { useControls } from "theatric";
import { PerformanceControl } from "@scene/PerformanceControl";
import { Scene } from "@scene/Scene";
import { ReactLenis } from "@studio-freight/react-lenis";
import { useRef } from "react";
import { isFirefox, isSafari } from "react-device-detect";
import { CustomCursor } from "./CustomCursor";
import { GpuProvider, useGpuSettings } from "./gpuDetection";
import { MouseTracker } from "./mousePosition";
import { View } from "@react-three/drei";

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

const squigglyScaledClassName = "squiggly scale-[1.005]";

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
    <ReactLenis
      root
      options={{
        syncTouch: true,
        touchInertiaMultiplier: 10,
      }}
    >
      <MouseTracker>
        <div ref={containerRef}>
          <div className="fixed inset-0 bg-gradient-radial from-green-400 to-green-500 -z-50" />
          <div
            className={`${
              shouldBeSquiggly ? squigglyScaledClassName : undefined
            }`}
          >
            {htmlChildren}
          </div>

          <Canvas
            gl={{
              powerPreference: "high-performance",
              stencil: false,
            }}
            shadows={false}
            eventSource={containerRef}
            eventPrefix="client"
            className={`pointer-events-none ${
              shouldBeSquiggly ? squigglyScaledClassName : undefined
            }`}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: "100dvh",
            }}
          >
            <PerformanceControl />
            {import.meta.env.DEV && showStats && (
              <Perf position="bottom-left" />
            )}

            <Scene>
              {canvasChildren}
              <View.Port />
            </Scene>
          </Canvas>
          <div
            id="htmlPortal"
            className={`${
              shouldBeSquiggly ? squigglyScaledClassName : undefined
            } fixed top-0 left-0 w-0 h-0`}
          ></div>
          <CustomCursor />
        </div>
      </MouseTracker>
    </ReactLenis>
  );
}

export default App;
