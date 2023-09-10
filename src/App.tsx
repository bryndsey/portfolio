import { Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
// import { useControls } from "theatric";
import { MathUtils, Vector2 } from "three";
import { pages } from "./pages/Pages";
import { ReactLenis } from "@studio-freight/react-lenis";
import AnimatedCursor from "react-animated-cursor";
import { PerformanceControl } from "./scene/PerformanceControl";
import { Scene } from "./scene/Scene";

const lastNormalizedMousePosition = new Vector2();
export let normalizedMousePosition: Vector2 | null = null;

function App() {
  // const { showStats } = useControls({
  //   showStats: true,
  // });
  const showStats = import.meta.env.DEV;

  return (
    <ReactLenis root options={{ syncTouch: true, touchInertiaMultiplier: 10 }}>
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
        className="bg-gradient-radial from-green-400 to-green-500 h-[100dvh] font-sans fixed inset-0"
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
        <Canvas
          gl={{
            powerPreference: "high-performance",
            stencil: false,
          }}
          shadows={false}
        >
          <PerformanceControl />
          {/* {import.meta.env.DEV && showStats && <Stats />} */}
          {import.meta.env.DEV && showStats && <Perf position="bottom-left" />}

          <Scene />
        </Canvas>
      </div>
    </ReactLenis>
  );
}

export default App;
