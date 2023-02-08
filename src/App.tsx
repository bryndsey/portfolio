import { PerspectiveCamera, ScrollControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "theatric";
import { pages } from "./pages/Pages";

const backgroundColor = "mediumseagreen";

function App() {
  const { cameraPosition } = useControls(
    {
      cameraPosition: { x: 0, y: 0.25, z: 2 },
    },
    { folder: "scene" }
  );

  return (
    <div id="App" style={{ height: "100%" }}>
      <Canvas style={{ backgroundColor: backgroundColor }}>
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
