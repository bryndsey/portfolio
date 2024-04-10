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

interface AppProps {
  htmlChildren?: React.ReactNode;
  canvasChildren?: React.ReactNode;
}

function App({ htmlChildren, canvasChildren }: AppProps) {
  return (
    <GpuProvider>
      <ReactLenis
        root
        options={{ syncTouch: true, touchInertiaMultiplier: 10 }}
      >
        <AppContent
          htmlChildren={htmlChildren}
          canvasChildren={canvasChildren}
        />
      </ReactLenis>
    </GpuProvider>
  );
}

interface AppContentProps {
  htmlChildren?: React.ReactNode;
  canvasChildren?: React.ReactNode;
}

function AppContent({ htmlChildren, canvasChildren }: AppContentProps) {
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

  return (
    <>
      {htmlChildren}
      <div
        id="App"
        className="bg-gradient-radial from-green-400 to-green-500 h-[100dvh] font-sans fixed inset-0"
      >
        <MouseTracker>
          <Canvas
            gl={{
              powerPreference: "high-performance",
              stencil: false,
            }}
            shadows={false}
            className={shouldBeSquiggly ? "squiggly scale-[1.005]" : undefined}
          >
            <PerformanceControl />
            {/* {import.meta.env.DEV && showStats && <Stats />} */}
            {import.meta.env.DEV && showStats && (
              <Perf position="bottom-left" />
            )}

            <Scene>{canvasChildren}</Scene>
          </Canvas>
        </MouseTracker>
      </div>
      <CustomCursor />
    </>
  );
}

export default App;
