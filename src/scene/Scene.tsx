import { BackgroundBlobs } from "@/blobs/BackgroundBlobs";
import { pages } from "@/sections/Pages";
import HDRI from "@assets/empty_warehouse_01_1k.hdr?url";
import { useLoadingState } from "@hooks/useLoadingState";
import { Environment, Preload } from "@react-three/drei";
import { Suspense } from "react";
import { LoadingIndicator } from "./LoadingIndicator";
import { Postprocessing } from "./Postprocessing";

export interface SceneProps {
  children?: React.ReactNode;
}

export function Scene({ children }: SceneProps) {
  const { loadingState } = useLoadingState();

  return (
    <>
      {loadingState !== "loaded" && <LoadingIndicator />}
      <Suspense fallback={null}>
        <Environment files={HDRI} />
        <Preload all />

        <ambientLight intensity={0.75} />
        <Postprocessing />

        {children}
      </Suspense>
    </>
  );
}

export function HomeScene() {
  return (
    <Scene>
      <BackgroundBlobs />

      {pages.pagesWithStartIndex.map((page) => {
        return (
          <page.page.component
            key={page.page.id}
            startPageIndex={page.startIndex}
            exitPageIndex={page.startIndex + page.page.contentLength}
          />
        );
      })}
    </Scene>
  );
}
