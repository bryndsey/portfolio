// import { Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
// import { useControls } from "theatric";
import { PerformanceControl } from "@/components/scene/PerformanceControl";
import { Scene } from "@/components/scene/Scene";
import { ReactLenis } from "@studio-freight/react-lenis";
import { useRef } from "react";
import { isFirefox, isSafari } from "react-device-detect";
import { CustomCursor } from "./CustomCursor";
import { GpuProvider, useGpuSettings } from "./GpuDetection";
import { MouseTracker } from "./MousePosition";
import { View } from "@react-three/drei";

interface PageProps {
  htmlChildren?: React.ReactNode;
  canvasChildren?: React.ReactNode;
}

export function Page({ htmlChildren, canvasChildren }: PageProps) {
  return (
    <GpuProvider>
      <PageContent
        canvasChildren={canvasChildren}
        htmlChildren={htmlChildren}
      />
    </GpuProvider>
  );
}

interface PageContentProps {
  canvasChildren?: React.ReactNode;
  htmlChildren?: React.ReactNode;
}

const squigglyScaledClassName = "squiggly scale-[1.005]";

function PageContent({ canvasChildren, htmlChildren }: PageContentProps) {
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
