import { PerspectiveCamera, ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { pages } from "./pages/Pages";

const cameraPosition = { x: 0, y: 0, z: 2 };

function App() {
  return (
    <div id="App" className="bg-green-500 h-full font-sans">
      <Canvas>
        {/* <Stats /> */}
        <PerspectiveCamera
          makeDefault
          position={[cameraPosition.x, cameraPosition.y, cameraPosition.z]}
        />
        <ScrollControls pages={pages.totalPages}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
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
      </Canvas>
    </div>
  );
}

export default App;
