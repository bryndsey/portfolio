import { Environment, Preload } from "@react-three/drei";
import { Suspense } from "react";
import HDRI from "./assets/empty_warehouse_01_1k.hdr?url";
import { pages } from "./pages/Pages";
import { useLoadingState } from "./useLoadingState";
import { CameraRig } from "./CameraRig";
import { LoadingIndicator } from "./LoadingIndicator";
import { BackgroundBlobs } from "./BackgroundBlobs";
import { Postprocessing } from "./Postprocessing";

export function Scene() {
  const { loadingState } = useLoadingState();

  return (
    <>
      {loadingState !== "loaded" && <LoadingIndicator />}
      <CameraRig />
      <Suspense fallback={null}>
        <Environment files={HDRI} />
        <Preload all />

        <BackgroundBlobs />
        {/* <ambientLight intensity={0.15} /> */}
        <Postprocessing />

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
    </>
  );
}
