import { BackgroundBlobs } from "@/blobs/BackgroundBlobs";
import { pages } from "@/sections/Pages";
import App from "@/App";

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
