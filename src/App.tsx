// import { Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
// import { useControls } from "theatric";
import { pages } from "@sections/Pages";
import { ReactLenis } from "@studio-freight/react-lenis";
import AnimatedCursor from "react-animated-cursor";
import { PerformanceControl } from "@scene/PerformanceControl";
import { Scene } from "@scene/Scene";
import { MouseTracker, hasDetectedMouse } from "./mousePosition";
import { GpuProvider, useGpuSettings } from "./gpuDetection";
import { isFirefox, isSafari } from "react-device-detect";
import { useAtomValue } from "jotai";
import { Cursor } from "react-creative-cursor";
import "react-creative-cursor/dist/styles.css";

function App() {
  return (
    <GpuProvider>
      <ReactLenis
        root
        options={{ syncTouch: true, touchInertiaMultiplier: 10 }}
      >
        <div style={{ height: `${pages.totalPages * 100}vh` }} />
        <AppContent />
      </ReactLenis>
    </GpuProvider>
  );
}

function AppContent() {
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

  const mouseDetected = useAtomValue(hasDetectedMouse);

  return (
    <>
      {/* <AnimatedCursor
          innerSize={20}
          innerScale={2}
          outerAlpha={0}
          innerStyle={{
            backgroundColor: "rgba(0, 150, 60, 0.97)",
            animation: "squiggly-anim 0.66s linear infinite",
          }}
        /> */}
      {mouseDetected && (
        <Cursor
          animationDuration={0.2}
          cursorSize={20}
          cursorBackgrounColor="rgba(0, 150, 60, 0.97"
        />
      )}
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

            <Scene />
          </Canvas>
        </MouseTracker>
      </div>
    </>
  );
}

export default App;
