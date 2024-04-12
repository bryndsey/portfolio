import { BackgroundBlobs } from "@/blobs/BackgroundBlobs";
import { pages } from "@/sections/Pages";
import App from "@/App";
import { CameraRig } from "@/scene/CameraRig";

export function Home() {
  return (
    <App
      htmlChildren={<div style={{ height: `${pages.totalPages * 100}vh` }} />}
      canvasChildren={<HomeContent />}
    />
  );
}

function HomeContent() {
  return (
    <>
      <CameraRig />
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
    </>
  );
}
