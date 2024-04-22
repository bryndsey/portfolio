import { BackgroundBlobs } from "@/components/scene/blobs/BackgroundBlobs";
import { pages } from "@/homepage/sections/Pages";
import { Page } from "@/components/Page";
import { CameraRig } from "@/components/scene/CameraRig";

export function Home() {
  return (
    <Page
      htmlChildren={<div style={{ height: `${pages.totalPages * 100}dvh` }} />}
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
