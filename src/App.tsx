import {
  Environment,
  PerspectiveCamera,
  ScrollControls,
  Stats,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { pages } from "./pages/Pages";

const cameraPosition = { x: 0, y: 0, z: 2.5 };

function App() {
  return (
    <div id="App" className="bg-green-500 h-full font-sans">
      <Canvas>
        <Stats />
        <PerspectiveCamera
          makeDefault
          position={[cameraPosition.x, cameraPosition.y, cameraPosition.z]}
          fov={46}
        />
        <Environment preset="studio" blur={0.5} />
        <Suspense fallback={null}>
          <ScrollControls pages={pages.totalPages}>
            {/* <ambientLight intensity={0.5} /> */}
            {/* <directionalLight position={[10, 10, 10]} intensity={0.5} /> */}
            {pages.pagesWithStartIndex.map((page) => {
              return (
                <page.page.component
                  key={page.page.id}
                  startPageIndex={page.startIndex}
                  exitPageIndex={page.startIndex + page.page.contentLength}
                />
              );
            })}
          </ScrollControls>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
